import type { TemplateProps } from './common';
import { RtlText, MainTitle, TITLE_SPACE, textBlockHeight, mixHex } from './common';
import { ItemIcon, hasIcon } from '../core/icons';

/**
 * ציר זמן אנכי — פס מרכזי עם תחנות ממוספרות (01..0n) ותוכן לסירוגין
 * מימין/משמאל. RTL: התחנה הראשונה למעלה, התוכן הראשון בצד ימין.
 */
export default function VTimelineTemplate({ doc, theme, rough: _rough, width = 960 }: TemplateProps) {
  const n = doc.items.length;
  const top = doc.title ? TITLE_SPACE : 30;
  const margin = 40;

  const barX = width / 2;
  const nodeR = 21;
  const barW = 10;
  const stemLen = 26;

  const titleSize = 15;
  const bodySize = 12;
  const labelSize = 12.5;
  const textW = width / 2 - nodeR - stemLen - margin - 8;

  // ריווח אנכי לפי בלוק הטקסט הגבוה ביותר
  const blockH = (it: { title: string; body?: string; label?: string }) => {
    const lh = it.label ? labelSize * 1.4 : 0;
    const th = textBlockHeight(it.title, titleSize, textW, 1.25, 2, 700);
    const bh = it.body ? textBlockHeight(it.body, bodySize, textW, 1.35, 3) + 4 : 0;
    return lh + th + bh;
  };
  const rowH = Math.max(...doc.items.map(blockH), nodeR * 2) + 38;

  const startY = top + rowH / 2;
  const totalH = startY + (n - 1) * rowH + rowH / 2 + 20;

  const barTop = startY;
  const barBottom = startY + (n - 1) * rowH;

  return (
    <svg width={width} height={totalH} viewBox={`0 0 ${width} ${totalH}`} xmlns="http://www.w3.org/2000/svg" style={{ background: theme.bg }}>
      <rect width={width} height={totalH} fill={theme.bg} />
      <MainTitle title={doc.title} width={width} theme={theme} />

      {/* פס מרכזי — מקטעים צבעוניים בין התחנות */}
      {n > 1 ? (
        doc.items.slice(0, -1).map((_, i) => {
          const y1 = startY + i * rowH;
          const c1 = theme.palette[i % theme.palette.length];
          const c2 = theme.palette[(i + 1) % theme.palette.length];
          return <rect key={`b${i}`} x={barX - barW / 2} y={y1} width={barW} height={rowH} fill={mixHex(c1, c2, 0.5)} />;
        })
      ) : (
        <rect x={barX - barW / 2} y={barTop - nodeR} width={barW} height={nodeR * 2} fill={theme.palette[0]} />
      )}
      <rect x={barX - barW / 2} y={barTop} width={barW} height={barBottom - barTop} fill="none" />

      {doc.items.map((it, i) => {
        const cy = startY + i * rowH;
        const color = theme.palette[i % theme.palette.length];
        const right = i % 2 === 0; // RTL: ראשון בימין
        const titleH = textBlockHeight(it.title, titleSize, textW, 1.25, 2, 700);
        const bh = blockH(it);
        const blockTop = cy - bh / 2;

        // צד התוכן — הטקסט נצמד לפס: בימין מתחיל ליד הפס וזורם החוצה,
        // בשמאל מסתיים ליד הפס. כך אין פער בין הפס לטקסט.
        const stemX2 = right ? barX + nodeR + stemLen : barX - nodeR - stemLen;
        const anchor = right ? ('start' as const) : ('end' as const);
        const txtX = right ? barX + nodeR + stemLen + 8 : barX - nodeR - stemLen - 8;

        const titleBaseline = blockTop + (it.label ? labelSize * 1.4 : 0) + titleSize;

        return (
          <g key={i}>
            {/* גבעול לצד התוכן */}
            <line x1={barX + (right ? nodeR : -nodeR)} y1={cy} x2={stemX2} y2={cy} stroke={color} strokeWidth={2} />

            {/* עיגול התחנה */}
            <circle cx={barX} cy={cy} r={nodeR} fill={color} stroke={theme.bg} strokeWidth={3} />
            <text x={barX} y={cy + 5} textAnchor="middle" fontSize={15} fontWeight={800} fill="#ffffff" fontFamily="'Heebo', sans-serif">
              {String(i + 1).padStart(2, '0')}
            </text>

            {/* אייקון אופציונלי בצד הנגדי */}
            {hasIcon(it.icon) && (
              <g>
                <circle cx={right ? barX - nodeR - stemLen : barX + nodeR + stemLen} cy={cy} r={15} fill={theme.cardBg} stroke={color} strokeWidth={2} />
                <ItemIcon name={it.icon} cx={right ? barX - nodeR - stemLen : barX + nodeR + stemLen} cy={cy} size={16} color={color} />
              </g>
            )}

            {/* תווית (שנה) */}
            {it.label && (
              <RtlText x={txtX} y={blockTop + labelSize} text={it.label} size={labelSize} weight={700} color={color} anchor={anchor} maxWidth={textW} maxLines={1} />
            )}
            <RtlText x={txtX} y={titleBaseline} text={it.title} size={titleSize} weight={700} color={theme.text} anchor={anchor} maxWidth={textW} maxLines={2} lineHeight={1.25} />
            {it.body && (
              <RtlText x={txtX} y={titleBaseline + titleH + 4} text={it.body} size={bodySize} color={theme.subtext} anchor={anchor} maxWidth={textW} maxLines={3} lineHeight={1.35} />
            )}
          </g>
        );
      })}
    </svg>
  );
}
