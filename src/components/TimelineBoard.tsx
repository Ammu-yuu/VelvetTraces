import { useCallback, useRef, useState } from 'react'
import { sources, timelineEvents } from '../game/case002'
import { formatClock, parseNaive, toUtc } from '../game/time'
import type { SourceId, TimeZoneSetting, TimelineEvent } from '../game/types'
import type { Game } from '../game/useGame'
import './TimelineBoard.css'

type Mode = 'shown' | 'utc'

const HOUR = 60 * 60 * 1000
/** UK clocks went forward at this instant on the night of the case. */
const CLOCK_CHANGE = Date.UTC(2026, 2, 29, 1)
/** Rough label width in px: 12px Inter runs about 6.5px a character, plus dot and time. */
const labelWidth = (label: string) => label.length * 6.5 + 70

const exhibitForSource: Record<SourceId, string | null> = {
  phone: 'RK/1',
  watch: 'RK/2',
  laptop: 'RK/3',
  router: 'RK/4',
  anpr: null,
}

const zoneLabel: Record<TimeZoneSetting, string> = {
  UTC: 'UTC',
  UK_LOCAL: 'UK local time',
}

interface Placed {
  event: TimelineEvent
  at: number
  /** True when normalising but the player hasn't set this source's zone. */
  unresolved: boolean
}

export function TimelineBoard({ game }: { game: Game }) {
  const { status, zones, timelineLocked } = game.state
  const [mode, setMode] = useState<Mode>('shown')
  const [trackWidth, setTrackWidth] = useState(600)
  const observer = useRef<ResizeObserver | null>(null)
  const measureTrack = useCallback((el: HTMLDivElement | null) => {
    observer.current?.disconnect()
    if (!el) return
    observer.current = new ResizeObserver(([entry]) => setTrackWidth(entry.contentRect.width))
    observer.current.observe(el)
  }, [])

  const isAvailable = (source: SourceId) => {
    const exhibit = exhibitForSource[source]
    return exhibit === null || status[exhibit] !== 'unexamined'
  }
  const activeSources = sources.filter((s) => isAvailable(s.id))

  const placed: Placed[] = timelineEvents
    .filter((e) => isAvailable(e.source))
    .map((event) => {
      const zone = zones[event.source]
      if (mode === 'shown' || !zone) {
        return { event, at: parseNaive(event.shown), unresolved: mode === 'utc' && !zone }
      }
      return { event, at: toUtc(event.shown, zone), unresolved: false }
    })

  if (placed.length === 0) {
    return (
      <>
        <h1 className="screen-title">Timeline</h1>
        <p className="screen-sub">Examine exhibits to bring their events onto the board.</p>
      </>
    )
  }

  const times = placed.map((p) => p.at)
  const start = Math.floor(Math.min(...times) / HOUR) * HOUR
  const end = Math.ceil(Math.max(...times) / HOUR) * HOUR + HOUR
  const pct = (ms: number) => ((ms - start) / (end - start)) * 100
  const ticks: number[] = []
  for (let t = start; t <= end; t += HOUR) ticks.push(t)

  const zonesCorrect = activeSources.filter((s) => zones[s.id] === s.trueZone).length

  return (
    <>
      <h1 className="screen-title">Timeline</h1>
      <p className="screen-sub">
        Each source keeps time its own way. Decide how each one records time, then normalise.
      </p>

      <section className="panel source-settings">
        {activeSources.map((source) => (
          <label key={source.id} className="source-row">
            <span>
              {source.label} <span className="exhibit-id">{source.exhibit}</span>
            </span>
            <select
              value={zones[source.id] ?? ''}
              disabled={timelineLocked}
              onChange={(e) => game.setZone(source.id, e.target.value as TimeZoneSetting)}
            >
              <option value="" disabled>
                Not decided
              </option>
              <option value="UTC">Records in UTC</option>
              <option value="UK_LOCAL">Records in UK local time</option>
            </select>
          </label>
        ))}
      </section>

      <div className="board-toolbar">
        <div className="toggle" role="group" aria-label="Time display">
          <button className={mode === 'shown' ? 'on' : ''} onClick={() => setMode('shown')}>
            As each source shows it
          </button>
          <button className={mode === 'utc' ? 'on' : ''} onClick={() => setMode('utc')}>
            Normalise to UTC
          </button>
        </div>
        <span className="muted">
          {mode === 'utc' ? 'Times below are UTC, using your settings.' : 'Times below are raw, mixed zones.'}
        </span>
      </div>

      <div className="panel board">
        <div className="board-lanes">
          {mode === 'utc' && CLOCK_CHANGE > start && CLOCK_CHANGE < end && (
            <div className="track-overlay" aria-hidden="true">
              <span className="clock-change" style={{ left: `${pct(CLOCK_CHANGE)}%` }}>
                UK clocks go forward
              </span>
            </div>
          )}
          {activeSources.map((source) => {
            const laneEvents = placed
              .filter((p) => p.event.source === source.id)
              .sort((a, b) => a.at - b.at)
            // Each row remembers where its last label ends (px); a label takes the first row it fits in.
            const rowEnds: number[] = []
            const laid = laneEvents.map((p) => {
              const x = pct(p.at)
              const xPx = (x / 100) * trackWidth
              let row = rowEnds.findIndex((endPx) => endPx < xPx)
              if (row === -1) row = rowEnds.length
              rowEnds[row] = xPx + labelWidth(p.event.label)
              return { ...p, x, row }
            })
            return (
              <div key={source.id} className="lane">
                <div className="lane-name">{source.label}</div>
                <div
                  className="lane-track"
                  ref={source === activeSources[0] ? measureTrack : undefined}
                  style={{ height: `${Math.max(1, rowEnds.length) * 22 + 20}px` }}
                >
                  {laid.map((p) => (
                    <div
                      key={p.event.id}
                      className={`event${p.unresolved ? ' unresolved' : ''}`}
                      style={{ left: `${p.x}%`, top: `${p.row * 22}px` }}
                      title={p.unresolved ? 'Zone not set for this source' : undefined}
                    >
                      <span className="dot" />
                      <span className="event-label">
                        {p.event.label} <span className="mono muted">{formatClock(p.at)}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="axis">
          {ticks.map((t) => (
            <span key={t} className="tick" style={{ left: `${pct(t)}%` }}>
              {formatClock(t)}
            </span>
          ))}
        </div>
      </div>

      <table className="event-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Source</th>
            <th>As shown</th>
            <th>Your setting</th>
            <th>Your UTC</th>
          </tr>
        </thead>
        <tbody>
          {timelineEvents
            .filter((e) => isAvailable(e.source))
            .map((e) => {
              const zone = zones[e.source]
              const source = sources.find((s) => s.id === e.source)!
              return (
                <tr key={e.id}>
                  <td>{e.label}</td>
                  <td>{source.label}</td>
                  <td className="mono">{e.shown.replace('T', ' ')}</td>
                  <td>{zone ? zoneLabel[zone] : <span className="muted">Not decided</span>}</td>
                  <td className="mono">{zone ? formatClock(toUtc(e.shown, zone)) : '–'}</td>
                </tr>
              )
            })}
        </tbody>
      </table>

      <div className="lock-row">
        {timelineLocked ? (
          <div className="panel assessment">
            <strong>Timeline locked.</strong> You set {zonesCorrect} of {activeSources.length} source
            zones correctly.{' '}
            {zonesCorrect === activeSources.length
              ? 'Every event sits where it really happened.'
              : 'Some events are out of place. Check how each source records time before you rely on the order of events.'}
          </div>
        ) : (
          <button
            className="btn primary"
            disabled={activeSources.some((s) => !zones[s.id])}
            onClick={() => {
              if (confirm('Lock the timeline? You will not be able to change source settings.')) game.lockTimeline()
            }}
          >
            Lock timeline for the report
          </button>
        )}
      </div>
    </>
  )
}
