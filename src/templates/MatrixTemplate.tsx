import type { TemplateProps } from './common';
import { Box, RtlText, MainTitle, TITLE_SPACE, textBlockHeight } from './common';
import { ItemIcon, hasIcon } from '../core/icons';

/**
 * מטריצה RTL (בהשראת SWOT של נפקין): רשת 2xN.
 * סדר קריאה: ימין-עליון ← שמאל-עליון ← ימין-תחתון ← שמאל-תחתון.
 */
export default function MatrixTemplate({ doc, theme, rough, width = 960 }: TemplateProps) {
  const n = Math.min(doc.items.length, 6);
  const items = doc.items.slice(0, n);
  const rows = Math.ceil(n / 2);
  const top = doc.title ? TITLE_SPACE : 28;
  const margin = 50;
  const gap = 16;
  const cellW = (width - margin * 2 - gap) / 2;
  const headerH = 40;
  const titleSize = 17;
  const bodySize = 13.5;
  const textMaxW = cellW - 40;

  // גובה שורה לפי התא הגבוה בה
  const cellBodyH = (i: number) => {
    const it = items[i];
    if (!it) return 0;
    return it.body ? textBlockHeight(it.body, bodySize, textMaxW, 1.4, 4) + 26 : 18;
  };
  const rowHeights = Array.from({ length: rows }, (_, r) =>
    Math.max(96, headerH + Math.max(cellBodyH(r * 2), cellBodyH(r * 2 + 1)) + 22)
  );

  const totalH = top + rowHeights.reduce((a, b) => a + b + gap, 0) + 18;

  let yCursor = top;
  return (
    <svg width={width} height={totalH} viewBox={`0 0 ${width} ${totalH}`} xmlns="http://www.w3.org/2000/svg" style={{ background: theme.bg }}>
      <rect width={width} height={totalH} fill={theme.bg} />
      <MainTitle title={doc.title} width={width} theme={theme} />
      {Array.from({ length: rows }, (_, r) => {
        const rowY = yCursor;
        const rowH = rowHeights[r];
        yCursor += rowH + gap;
        return [0, 1].map((c) => {
          const i = r * 2 + c;
          const it = items[i];
          if (!it) return null;
          // RTL: עמודה 0 = ימין
          const x = c === 0 ? width - margin - cellW : margin;
          const color = theme.palette[i % theme.palette.length];
          return (
            <g key={`${r}-${c}`}>
              <Box x={x} y={rowY} w={cellW} h={rowH} fill={theme.cardBg} stroke={color} isRough={rough} fillStyle="solid" seed={i + 3} />
              <rect x={x} y={rowY} width={cellW} height={headerH} rx={8} fill={color} />
              <rect x={x} y={rowY + headerH - 8} width={cellW} height={8} fill={color} />
              <RtlText x={x + cellW / 2} y={rowY + headerH / 2 + 6} text={it.title} size={titleSize} weight={800} color="#ffffff" anchor="middle" maxWidth={textMaxW} maxLines={1} />
              {hasIcon(it.icon) && (
                <ItemIcon name={it.icon} cx={x + cellW - 24} cy={rowY + headerH / 2} size={20} color="#ffffff" />
              )}
              {it.body && (
                <RtlText x={x + cellW - 20} y={rowY + headerH + 24} text={it.body} size={bodySize} color={theme.text} maxWidth={textMaxW} maxLines={4} />
              )}
            </g>
          );
        });
      })}
    </svg>
  );
}
