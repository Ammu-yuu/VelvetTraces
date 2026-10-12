/** How a source stores or displays its timestamps. */
export type TimeZoneSetting = 'UTC' | 'UK_LOCAL'

export type SourceId = 'router' | 'watch' | 'laptop' | 'phone' | 'anpr'

export interface Source {
  id: SourceId
  label: string
  exhibit: string
  /** The zone the source really uses. The player has to work this out. */
  trueZone: TimeZoneSetting
}

export type ExhibitStatus = 'unexamined' | 'examined' | 'at-lab' | 'flagged'

export interface Exhibit {
  id: string
  label: string
  description: string
  /** In-game minutes spent when the player examines it. */
  examineMinutes: number
  /** What the player learns on examination. */
  finding: string
}

export type ChapterId = 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface Chapter {
  id: ChapterId
  title: string
  summary: string
}

export interface Message {
  id: string
  from: string
  text: string
}

/** How good a handling decision was, judged against real practice. */
export type Grade = 'good' | 'poor' | 'bad'

/** Something the player can set in motion with a choice. */
export type SceneFlag = 'phoneIsolated' | 'phoneOff' | 'laptopLocked' | 'routerLogLost' | 'notepadSpoiled'

export interface Choice {
  id: string
  label: string
  minutes: number
  grade: Grade
  /** What the player sees straight after choosing. */
  result: string
  /** Exhibit collected by this choice, if any. */
  collects?: string
  sets?: SceneFlag
  /** Why this was right or wrong, shown in the debrief. */
  debrief: string
}

export interface SceneItem {
  id: string
  name: string
  /** What the player sees on closer look, before choosing. */
  observation: string
  /** Hotspot position as a percentage of the room picture. */
  x: number
  y: number
  choices: Choice[]
}

export type AreaId = 'bedroom' | 'kitchen' | 'study' | 'hallway'

export interface Area {
  id: AreaId
  name: string
  description: string
  items: SceneItem[]
}

export interface TimelineEvent {
  id: string
  source: SourceId
  /** Timestamp exactly as the source shows it: ISO date and time, no zone. */
  shown: string
  label: string
}
