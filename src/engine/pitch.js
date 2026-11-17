// Half pitch in metres. x runs left → right across the pitch (0..68),
// y runs from OUR goal line (0, top of the screen) to the halfway line (52.5, bottom).
// Opponents attack upwards, so "their right wing" is the right side of the screen.
export const PITCH = {
  width: 68,
  length: 52.5,
  goalWidth: 7.32,
  goalDepth: 2,
  boxWidth: 40.32,
  boxDepth: 16.5,
  sixWidth: 18.32,
  sixDepth: 5.5,
  penaltySpot: 11,
  circleRadius: 9.15,
}

// Visible area: a margin around the half so balls going out (clearances, shots) stay on screen.
export const VIEW = { x: -3, y: -4, width: 74, height: 60 }

export const TEAM_STYLE = {
  home: { fill: '#2563eb', stroke: '#ffffff', text: '#ffffff' },
  homeGK: { fill: '#facc15', stroke: '#1f2937', text: '#1f2937' },
  away: { fill: '#dc2626', stroke: '#ffffff', text: '#ffffff' },
  awayGK: { fill: '#111827', stroke: '#f8fafc', text: '#f8fafc' },
}
