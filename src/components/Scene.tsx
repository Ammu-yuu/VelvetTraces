import { useState } from 'react'
import { allItems, areas, MOVE_MINUTES } from '../game/scene'
import type { Game } from '../game/useGame'
import { RoomPicture } from './RoomPicture'
import './Scene.css'

function duration(minutes: number) {
  if (minutes === 0) return 'no time'
  if (minutes < 60) return `${minutes} min`
  return `${Math.floor(minutes / 60)} h ${minutes % 60 ? `${minutes % 60} min` : ''}`.trim()
}

export function Scene({ game }: { game: Game }) {
  const { area: areaId, decisions, flags } = game.state
  const [selected, setSelected] = useState<string | null>(null)
  const area = areas.find((a) => a.id === areaId)!
  const item = area.items.find((i) => i.id === selected) ?? null
  const decided = item ? decisions[item.id] : undefined
  const madeChoice = item?.choices.find((c) => c.id === decided)
  const [confirmLeave, setConfirmLeave] = useState(false)
  const unhandled = allItems.filter((i) => !decisions[i.id]).length

  return (
    <>
      <div className="scene-head">
        <div className="room-tabs" role="tablist" aria-label="Rooms">
          {areas.map((a) => {
            const left = a.items.filter((i) => !decisions[i.id]).length
            return (
              <button
                key={a.id}
                role="tab"
                aria-selected={a.id === areaId}
                className={a.id === areaId ? 'on' : ''}
                onClick={() => {
                  game.moveTo(a.id)
                  setSelected(null)
                }}
              >
                {a.name}
                {left > 0 && <span className="count">{left}</span>}
              </button>
            )
          })}
        </div>
        <span className="muted move-hint">Moving between rooms: {MOVE_MINUTES} min</span>
        <button className="btn" onClick={() => setConfirmLeave(true)}>
          Leave the scene
        </button>
      </div>

      {confirmLeave && (
        <div className="panel leave-confirm" role="alertdialog" aria-label="Leave the scene">
          <span>
            {unhandled
              ? `${unhandled} ${unhandled === 1 ? 'item has' : 'items have'} not been dealt with and will stay behind. `
              : 'Every item has been dealt with. '}
            Once you leave, you can&rsquo;t come back.
          </span>
          <button className="btn primary" onClick={game.leaveScene}>
            Leave the scene
          </button>
          <button className="btn" onClick={() => setConfirmLeave(false)}>
            Stay
          </button>
        </div>
      )}

      <div className="scene-body">
        <div className="room">
          <RoomPicture area={area.id} />
          {area.items.map((it, n) => (
            <button
              key={it.id}
              className={`marker${decisions[it.id] ? ' handled' : ''}${selected === it.id ? ' selected' : ''}`}
              style={{ left: `${it.x}%`, top: `${it.y}%` }}
              onClick={() => setSelected(it.id)}
              aria-label={it.name}
              title={it.name}
            >
              {decisions[it.id] ? '✓' : n + 1}
            </button>
          ))}
          {area.id === 'bedroom' && flags.phoneWiped && !decisions.phone && (
            <div className="alert-strip">The phone screen lights up: &ldquo;Erasing&hellip;&rdquo;</div>
          )}
        </div>

        <div className="panel item-panel">
          {!item ? (
            <>
              <h2 className="item-title">{area.name}</h2>
              <p>{area.description}</p>
              <p className="muted">Select a numbered marker to look closer.</p>
            </>
          ) : (
            <>
              <h2 className="item-title">{item.name}</h2>
              <p>{item.observation}</p>
              {item.id === 'phone' && flags.phoneWiped && (
                <p className="warn">The screen reads &ldquo;Erasing&hellip;&rdquo;. A remote wipe has arrived.</p>
              )}
              {madeChoice ? (
                <div className="outcome">
                  <div className="muted">You chose: {madeChoice.label}</div>
                  <p>{madeChoice.result}</p>
                  {madeChoice.collects && <span className="chip ok">Exhibit {madeChoice.collects}</span>}
                </div>
              ) : (
                <div className="choice-list">
                  {item.choices.map((c) => (
                    <button key={c.id} className="choice" onClick={() => game.decide(item.id, c.id)}>
                      {c.label}
                      <span className="choice-time">{duration(c.minutes)}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
