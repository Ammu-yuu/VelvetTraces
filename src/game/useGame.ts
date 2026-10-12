import { useEffect, useState } from 'react'
import { exhibits } from './case002'
import { leads as allLeads, people, QUESTIONS_EACH } from './interviews'
import { allItems, MOVE_MINUTES } from './scene'
import { ARRIVE_AT, CALL_OUT_AT, WIPE_AT } from './story'
import type { AreaId, ChapterId, ExhibitStatus, SceneFlag, SourceId, TimeZoneSetting } from './types'

/** Tools sit beside the chapters and open up as the story reaches them. */
export type View = 'chapter' | 'locker' | 'timeline'

export type Ending = 'closedAsSuicide'

export interface Delivered {
  id: string
  /** In-game time it arrived, UTC milliseconds. */
  at: number
}

export interface GameState {
  chapter: ChapterId
  view: View
  /** In-game time, UTC milliseconds. Advances only when the player acts. */
  clock: number
  inbox: Delivered[]
  ending: Ending | null
  /** Chapter 1: the player agreed to treat the death as unexplained. */
  unexplained: boolean
  area: AreaId
  /** Scene item id → the choice the player made. */
  decisions: Record<string, string>
  collected: string[]
  flags: Partial<Record<SceneFlag | 'phoneWiped', boolean>>
  /** Person id → question ids asked, in order. */
  asked: Record<string, string[]>
  leads: string[]
  status: Record<string, ExhibitStatus>
  notes: string
  /** The zone the player has decided each source uses; absent = not decided. */
  zones: Partial<Record<SourceId, TimeZoneSetting>>
  timelineLocked: boolean
}

const SAVE_KEY = 'velvet-traces:case002:v2'

/** Add ?dev to the URL to open every chapter and tool while building. */
export const devMode = new URLSearchParams(location.search).has('dev')

function newGame(): GameState {
  return {
    chapter: 1,
    view: 'chapter',
    clock: CALL_OUT_AT,
    inbox: ['brief1', 'brief2', 'brief3'].map((id) => ({ id, at: CALL_OUT_AT })),
    ending: null,
    unexplained: false,
    area: 'bedroom',
    decisions: {},
    collected: [],
    flags: {},
    asked: {},
    leads: [],
    status: Object.fromEntries(exhibits.map((e) => [e.id, 'unexamined'])),
    notes: '',
    zones: {},
    timelineLocked: false,
  }
}

function load(): GameState {
  try {
    const saved = localStorage.getItem(SAVE_KEY)
    if (saved) return { ...newGame(), ...JSON.parse(saved) }
  } catch {
    // A missing or corrupt save starts a new game.
  }
  return newGame()
}

function deliver(s: GameState, id: string, at = s.clock): GameState {
  if (s.inbox.some((m) => m.id === id)) return s
  return { ...s, inbox: [...s.inbox, { id, at }] }
}

/** Move the clock on. The remote erase lands at 10:20 on any phone still online. */
function advance(s: GameState, minutes: number): GameState {
  const next = { ...s, clock: s.clock + minutes * 60_000 }
  const phoneSafe = next.flags.phoneIsolated || next.flags.phoneOff
  if (next.chapter === 2 && next.clock >= WIPE_AT && !phoneSafe && !next.flags.phoneWiped) {
    return deliver({ ...next, flags: { ...next.flags, phoneWiped: true } }, 'wiped', WIPE_AT)
  }
  return next
}

export function useGame() {
  const [state, setState] = useState<GameState>(load)

  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state))
    } catch {
      // Saving is best effort; the game still works without it.
    }
  }, [state])

  return {
    state,
    open: (view: View) => setState((s) => ({ ...s, view })),

    answerBriefing: (unexplained: boolean) =>
      setState((s) =>
        unexplained ? deliver({ ...s, unexplained: true }, 'acceptUnexplained') : { ...s, ending: 'closedAsSuicide' },
      ),

    travelToScene: () =>
      setState((s) => deliver({ ...s, chapter: 2, view: 'chapter', clock: ARRIVE_AT }, 'arrival')),

    moveTo: (area: AreaId) => setState((s) => (s.area === area ? s : advance({ ...s, area }, MOVE_MINUTES))),

    decide: (itemId: string, choiceId: string) =>
      setState((s) => {
        const choice = allItems.find((i) => i.id === itemId)?.choices.find((c) => c.id === choiceId)
        if (!choice || s.decisions[itemId]) return s
        // The flag takes effect as the action starts: bagging the phone beats a wipe mid-task.
        let next: GameState = {
          ...s,
          decisions: { ...s.decisions, [itemId]: choiceId },
          collected: choice.collects ? [...s.collected, choice.collects] : s.collected,
          flags: choice.sets ? { ...s.flags, [choice.sets]: true } : s.flags,
        }
        next = advance(next, choice.minutes)
        if (choice.sets === 'laptopLocked') next = deliver(next, 'laptopLocked')
        return next
      }),

    leaveScene: () =>
      setState((s) => {
        // Leaving early doesn't dodge the 10:20 erase: the story waits for it.
        let next = s.clock < WIPE_AT ? advance(s, (WIPE_AT - s.clock) / 60_000) : s
        if (next.flags.phoneIsolated) next = deliver(next, 'wipeBlocked')
        if (next.flags.phoneWiped && !s.flags.phoneWiped) {
          next = { ...next, inbox: next.inbox.filter((m) => m.id !== 'wiped') }
          next = deliver(next, 'wipedAfterLeaving')
        }
        return deliver({ ...next, chapter: 3, view: 'chapter' }, 'leftScene')
      }),

    ask: (personId: string, questionId: string) =>
      setState((s) => {
        const person = people.find((p) => p.id === personId)
        const question = person?.questions.find((q) => q.id === questionId)
        const asked = s.asked[personId] ?? []
        if (!person || !question || asked.includes(questionId) || asked.length >= QUESTIONS_EACH) return s
        if (question.requires && !s.leads.includes(question.requires)) return s
        // The conversation's time is spent when it starts.
        let next: GameState = { ...s, asked: { ...s.asked, [personId]: [...asked, questionId] } }
        if (question.gives && allLeads[question.gives] && !s.leads.includes(question.gives)) {
          next = { ...next, leads: [...next.leads, question.gives] }
        }
        return asked.length === 0 ? advance(next, person.minutes) : next
      }),

    finishAccounts: () =>
      setState((s) => deliver({ ...s, chapter: 4, view: 'chapter' }, 'accountsDone')),

    examine: (id: string) =>
      setState((s) => {
        const exhibit = exhibits.find((e) => e.id === id)
        if (!exhibit || s.status[id] !== 'unexamined') return s
        return advance({ ...s, status: { ...s.status, [id]: 'examined' } }, exhibit.examineMinutes)
      }),
    toggleFlag: (id: string) =>
      setState((s) => {
        if (s.status[id] === 'unexamined') return s
        const next = s.status[id] === 'flagged' ? 'examined' : 'flagged'
        return { ...s, status: { ...s.status, [id]: next } }
      }),
    setNotes: (notes: string) => setState((s) => ({ ...s, notes })),
    setZone: (source: SourceId, zone: TimeZoneSetting) =>
      setState((s) => (s.timelineLocked ? s : { ...s, zones: { ...s.zones, [source]: zone } })),
    lockTimeline: () => setState((s) => ({ ...s, timelineLocked: true })),
    restart: () => setState(newGame()),
  }
}

export type Game = ReturnType<typeof useGame>
