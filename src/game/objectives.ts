import { people, QUESTIONS_EACH } from './interviews'
import { allItems } from './scene'
import type { GameState } from './useGame'

export interface Objective {
  text: string
  done: boolean
}

/** What the player should be working towards in the current chapter. */
export function objectives(s: GameState): Objective[] {
  switch (s.chapter) {
    case 1:
      return [
        { text: 'Read DS Khatri’s messages', done: true },
        { text: 'Decide how to treat the death', done: s.unexplained },
        { text: 'Travel to the scene', done: false },
      ]
    case 2: {
      const handled = allItems.filter((i) => s.decisions[i.id]).length
      return [
        { text: 'Deal with her phone', done: Boolean(s.decisions.phone) },
        { text: 'Deal with the laptop', done: Boolean(s.decisions.laptop) },
        { text: `Check every room (${handled} of ${allItems.length} items handled)`, done: handled === allItems.length },
        { text: 'Leave the scene when you are done', done: false },
      ]
    }
    case 3:
      return [
        ...people.map((p) => ({
          text: `Speak to ${p.name}`,
          done: (s.asked[p.id]?.length ?? 0) >= QUESTIONS_EACH,
        })),
        { text: 'Update DS Khatri', done: false },
      ]
    default:
      return [{ text: 'This chapter is still being built', done: false }]
  }
}
