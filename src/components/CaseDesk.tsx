import { exhibits } from '../game/case002'
import type { ExhibitStatus } from '../game/types'
import type { Game } from '../game/useGame'
import './CaseDesk.css'

const statusChip: Record<ExhibitStatus, { label: string; tone: string }> = {
  unexamined: { label: 'Not examined', tone: '' },
  examined: { label: 'Examined', tone: 'ok' },
  'at-lab': { label: 'At lab', tone: 'wait' },
  flagged: { label: 'Flagged', tone: 'alert' },
}

function duration(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return [h && `${h} h`, m && `${m} min`].filter(Boolean).join(' ')
}

export function CaseDesk({ game }: { game: Game }) {
  const { status, notes } = game.state

  return (
    <>
      <h1 className="screen-title">Exhibits</h1>
      <p className="screen-sub">
        Examining an exhibit takes in-game time. Flag anything you want to come back to.
      </p>

      <div className="exhibit-grid">
        {exhibits.map((exhibit) => {
          const s = status[exhibit.id]
          const chip = statusChip[s]
          return (
            <article key={exhibit.id} className={`panel exhibit${s === 'flagged' ? ' flagged' : ''}`}>
              <div className="exhibit-head">
                <span className="exhibit-id">{exhibit.id}</span>
                <span className={`chip ${chip.tone}`}>{chip.label}</span>
              </div>
              <h2 className="exhibit-name">{exhibit.label}</h2>
              <p className="muted exhibit-desc">{exhibit.description}</p>

              {s === 'unexamined' ? (
                <button className="btn" onClick={() => game.examine(exhibit.id)}>
                  Examine · {duration(exhibit.examineMinutes)}
                </button>
              ) : (
                <>
                  <p className="exhibit-finding">{exhibit.finding}</p>
                  <button className="btn" onClick={() => game.toggleFlag(exhibit.id)}>
                    {s === 'flagged' ? 'Remove flag' : 'Flag'}
                  </button>
                </>
              )}
            </article>
          )
        })}
      </div>

      <section className="panel notes">
        <label htmlFor="case-notes" className="notes-label">
          Case notes
        </label>
        <textarea
          id="case-notes"
          value={notes}
          onChange={(e) => game.setNotes(e.target.value)}
          placeholder="watch HR at 00:31 = 47? she couldn't have searched that"
        />
      </section>
    </>
  )
}
