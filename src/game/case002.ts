import type { Exhibit, Source, TimelineEvent } from './types'

/** All people, places and events in this case are fictional. */
export const caseInfo = {
  number: '002',
  title: 'Every Contact',
  reference: 'PVP/26/CR/031847',
  force: 'Pennine Valley Police',
  /** Player arrives at the scene: Sun 29 Mar 2026, 10:05 BST. */
  startsAt: Date.UTC(2026, 2, 29, 9, 5),
  labRequests: 6,
  inquestDays: 21,
}

export const sources: Source[] = [
  { id: 'phone', label: "Isla's phone", exhibit: 'RK/1', trueZone: 'UK_LOCAL' },
  { id: 'watch', label: 'Smartwatch', exhibit: 'RK/2', trueZone: 'UK_LOCAL' },
  { id: 'laptop', label: 'Laptop', exhibit: 'RK/3', trueZone: 'UTC' },
  { id: 'router', label: 'Home router', exhibit: 'RK/4', trueZone: 'UTC' },
  { id: 'anpr', label: 'ANPR', exhibit: 'ANPR', trueZone: 'UK_LOCAL' },
]

export const exhibits: Exhibit[] = [
  {
    id: 'RK/1',
    label: "Isla's phone",
    description: 'Samsung Galaxy S23, Faraday bag, powered',
    examineMinutes: 240,
    finding: 'Full file system extraction complete. WhatsApp, usage stats and Samsung Health data recovered.',
  },
  {
    id: 'RK/2',
    label: 'Smartwatch',
    description: 'Galaxy Watch6, data synced to RK/1',
    examineMinutes: 60,
    finding: 'Heart rate falls from 23:30. No steps after 23:34. One sharp wrist movement later in the night.',
  },
  {
    id: 'RK/3',
    label: 'Laptop and RAM capture',
    description: 'Dell XPS 13, BitLocker, captured live',
    examineMinutes: 300,
    finding: 'Overdose search in Chrome history. Evidence folder deleted with Shift+Delete. Unsent draft to research integrity.',
  },
  {
    id: 'RK/4',
    label: 'Router log',
    description: 'ISP hub, log exported before seizure',
    examineMinutes: 45,
    finding: 'A randomised MAC joined at 22:52 and left at 01:58. The same MAC appears on nine earlier weekends.',
  },
  {
    id: 'RK/5',
    label: 'The note',
    description: 'A5 lined sheet, black gel ink',
    examineMinutes: 90,
    finding: 'Letter shapes match Isla, but the writing is slow, with blunt stroke ends and pen lifts mid-word.',
  },
  {
    id: 'RK/6',
    label: 'Notepad',
    description: 'Desk notepad, top two sheets missing',
    examineMinutes: 30,
    finding: 'Faint indentations visible under oblique light. Needs ESDA before any chemical treatment.',
  },
]

/** Events the player can place on the timeline, as each source shows them. */
export const timelineEvents: TimelineEvent[] = [
  { id: 'e-kofi', source: 'phone', shown: '2026-03-28T19:05', label: 'WhatsApp to Kofi: "talk to him tonight"' },
  { id: 'e-join', source: 'router', shown: '2026-03-28T22:52', label: 'Device 4a:7c:e1:09:3b:d2 joins Wi-Fi' },
  { id: 'e-step', source: 'watch', shown: '2026-03-28T23:34', label: 'Last step recorded' },
  { id: 'e-search', source: 'laptop', shown: '2026-03-29T00:31', label: 'Search: amitriptyline overdose amount' },
  { id: 'e-delete', source: 'laptop', shown: '2026-03-29T00:58', label: 'Evidence folder deleted' },
  { id: 'e-wrist', source: 'watch', shown: '2026-03-29T02:46', label: 'Single wrist movement, HR 41' },
  { id: 'e-unlock', source: 'phone', shown: '2026-03-29T02:46', label: 'Unlocked by fingerprint' },
  { id: 'e-message', source: 'phone', shown: '2026-03-29T02:47', label: 'WhatsApp to Freya: "I\'m sorry"' },
  { id: 'e-leave', source: 'router', shown: '2026-03-29T01:58', label: 'Device 4a:7c:e1:09:3b:d2 leaves' },
  { id: 'e-anpr', source: 'anpr', shown: '2026-03-29T03:09', label: 'Vell\'s Volvo on Ashgrove Road' },
]
