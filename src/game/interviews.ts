/** How many questions the player may put to each person. */
export const QUESTIONS_EACH = 3

export interface Lead {
  id: string
  text: string
  source: string
}

export interface Question {
  id: string
  text: string
  answer: string
  /** Lead the player must already hold before this question can be asked. */
  requires?: string
  /** Lead the answer gives the player. */
  gives?: string
}

export interface Person {
  id: string
  name: string
  role: string
  /** Where and how the conversation happens. */
  setting: string
  minutes: number
  opening: string
  questions: Question[]
}

export const leads: Record<string, Lead> = {
  bee: { id: 'bee', source: 'Freya', text: 'Isla always called Freya “Bee”. Never “Frey”.' },
  better: { id: 'better', source: 'Freya', text: 'Isla was doing better this year. She had started running again.' },
  workWorry: { id: 'workWorry', source: 'Freya', text: 'Something at work was worrying Isla. It involved her supervisor.' },
  secret: { id: 'secret', source: 'Freya', text: 'Isla was seeing someone older, in secret, mostly at weekends.' },
  fraud: { id: 'fraud', source: 'Kofi', text: 'Isla found reused images in Vell’s 2022 paper and planned to report it.' },
  meeting: { id: 'meeting', source: 'Kofi', text: 'Isla planned to “talk to him” on Saturday night before sending her report.' },
  notLow: { id: 'notLow', source: 'Kofi', text: 'Kofi says Isla seemed scared but determined, not low.' },
  alibi: { id: 'alibi', source: 'Vell', text: 'Vell says he was at home with his wife all of Saturday night.' },
  denial: { id: 'denial', source: 'Vell', text: 'Vell denies Isla ever raised concerns about his data.' },
  vellLow: { id: 'vellLow', source: 'Vell', text: 'Vell says Isla “seemed tired and low” on Friday.' },
  rhysAway: { id: 'rhysAway', source: 'Rhys', text: 'Rhys says he was at a stag do in Brackenford all night. Photos online.' },
}

export const people: Person[] = [
  {
    id: 'freya',
    name: 'Freya Marchbank',
    role: 'Sister, found the body',
    setting: 'In the back of a police car outside the flat',
    minutes: 30,
    opening: 'Freya is wrapped in a foil blanket, her phone gripped in both hands. “I should have answered. I was asleep.”',
    questions: [
      {
        id: 'name',
        text: 'The note starts “Frey”. Is that what Isla called you?',
        answer: '“Frey? No. Never. She called me Bee, since we were tiny. Everyone else says Frey.” She stares at you. “Why would she write that?”',
        gives: 'bee',
      },
      {
        id: 'mood',
        text: 'How had Isla been lately?',
        answer: '“Better. Honestly better. She had a bad patch in the autumn, but this year she was running again, making plans.”',
        gives: 'better',
      },
      {
        id: 'worries',
        text: 'Was anything worrying her?',
        answer: '“Work. Something about her supervisor and his data. She said she couldn’t tell me yet, not until she was sure.”',
        gives: 'workWorry',
      },
      {
        id: 'partner',
        text: 'Was she seeing anyone?',
        answer: '“There was someone. Older, I think. She was weird about it. Weekends, mostly. She never said who.”',
        gives: 'secret',
      },
      {
        id: 'phone',
        text: 'Why didn’t you see her message until the morning?',
        answer: '“I’d done three nights. My phone goes on Do Not Disturb. I read it at half seven and drove straight here.”',
      },
    ],
  },
  {
    id: 'kofi',
    name: 'Dr Kofi Brennan',
    role: 'Colleague and friend',
    setting: 'By phone, Sunday afternoon',
    minutes: 25,
    opening: 'Kofi’s voice is unsteady. “I just heard. I don’t understand. I saw her on Friday.”',
    questions: [
      {
        id: 'friday',
        text: 'What happened on Friday?',
        answer: '“She pulled me into the tissue culture room and shut the door. She’d found the same western blot image in Vell’s 2022 paper three times, flipped. She was going to report it to research integrity.”',
        gives: 'fraud',
      },
      {
        id: 'last',
        text: 'When did you last hear from her?',
        answer: '“Saturday evening, about seven. She messaged: ‘Going to talk to him tonight before I send it.’ I told her to be careful.”',
        gives: 'meeting',
      },
      {
        id: 'mood',
        text: 'Did she seem low to you?',
        answer: '“Low? No. Scared, maybe. But determined. She’d made up her mind.”',
        gives: 'notLow',
      },
      {
        id: 'secret',
        text: 'Freya says Isla was seeing someone older. Do you know who?',
        answer: 'A long pause. “There were rumours in the lab. About her and Conrad. I never asked.”',
        requires: 'secret',
      },
      {
        id: 'lab',
        text: 'What was the lab like to work in?',
        answer: '“Intense. Conrad’s grant renewal is due in May. Everything depends on that paper.”',
      },
    ],
  },
  {
    id: 'vell',
    name: 'Prof. Conrad Vell',
    role: 'Isla’s supervisor',
    setting: 'Video call from his home study, Sunday afternoon',
    minutes: 40,
    opening: 'Vell sits in front of a wall of books. Neat, composed, a pressed shirt on a Sunday. “A terrible loss. Isla was brilliant. Whatever you need.”',
    questions: [
      {
        id: 'saturday',
        text: 'Where were you on Saturday night?',
        answer: '“At home in Hollins Park with my wife, all evening. We went to bed around eleven. I didn’t go out.”',
        gives: 'alibi',
      },
      {
        id: 'lastSeen',
        text: 'When did you last see Isla?',
        answer: '“Friday, about six, at the lab. She seemed tired. Low, if I’m honest. She’d struggled before, you know.”',
        gives: 'vellLow',
      },
      {
        id: 'concerns',
        text: 'Did Isla raise any concerns about the data in your 2022 paper?',
        answer: 'The smallest hesitation. “No. Never. Our data is sound. Where has that come from?”',
        requires: 'fraud',
        gives: 'denial',
      },
      {
        id: 'relationship',
        text: 'Was your relationship with Isla purely professional?',
        answer: 'His jaw tightens. “I’m not going to dignify that. I think we’re finished here.”',
        requires: 'secret',
      },
      {
        id: 'research',
        text: 'What was Isla working on?',
        answer: '“Follow-up work on our 2022 findings. Replication, extensions. Very promising.”',
      },
    ],
  },
  {
    id: 'rhys',
    name: 'Rhys Calloway',
    role: 'Ex-boyfriend',
    setting: 'By phone, Sunday evening',
    minutes: 20,
    opening: '“If this is about those texts, I know how it looks.”',
    questions: [
      {
        id: 'saturday',
        text: 'Where were you on Saturday night?',
        answer: '“Brackenford, at my mate’s stag do, from the afternoon until four in the morning. There are photos all over Instagram.”',
        gives: 'rhysAway',
      },
      {
        id: 'texts',
        text: 'Tell me about the messages you sent her in October.',
        answer: '“I was angry about the break-up. I said things I regret. We haven’t spoken since.”',
      },
      {
        id: 'new',
        text: 'Did you know if she was seeing anyone new?',
        answer: '“Someone from work, a mate said. I didn’t want to know.”',
      },
    ],
  },
]
