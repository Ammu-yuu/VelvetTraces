import type { Chapter, Message } from './types'

export const DS = 'DS Rana Khatri'

export const chapters: Chapter[] = [
  { id: 1, title: 'Call-out', summary: 'A death the coroner thinks is suicide.' },
  { id: 2, title: 'The scene', summary: 'Find and preserve the evidence before it is lost.' },
  { id: 3, title: 'First accounts', summary: 'Three questions each. Choose well.' },
  { id: 4, title: 'The lab', summary: 'Extract, image and test what you seized.' },
  { id: 5, title: 'The breakthrough', summary: 'Whose device was in the flat?' },
  { id: 6, title: 'The interview', summary: 'Advise on what to disclose.' },
  { id: 7, title: 'The report', summary: 'Build the timeline and state your findings.' },
]

/** Every message in the case. They are delivered by id as the story moves on. */
export const messages: Record<string, Message> = {
  brief1: {
    id: 'brief1',
    from: DS,
    text: 'Morning. Unexplained death at a flat in Wyndhurst. Woman, 29. Her sister found her at 08:20.',
  },
  brief2: {
    id: 'brief2',
    from: DS,
    text: 'Uniform think suicide: empty pill packets, a handwritten note, and a goodbye text sent at 02:47. The coroner’s officer is happy with that.',
  },
  brief3: {
    id: 'brief3',
    from: DS,
    text: 'Something’s bothering me. Her laptop is still on and there’s a lot of tech in that flat. Do we treat this as unexplained?',
  },
  acceptUnexplained: {
    id: 'acceptUnexplained',
    from: DS,
    text: 'Agreed. Scene is Flat 4, 17 Larkspur Row. Nothing has been moved. I’ll meet you there.',
  },
  arrival: {
    id: 'arrival',
    from: DS,
    text: 'You’re in. Her sister Freya is in the car outside with an officer. The flat is yours. Clock’s running.',
  },
  wiped: {
    id: 'wiped',
    from: DS,
    text: 'Did you see that? Her phone just lit up and started erasing itself. Someone sent a remote wipe.',
  },
  wipeBlocked: {
    id: 'wipeBlocked',
    from: DS,
    text: 'Just heard from the lab: someone tried to remote-wipe her phone at 10:20. It was already in a Faraday bag. Good call.',
  },
  wipedAfterLeaving: {
    id: 'wipedAfterLeaving',
    from: DS,
    text: 'Bad news. Someone remote-wiped her phone at 10:20. It was still online. We may only get what’s in the cloud now.',
  },
  accountsDone: {
    id: 'accountsDone',
    from: DS,
    text: 'Good work. Let\u2019s see what the devices say. Everything you seized is booked into the evidence locker.',
  },
  laptopLocked: {
    id: 'laptopLocked',
    from: DS,
    text: 'The laptop came back up on a BitLocker recovery screen. Without the key, we can’t get into it.',
  },
  leftScene: {
    id: 'leftScene',
    from: DS,
    text: 'Scene’s released. Next I need first accounts: the sister, a colleague, and her supervisor.',
  },
}

/** UK local 10:20 on the day: when the remote erase is sent. */
export const WIPE_AT = Date.UTC(2026, 2, 29, 9, 20)
/** UK local 08:52: the first message arrives. */
export const CALL_OUT_AT = Date.UTC(2026, 2, 29, 7, 52)
/** UK local 10:05: the player arrives at the flat. */
export const ARRIVE_AT = Date.UTC(2026, 2, 29, 9, 5)
