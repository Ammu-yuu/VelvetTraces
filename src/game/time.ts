import type { TimeZoneSetting } from './types'

const HOUR = 60 * 60 * 1000

/** Last Sunday of a month, at 01:00 UTC: when UK clocks change. */
function ukChangeover(year: number, month: number): number {
  const lastDay = new Date(Date.UTC(year, month + 1, 0))
  const lastSunday = lastDay.getUTCDate() - lastDay.getUTCDay()
  return Date.UTC(year, month, lastSunday, 1)
}

/** True when UK local time is BST (UTC+1) at the given UTC instant. */
export function isBritishSummerTime(utcMs: number): boolean {
  const year = new Date(utcMs).getUTCFullYear()
  return utcMs >= ukChangeover(year, 2) && utcMs < ukChangeover(year, 9)
}

/** Parse a zone-less timestamp as if it were UTC. */
export function parseNaive(shown: string): number {
  return Date.parse(`${shown}Z`)
}

/**
 * Convert a timestamp, as a source shows it, to UTC given the zone the
 * player believes the source uses. A UK local time in the skipped hour
 * (01:00 to 02:00 on the spring changeover) does not exist; it is treated
 * as GMT.
 */
export function toUtc(shown: string, zone: TimeZoneSetting): number {
  const naive = parseNaive(shown)
  if (zone === 'UTC') return naive
  return isBritishSummerTime(naive - HOUR) ? naive - HOUR : naive
}

export function formatClock(ms: number): string {
  return new Date(ms).toISOString().slice(11, 16)
}

/** The in-game clock, shown in UK local time as the player experiences it. */
export function formatUkLocal(ms: number): string {
  return new Date(ms).toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/London',
  })
}
