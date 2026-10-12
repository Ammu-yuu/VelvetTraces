import { useState } from 'react'
import { leads, people, QUESTIONS_EACH } from '../game/interviews'
import type { Game } from '../game/useGame'
import './Interviews.css'

export function Interviews({ game }: { game: Game }) {
  const { asked, leads: known } = game.state
  const [personId, setPersonId] = useState(people[0].id)
  const person = people.find((p) => p.id === personId)!
  const askedHere = asked[person.id] ?? []
  const left = QUESTIONS_EACH - askedHere.length
  const allDone = people.every((p) => (asked[p.id]?.length ?? 0) >= QUESTIONS_EACH)

  return (
    <>
      <h1 className="screen-title">First accounts</h1>
      <p className="screen-sub">
        You get {QUESTIONS_EACH} questions with each person. Some questions only make sense once someone else has told
        you something.
      </p>

      <div className="accounts">
        <div className="people">
          {people.map((p) => {
            const n = asked[p.id]?.length ?? 0
            const state = n >= QUESTIONS_EACH ? 'Done' : n > 0 ? `${QUESTIONS_EACH - n} left` : 'Not spoken to'
            return (
              <button
                key={p.id}
                className={`person${p.id === personId ? ' on' : ''}`}
                onClick={() => setPersonId(p.id)}
              >
                <span className="person-name">{p.name}</span>
                <span className="muted person-role">{p.role}</span>
                <span className={`chip${n >= QUESTIONS_EACH ? ' ok' : ''}`}>{state}</span>
              </button>
            )
          })}
          <button className="btn primary update" disabled={!allDone} onClick={game.finishAccounts}>
            Update DS Khatri
          </button>
        </div>

        <div className="panel conversation">
          <div className="exhibit-id">
            {person.setting} · {person.minutes} min
          </div>
          <h2 className="item-title">{person.name}</h2>
          <p className="opening">{person.opening}</p>

          {askedHere.map((qid) => {
            const q = person.questions.find((x) => x.id === qid)!
            return (
              <div key={qid} className="exchange">
                <div className="you">{q.text}</div>
                <div className="them">{q.answer}</div>
                {q.gives && (
                  <div className="new-lead">
                    New lead: {leads[q.gives].text}
                  </div>
                )}
              </div>
            )
          })}

          {left > 0 ? (
            <>
              <div className="muted ask-count">
                {left} {left === 1 ? 'question' : 'questions'} left
                {askedHere.length === 0 && ` · starting this conversation takes ${person.minutes} min`}
              </div>
              <div className="choice-list">
                {person.questions
                  .filter((q) => !askedHere.includes(q.id))
                  .map((q) => {
                    const locked = Boolean(q.requires && !known.includes(q.requires))
                    return (
                      <button
                        key={q.id}
                        className="choice"
                        disabled={locked}
                        onClick={() => game.ask(person.id, q.id)}
                        title={locked ? 'You need to learn something from someone else first' : undefined}
                      >
                        {locked ? 'You don’t know enough to ask this yet' : q.text}
                      </button>
                    )
                  })}
              </div>
            </>
          ) : (
            <div className="muted ask-count">Conversation over.</div>
          )}
        </div>
      </div>
    </>
  )
}
