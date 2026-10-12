import type { AreaId } from '../game/types'

const wall = '#2a2326'
const floor = '#241e21'
const wood = '#4a3a2e'
const fabric = '#3a3034'
const pale = '#5a4c50'

/** Flat, stylised drawings of each room. Hotspots are laid over them separately. */
export function RoomPicture({ area }: { area: AreaId }) {
  return (
    <svg viewBox="0 0 600 340" className="room-svg" role="img" aria-label={`Drawing of the ${area}`}>
      <rect width="600" height="340" fill={wall} />
      <rect y="250" width="600" height="90" fill={floor} />
      {area === 'bedroom' && (
        <>
          <rect x="250" y="30" width="120" height="90" fill="#1a1517" stroke={fabric} strokeWidth="4" />
          <rect x="70" y="170" width="300" height="90" rx="6" fill={fabric} />
          <rect x="70" y="140" width="60" height="50" rx="6" fill={pale} />
          <path d="M120 175 Q230 150 370 180 L370 260 L120 260 Z" fill="#6E1423" opacity="0.7" />
          <rect x="420" y="180" width="100" height="80" fill={wood} />
          <rect x="455" y="168" width="28" height="12" rx="2" fill="#111" />
        </>
      )}
      {area === 'kitchen' && (
        <>
          <rect x="360" y="150" width="240" height="100" fill={wood} />
          <rect x="420" y="160" width="80" height="20" rx="4" fill={pale} />
          <rect x="60" y="200" width="250" height="14" fill={wood} />
          <rect x="80" y="214" width="10" height="46" fill={wood} />
          <rect x="280" y="214" width="10" height="46" fill={wood} />
          <rect x="160" y="190" width="40" height="10" fill="#E3D3B8" />
          <path d="M440 130 h10 v14 a8 8 0 0 1 -10 0 Z M465 130 h10 v14 a8 8 0 0 1 -10 0 Z" fill="#c9bfb5" />
          <rect x="480" y="110" width="14" height="40" rx="3" fill="#4a1520" />
          <rect x="300" y="196" width="24" height="8" fill="#c9bfb5" />
        </>
      )}
      {area === 'study' && (
        <>
          <rect x="420" y="30" width="140" height="100" fill="#1a1517" stroke={fabric} strokeWidth="4" />
          <rect x="60" y="170" width="480" height="16" fill={wood} />
          <rect x="80" y="186" width="12" height="74" fill={wood} />
          <rect x="508" y="186" width="12" height="74" fill={wood} />
          <rect x="250" y="110" width="110" height="60" rx="4" fill="#111" stroke={pale} strokeWidth="3" />
          <rect x="258" y="117" width="94" height="46" fill="#2b3a4a" />
          <rect x="125" y="160" width="50" height="12" fill="#E3D3B8" />
          <rect x="420" y="158" width="50" height="14" fill="#6E1423" />
        </>
      )}
      {area === 'hallway' && (
        <>
          <rect x="60" y="40" width="120" height="210" fill="#1a1517" stroke={fabric} strokeWidth="4" />
          <rect x="230" y="60" width="16" height="60" fill={pale} />
          <rect x="260" y="60" width="16" height="70" fill="#4a1520" />
          <rect x="300" y="150" width="160" height="10" fill={wood} />
          <rect x="340" y="122" width="44" height="28" rx="4" fill="#e9e3dc" />
          <circle cx="352" cy="132" r="2" fill="#3fbf6f" />
          <circle cx="362" cy="132" r="2" fill="#3fbf6f" />
          <rect x="230" y="236" width="40" height="14" rx="4" fill={fabric} />
        </>
      )}
    </svg>
  )
}
