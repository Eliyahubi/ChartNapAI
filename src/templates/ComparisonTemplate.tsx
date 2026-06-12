import type { TemplateProps } from './common';
import { Box, Circle, RtlText, MainTitle, TITLE_SPACE, textBlockHeight } from './common';
import { ItemIcon, hasIcon } from '../core/icons';

/**
 * השוואה RTL: הצד הראשון (a) בעמודה הימנית — שם מתחילים לקרוא,
 * הצד השני (b) בעמודה השמאלית, עיגול "מול" במרכז.
 */
export default function ComparisonTemplate({ doc, theme, rough, width = 960 }: TemplateProps) {
  const top = doc.title ? TITLE_SPACE : 28;
  const margin = 44;
  const midGap = 90;
  const colW = (width - margin * 2 - midGap) / 2;
  const headerH = 56;
  const itemsA = doc.items.filter((it) => it.side !== 'b');
  const itemsB = doc.items.filter((it) => it.side === 'b');
  const [labelA, labelB] = doc.sideLabels ?? ['אפשרות א', 'אפשרות ב'];
  const colorA = theme.palette[0];
  const colorB = theme.palette[2] ?? theme.palette[1];

  const titleSize = 16;
  const bodySize = 13.5;
  const textMaxW = colW - 56;

  const itemH = (it: (typeof doc.items)[number]) =>
    28 + textBlockHeight(it.title, titleSize, textMaxW, 1.3, 2, 700) + (it.body ? textBlockHeight(it.body, bodySize, textMaxW, 1.4, 3) + 8 : 0);

  const gap = 14;
  const colHeight = (items: typeof doc.items) => items.reduce((a, it) => a + itemH(it) + gap, 0);
  const bodyH = Math.max(colHeight(itemsA), colHeight(itemsB), 120);
  const totalH = top + headerH + 18 + bodyH + 30;

  function Column({ items, x, color, label }: { items: typeof doc.items; x: number; color: string; label: string }) {
    let y = top + headerH + 18;
    return (
      <g>
        <Box x={x} y={top} w={colW} h={headerH} fill={color} stroke={color} isRough={rough} seed={3} fillStyle="solid" />
        <RtlText x={x + colW / 2} y={top + headerH / 2 + 7} text={label} size={20} weight={800} color="#ffffff" anchor="middle" maxWidth={colW - 30} maxLines={1} />
        {items.map((it, i) => {
          const h = itemH(it);
          const boxY = y;
          y += h + gap;
          return (
            <g key={i}>
              <Box x={x} y={boxY} w={colW} h={h} fill={theme.cardBg} stroke={color} isRough={rough} seed={i + 5} fillStyle="solid" />
              {hasIcon(it.icon) ? (
                <ItemIcon name={it.icon} cx={x + colW - 22} cy={boxY + 23} size={18} color={color} />
              ) : (
                <circle cx={x + colW - 20} cy={boxY + 22} r={5} fill={color} />
              )}
              <RtlText x={x + colW - 36} y={boxY + 28} text={it.title} size={titleSize} weight={700} color={theme.text} maxWidth={textMaxW} maxLines={2} />
              {it.body && (
                <RtlText x={x + colW - 36} y={boxY + 34 + textBlockHeight(it.title, titleSize, textMaxW, 1.3, 2, 700)} text={it.body} size={bodySize} color={theme.subtext} maxWidth={textMaxW} maxLines={3} />
              )}
            </g>
          );
        })}
      </g>
    );
  }

  const rightX = width - margin - colW; // עמודת צד a — ימין
  const leftX = margin; // עמודת צד b — שמאל

  return (
    <svg width={width} height={totalH} viewBox={`0 0 ${width} ${totalH}`} xmlns="http://www.w3.org/2000/svg" style={{ background: theme.bg }}>
      <rect width={width} height={totalH} fill={theme.bg} />
      <MainTitle title={doc.title} width={width} theme={theme} />
      <Column items={itemsA} x={rightX} color={colorA} label={labelA} />
      <Column items={itemsB} x={leftX} color={colorB} label={labelB} />
      {/* עיגול "מול" במרכז */}
      <Circle cx={width / 2} cy={top + headerH / 2} d={58} fill={theme.bg} stroke={theme.accent} isRough={rough} seed={9} />
      <text x={width / 2} y={top + headerH / 2 + 7} textAnchor="middle" fontSize={19} fontWeight={800} fill={theme.text} fontFamily="'Heebo', sans-serif">
        מול
      </text>
    </svg>
  );
}
