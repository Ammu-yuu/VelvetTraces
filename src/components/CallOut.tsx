import type { Game } from '../game/useGame'

export function CallOut({ game }: { game: Game }) {
  const { unexplained } = game.state

  return (
    <div className="story-card">
      <div className="exhibit-id">Sunday 29 March · 08:52</div>
      <h1 className="screen-title">Call-out</h1>
      <p>
        Your phone buzzes. It&rsquo;s DS Rana Khatri from Pennine Valley Police. A young woman has been found dead
        in her flat in Wyndhurst. Everyone at the scene thinks it&rsquo;s suicide.
      </p>
      <p className="muted">Read the messages on the right, then decide.</p>

      {!unexplained ? (
        <div className="choice-list">
          <button className="choice" onClick={() => game.answerBriefing(true)}>
            Treat it as unexplained. I&rsquo;ll attend and examine the devices.
          </button>
          <button className="choice" onClick={() => game.answerBriefing(false)}>
            It sounds like suicide. Recommend the coroner goes ahead.
          </button>
        </div>
      ) : (
        <button className="btn primary" onClick={game.travelToScene}>
          Travel to the scene
        </button>
      )}
    </div>
  )
}
