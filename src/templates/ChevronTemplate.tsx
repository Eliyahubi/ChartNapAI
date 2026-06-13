import type { TemplateProps } from './common';
import { Polygon, RtlText, MainTitle, TITLE_SPACE, textBlockHeight } from './common';
import { ItemIcon, hasIcon } from '../core/icons';

/**
 * חיצי שברון — רצף אופקי של חיצים מצביעי-שמאל (RTL: שלב 1 בימין).
 * הערות לסירוגין מעל/מתחת, כל הערה עם עיגול מספר/אייקון, כותרת וגוף.
 * בתוך כל שברון: התווית (item.label, למשל שנה) או המספר.
 */
export default function ChevronTemplate({ doc, theme, rough, width = 960 }: TemplateProps) {
  const n = doc.items.length;
  const top = doc.title ? TITLE_SPACE : 30;
  const margin = 30;

  const chH = 46;
  const td = 22; // עומק החוד
  const colW = (width - margin * 2) / n;
  const gap = 7;

  const circleD = 34;
  const titleSize = 14;
  const bodySize = 11.5;
  const annoTextW = colW - 12;

  // גובה בלוק הערה (עיגול + כותרת + גוף)
  const annoH = doc.items.reduce((m, it) => {
    const th = textBlockHeight(it.title, titleSize, annoTextW, 1.2, 2, 700);
    const bh = it.body ? textBlockHeight(it.body, bodySize, annoTextW, 1.3, 3) + 3 : 0;
    return Math.max(m, circleD + 10 + th + bh);
  }, 0);

  const chCY = top + annoH + 22;
  const totalH = chCY + chH / 2 + annoH + 24;

  return (
    <svg width={width} height={totalH} viewBox={`0 0 ${width} ${totalH}`} xmlns="http://www.w3.org/2000/svg" style={{ background: theme.bg }}>
      <rect width={width} height={totalH} fill={theme.bg} />
      <MainTitle title={doc.title} width={width} theme={theme} />

      {doc.items.map((it, i) => {
        const color = theme.palette[i % theme.palette.length];
        const visIdx = n - 1 - i; // RTL: שלב 0 בימין
        const x = margin + visIdx * colW + gap / 2;
        const cw = colW - gap;
        const cy = chCY;
        const half = chH / 2;

        // שברון מצביע שמאלה: חוד שמאלי + מגרעת ימנית
        const pts: [number, number][] = [
          [x, cy],                 // חוד שמאלי
          [x + td, cy - half],     // כתף עליונה-שמאל
          [x + cw, cy - half],     // עליון-ימין
          [x + cw - td, cy],       // מגרעת ימנית
          [x + cw, cy + half],     // תחתון-ימין
          [x + td, cy + half],     // כתף תחתונה-שמאל
        ];

        // תווית בתוך השברון
        const inner = it.label || String(i + 1);
        const labelX = x + cw / 2 + td * 0.25;

        // הערה לסירוגין: זוגי מעל, אי-זוגי מתחת
        const above = i % 2 === 0;
        const annoCx = x + cw / 2;
        const titleH = textBlockHeight(it.title, titleSize, annoTextW, 1.2, 2, 700);

        let circleCy: number, titleY: number, bodyY: number, stemY1: number, stemY2: number;
        if (above) {
          circleCy = cy - half - 16 - circleD / 2;
          // בלוק הכותרת+גוף יושב מעל העיגול; מחשבים מהקצה העליון
          const bodyBlock = it.body ? textBlockHeight(it.body, bodySize, annoTextW, 1.3, 3) + 3 : 0;
          const blockTop = circleCy - circleD / 2 - 8 - (titleH + bodyBlock);
          titleY = blockTop + titleSize;
          bodyY = blockTop + titleH + 3 + bodySize;
          stemY1 = cy - half;
          stemY2 = circleCy + circleD / 2;
        } else {
          circleCy = cy + half + 16 + circleD / 2;
          const blockTop = circleCy + circleD / 2 + 8;
          titleY = blockTop + titleSize;
          bodyY = blockTop + titleH + 3 + bodySize;
          stemY1 = cy + half;
          stemY2 = circleCy - circleD / 2;
        }

        return (
          <g key={i}>
            <Polygon points={pts} fill={color} stroke={color} isRough={rough} fillStyle="solid" seed={i + 7} />
            <text x={labelX} y={cy + 5} textAnchor="middle" fontSize={15} fontWeight={800} fill="#ffffff" fontFamily="'Heebo', sans-serif" direction="rtl">{inner}</text>

            {/* גבעול */}
            <line x1={annoCx} y1={stemY1} x2={annoCx} y2={stemY2} stroke={color} strokeWidth={2} />

            {/* עיגול הערה */}
            <circle cx={annoCx} cy={circleCy} r={circleD / 2} fill={theme.cardBg} stroke={color} strokeWidth={2} />
            {hasIcon(it.icon) ? (
              <ItemIcon name={it.icon} cx={annoCx} cy={circleCy} size={17} color={color} />
            ) : (
              <text x={annoCx} y={circleCy + 5} textAnchor="middle" fontSize={15} fontWeight={800} fill={color} fontFamily="'Heebo', sans-serif">{i + 1}</text>
            )}

            <RtlText x={annoCx} y={titleY} text={it.title} size={titleSize} weight={700} color={theme.text} anchor="middle" maxWidth={annoTextW} maxLines={2} lineHeight={1.2} />
            {it.body && (
              <RtlText x={annoCx} y={bodyY} text={it.body} size={bodySize} color={theme.subtext} anchor="middle" maxWidth={annoTextW} maxLines={3} lineHeight={1.3} />
            )}
          </g>
        );
      })}
    </svg>
  );
}
