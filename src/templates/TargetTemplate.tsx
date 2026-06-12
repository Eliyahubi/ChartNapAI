import type { TemplateProps } from './common';
import { RtlText, MainTitle, TITLE_SPACE, textBlockHeight } from './common';

/**
 * מטרה RTL (בהשראת ה-radial של נפקין): רבעי טבעות קונצנטריות
 * מעוגנות לפינה הימנית-עליונה. פריט 1 = הליבה (הטבעת הפנימית).
 * הטקסט משמאל עם קווים מובילים לקשתות.
 */
export default function TargetTemplate({ doc, theme, rough, width = 960 }: TemplateProps) {
  const n = Math.min(doc.items.length, 4);
  const items = doc.items.slice(0, n);
  const top = doc.title ? TITLE_SPACE : 28;
  const ringW = 64;
  const r0 = 70; // רדיוס הליבה
  const cx = width - 60; // מרכז בפינה הימנית
  const cy = top + 8;
  const maxR = r0 + n * ringW;
  const totalH = cy + maxR + 40;

  const textRight = cx - maxR - 56;
  const textMaxW = textRight - 50;

  /** רבע טבעת בין r1 ל-r2: מהמערב (שמאל) לדרום (מטה) */
  function quarterPath(r1: number, r2: number): string {
    return [
      `M ${cx - r2} ${cy}`,
      `A ${r2} ${r2} 0 0 0 ${cx} ${cy + r2}`,
      `L ${cx} ${cy + r1}`,
      `A ${r1} ${r1} 0 0 1 ${cx - r1} ${cy}`,
      'Z',
    ].join(' ');
  }

  /** רבע מלא לליבה */
  function corePath(r: number): string {
    return [`M ${cx - r} ${cy}`, `A ${r} ${r} 0 0 0 ${cx} ${cy + r}`, `L ${cx} ${cy}`, 'Z'].join(' ');
  }

  // נקודת אלכסון 45° על אמצע הטבעת — אליה מגיע הקו המוביל
  const diag = (rMid: number) => ({
    x: cx - rMid * Math.SQRT1_2,
    y: cy + rMid * Math.SQRT1_2,
  });

  // פריסת שורות הטקסט: מפזרים אנכית לאורך הגובה
  const rowH = (totalH - top - 30) / n;

  return (
    <svg width={width} height={totalH} viewBox={`0 0 ${width} ${totalH}`} xmlns="http://www.w3.org/2000/svg" style={{ background: theme.bg }}>
      <rect width={width} height={totalH} fill={theme.bg} />
      <MainTitle title={doc.title} width={width} theme={theme} />
      {items.map((it, i) => {
        const color = theme.palette[i % theme.palette.length];
        const r1 = i === 0 ? 0 : r0 + (i - 1) * ringW;
        const r2 = r0 + i * ringW;
        const rMid = i === 0 ? r0 * 0.55 : (r1 + r2) / 2;
        const d = i === 0 ? corePath(r0) : quarterPath(r1, r2);
        const p = diag(rMid);

        const rowY = top + 16 + i * rowH + rowH / 2;
        const titleSize = 16;
        const bodySize = 13;
        const titleH = textBlockHeight(it.title, titleSize, textMaxW, 1.3, 2, 700);

        return (
          <g key={i}>
            <path d={d} fill={color} stroke={theme.bg} strokeWidth={3} strokeDasharray={rough ? '8 4' : undefined} />
            {/* מספר על הטבעת */}
            <circle cx={p.x} cy={p.y} r={14} fill={theme.bg} stroke={color} strokeWidth={2} />
            <text x={p.x} y={p.y + 5.5} textAnchor="middle" fontSize={14} fontWeight={800} fill={color} fontFamily="'Heebo', sans-serif">
              {i + 1}
            </text>
            {/* קו מוביל לטקסט */}
            <line x1={p.x - 16} y1={p.y} x2={textRight + 14} y2={rowY} stroke={theme.subtext} strokeWidth={1.2} strokeDasharray="4 4" />
            <RtlText x={textRight} y={rowY - (it.body ? titleH / 2 : -5)} text={it.title} size={titleSize} weight={700} color={theme.text} maxWidth={textMaxW} maxLines={2} />
            {it.body && (
              <RtlText x={textRight} y={rowY + titleH / 2 + 6} text={it.body} size={bodySize} color={theme.subtext} maxWidth={textMaxW} maxLines={2} />
            )}
          </g>
        );
      })}
    </svg>
  );
}
