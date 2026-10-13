export const colors = {
  ground: '#f7f5f6',
  card: '#ffffff',
  ink: '#1e1a1d',
  ink2: '#3d3640',
  muted: '#5f5863',
  line: '#ebe5e9',
  line2: '#d9d2d7',
  plum: '#6b3a5a',
  plumSoft: '#efe4ec',
  teal: '#2b7a78',
  tealDark: '#1f5f5d',
  tealSoft: '#d8efee',
  danger: '#b42318',
  dangerInk: '#8f1d1d',
  dangerSoft: '#fdecea',
  segment: '#ece8eb',
};

export const stateColors: Record<string, [string, string]> = {
  draft: ['#ece8eb', '#4a4450'],
  confirmed: ['#dbe8fb', '#1d4f91'],
  arrived: ['#d8efee', '#1f5f5d'],
  in_chair: ['#fbe6c9', '#8a4b08'],
  done: ['#dcf1df', '#22672f'],
  cancelled: ['#f8dcdc', '#9b2c2c'],
};

export const labColors: Record<string, [string, string]> = {
  draft: ['#ece8eb', '#4a4450'],
  sent: ['#dbe8fb', '#1d4f91'],
  overdue: ['#fdecea', '#8f1d1d'],
  received: ['#dcf1df', '#22672f'],
  rejected: ['#fdecea', '#8f1d1d'],
  delivered: ['#d8efee', '#1f5f5d'],
  expiring: ['#fbe6c9', '#8a4b08'],
  active: ['#dcf1df', '#22672f'],
  expired: ['#ece8eb', '#4a4450'],
};

// same palette as the tooth chart in Odoo (fill, border, dashed)
export const toothColors: Record<string, { fill: string; border: string; dashed?: boolean }> = {
  healthy: { fill: '#f3eff2', border: '#d9d2d7' },
  caries: { fill: '#E26A5A', border: '#9B2C22' },
  filled: { fill: '#5B8DEF', border: '#1E3A8A' },
  rct: { fill: '#A78BFA', border: '#6D28D9' },
  crown: { fill: '#F2C14E', border: '#92400E' },
  implant: { fill: '#D1D5DB', border: '#374151' },
  planned: { fill: '#ffffff', border: '#D97706', dashed: true },
  missing: { fill: 'transparent', border: '#a59ca3', dashed: true },
};

export const radius = { s: 10, m: 14, l: 18, xl: 20 };
