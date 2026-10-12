import { chapters } from '../game/story'
import { devMode, type Game, type View } from '../game/useGame'

const tools: { view: View; label: string; opensAt: number }[] = [
  { view: 'locker', label: 'Evidence locker', opensAt: 4 },
  { view: 'timeline', label: 'Timeline', opensAt: 7 },
]

export function ChapterRail({ game }: { game: Game }) {
  const { chapter, view } = game.state

  return (
    <nav className="rail" aria-label="Case progress">
      <div className="rail-heading">Chapters</div>
      <ol className="chapter-list">
        {chapters.map((c) => {
          const state = c.id < chapter ? 'done' : c.id === chapter ? 'current' : 'locked'
          return (
            <li key={c.id} className={`chapter ${state}`}>
              <button
                disabled={state !== 'current'}
                className={view === 'chapter' && state === 'current' ? 'active' : ''}
                onClick={() => game.open('chapter')}
              >
                <span className="chapter-num">{state === 'done' ? '✓' : c.id}</span>
                {c.title}
              </button>
            </li>
          )
        })}
      </ol>

      <div className="rail-heading">Tools</div>
      {tools.map((t) => {
        const open = devMode || chapter >= t.opensAt
        return (
          <button
            key={t.view}
            className={`rail-tool${view === t.view ? ' active' : ''}`}
            disabled={!open}
            onClick={() => game.open(t.view)}
            title={open ? undefined : `Opens in chapter ${t.opensAt}`}
          >
            {t.label}
            {!open && <span className="lock">ch. {t.opensAt}</span>}
          </button>
        )
      })}

      <span style={{ flex: 1 }} />
      <button
        className="rail-tool"
        onClick={() => {
          if (confirm('Restart the case? Your progress will be lost.')) game.restart()
        }}
      >
        Restart case
      </button>
    </nav>
  )
}
