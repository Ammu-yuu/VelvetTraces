import { caseInfo } from '../game/case002'
import { chapters } from '../game/story'
import { formatUkLocal } from '../game/time'
import type { Game } from '../game/useGame'

export function TopBar({ game }: { game: Game }) {
  const { clock, chapter } = game.state
  const current = chapters.find((c) => c.id === chapter)!

  return (
    <header className="topbar">
      <div className="brand">
        <img src="/favicon.svg" width={28} height={28} alt="" />
        Velvet Traces
      </div>
      <span className="case-name">
        Case {caseInfo.number} · {caseInfo.title}
      </span>
      <span className="spacer" />
      <span className="muted">
        Chapter {chapter} · {current.title}
      </span>
      <span className="clock">{formatUkLocal(clock)}</span>
    </header>
  )
}
