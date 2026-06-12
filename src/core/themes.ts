export interface Theme {
  name: string;
  label: string;
  bg: string;
  text: string; // צבע טקסט ראשי
  subtext: string; // צבע טקסט משני
  palette: string[]; // צבעי צורות (לפי אינדקס פריט)
  accent: string; // חצים, קווים
  cardBg: string; // רקע כרטיסים
}

export const THEMES: Theme[] = [
  {
    name: 'tealOrange',
    label: 'טורקיז-כתום',
    bg: '#ffffff',
    text: '#1a2b3c',
    subtext: '#4a5b6c',
    palette: ['#0d7377', '#14a085', '#f29f05', '#f25c05', '#7b2d8b', '#2d6a8b'],
    accent: '#1a2b3c',
    cardBg: '#f6f9fa',
  },
  {
    name: 'corporate',
    label: 'כחול תאגידי',
    bg: '#ffffff',
    text: '#0f2a43',
    subtext: '#46627d',
    palette: ['#0f4c81', '#1f78b4', '#5aa7d6', '#f0a202', '#0b3050', '#3d8bbd'],
    accent: '#0f2a43',
    cardBg: '#f3f7fb',
  },
  {
    name: 'midnight',
    label: 'כחול עמוק',
    bg: '#0f1b2d',
    text: '#f2f6fa',
    subtext: '#a8b8c8',
    palette: ['#4cc9f0', '#4895ef', '#f72585', '#b5179e', '#ffd166', '#06d6a0'],
    accent: '#f2f6fa',
    cardBg: '#1a2940',
  },
  {
    name: 'warm',
    label: 'חם ונייטרלי',
    bg: '#fdf8f2',
    text: '#3d2c1e',
    subtext: '#7a6552',
    palette: ['#c1542f', '#d98841', '#8a9a5b', '#5b7a8a', '#9a5b7a', '#b8a04a'],
    accent: '#3d2c1e',
    cardBg: '#f5ece1',
  },
  {
    name: 'pastel',
    label: 'פסטל',
    bg: '#fbfaf7',
    text: '#3a3a4a',
    subtext: '#6e6e80',
    palette: ['#8ecae6', '#ffb4a2', '#b5e48c', '#cdb4db', '#ffd166', '#a8dadc'],
    accent: '#3a3a4a',
    cardBg: '#f3f1ec',
  },
  {
    name: 'forest',
    label: 'ירוק יער',
    bg: '#f7faf7',
    text: '#1d3a2a',
    subtext: '#4f6d5c',
    palette: ['#2d6a4f', '#40916c', '#74c69d', '#d4a373', '#588157', '#386641'],
    accent: '#1d3a2a',
    cardBg: '#edf4ee',
  },
  {
    name: 'royal',
    label: 'סגול מלכותי',
    bg: '#ffffff',
    text: '#2b1d42',
    subtext: '#5e4f78',
    palette: ['#5a189a', '#7b2cbf', '#9d4edd', '#ff9e00', '#3c096c', '#c77dff'],
    accent: '#2b1d42',
    cardBg: '#f7f4fb',
  },
  {
    name: 'sunset',
    label: 'שקיעה',
    bg: '#fffaf5',
    text: '#41250e',
    subtext: '#7d5a3c',
    palette: ['#e85d04', '#f48c06', '#ffba08', '#d00000', '#9d0208', '#dc2f02'],
    accent: '#41250e',
    cardBg: '#fbf0e4',
  },
  {
    name: 'contrast',
    label: 'ניגודיות גבוהה',
    bg: '#ffffff',
    text: '#000000',
    subtext: '#2e2e2e',
    palette: ['#0044aa', '#aa0000', '#006622', '#663399', '#884400', '#005577'],
    accent: '#000000',
    cardBg: '#f0f0f0',
  },
  {
    name: 'mono',
    label: 'מונוכרום',
    bg: '#ffffff',
    text: '#111111',
    subtext: '#555555',
    palette: ['#111111', '#3d3d3d', '#6b6b6b', '#8f8f8f', '#2a2a2a', '#525252'],
    accent: '#111111',
    cardBg: '#f2f2f2',
  },
];

export function themeByName(name: string): Theme {
  return THEMES.find((t) => t.name === name) ?? THEMES[0];
}

/* ---------- ערכה מותאמת אישית ---------- */

function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** מיזוג שני צבעי hex ביחס t (0=a, 1=b) */
function mix(a: string, b: string, t: number): string {
  const pa = a.replace('#', '');
  const pb = b.replace('#', '');
  const c = (i: number) => {
    const va = parseInt(pa.slice(i, i + 2), 16);
    const vb = parseInt(pb.slice(i, i + 2), 16);
    return Math.round(va + (vb - va) * t).toString(16).padStart(2, '0');
  };
  return `#${c(0)}${c(2)}${c(4)}`;
}

/**
 * בניית ערכה מלאה מרקע + 4 צבעי פלטה שבחר המשתמש.
 * צבע הטקסט נגזר אוטומטית מבהירות הרקע.
 */
export function makeCustomTheme(bg: string, palette: string[]): Theme {
  const light = luminance(bg) > 0.5;
  const text = light ? '#1a1a2a' : '#f4f4f8';
  return {
    name: 'custom',
    label: 'מותאם אישית',
    bg,
    text,
    subtext: mix(text, bg, 0.35),
    palette: [...palette, ...palette].slice(0, 6),
    accent: text,
    cardBg: mix(bg, text, 0.05),
  };
}
