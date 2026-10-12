import { useEffect, useRef, useState } from 'react'
import { leads as allLeads } from '../game/interviews'
import { objectives } from '../game/objectives'
import { messages } from '../game/story'
import { formatUkLocal } from '../game/time'
import type { Game } from '../game/useGame'

export function SidePanel({ game }: { game: Game }) {
  const { inbox, leads } = game.state
  const list = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(inbox.length)

  // Keep the newest message in view and mark what arrived since the last look.
  useEffect(() => {
    const el = list.current
    if (el) el.scrollTop = el.scrollHeight
    const timer = setTimeout(() => setSeen(inbox.length), 2500)
    return () => clearTimeout(timer)
  }, [inbox.length])

  return (
    <aside className="side">
      <section>
        <h2 className="side-heading">Objectives</h2>
        <ul className="objectives">
          {objectives(game.state).map((o) => (
            <li key={o.text} className={o.done ? 'done' : ''}>
              <span className="box" aria-hidden="true">{o.done ? '✓' : ''}</span>
              {o.text}
            </li>
          ))}
        </ul>
      </section>

      {leads.length > 0 && (
        <section>
          <h2 className="side-heading">Leads ({leads.length})</h2>
          <ul className="leads">
            {leads.map((id) => (
              <li key={id}>
                <span className="lead-source">{allLeads[id].source}</span> {allLeads[id].text}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="inbox-section">
        <h2 className="side-heading">Messages</h2>
        <div className="inbox" ref={list}>
          {inbox.map((m, n) => {
            const msg = messages[m.id]
            return (
              <div key={m.id} className={`msg${n >= seen ? ' new' : ''}`}>
                <div className="msg-meta">
                  {msg.from} · <span className="mono">{formatUkLocal(m.at).split(', ').pop()}</span>
                </div>
                <div>{msg.text}</div>
              </div>
            )
          })}
        </div>
      </section>
    </aside>
  )
}
