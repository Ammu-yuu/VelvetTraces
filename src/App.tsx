import { CallOut } from './components/CallOut'
import { CaseDesk } from './components/CaseDesk'
import { ChapterRail } from './components/ChapterRail'
import { GameOver } from './components/GameOver'
import { Interviews } from './components/Interviews'
import { Scene } from './components/Scene'
import { SidePanel } from './components/SidePanel'
import { TimelineBoard } from './components/TimelineBoard'
import { TopBar } from './components/TopBar'
import { chapters } from './game/story'
import { useGame, type Game } from './game/useGame'

function ChapterScreen({ game }: { game: Game }) {
  const { chapter } = game.state
  if (chapter === 1) return <CallOut game={game} />
  if (chapter === 2) return <Scene game={game} />
  if (chapter === 3) return <Interviews game={game} />

  const current = chapters.find((c) => c.id === chapter)!
  return (
    <div className="story-card">
      <div className="exhibit-id">Chapter {chapter}</div>
      <h1 className="screen-title">{current.title}</h1>
      <p>{current.summary}</p>
      <p className="muted">This chapter is being built next.</p>
    </div>
  )
}

export default function App() {
  const game = useGame()
  const { view, ending } = game.state

  return (
    <div className="app">
      <TopBar game={game} />
      <ChapterRail game={game} />
      <main className="main">
        {ending ? (
          <GameOver game={game} />
        ) : view === 'locker' ? (
          <CaseDesk game={game} />
        ) : view === 'timeline' ? (
          <TimelineBoard game={game} />
        ) : (
          <ChapterScreen game={game} />
        )}
      </main>
      <SidePanel game={game} />
    </div>
  )
}
