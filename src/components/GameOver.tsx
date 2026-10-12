import type { Game } from '../game/useGame'

export function GameOver({ game }: { game: Game }) {
  return (
    <div className="story-card">
      <div className="exhibit-id">Case closed</div>
      <h1 className="screen-title">Recorded as suicide</h1>
      <p>
        The coroner recorded that Isla Marchbank took her own life. Her laptop was returned to her family and wiped.
        Her phone was erased remotely that morning.
      </p>
      <p>
        Six weeks later, her colleague Kofi Brennan told a journalist that Isla had found fabricated data in her
        supervisor&rsquo;s research and was about to report it. By then, the evidence was gone.
      </p>
      <div className="panel debrief">
        <strong>What a real examiner would have done</strong>
        <p>
          A death is unexplained until the evidence says otherwise. A note, empty packets and a goodbye text are
          exactly what a staged suicide looks like. With active devices at the scene, the right call was to attend
          and preserve them.
        </p>
      </div>
      <button className="btn primary" onClick={game.restart}>
        Start the case again
      </button>
    </div>
  )
}
