import type { TemplateProps } from './common';
import { Box, RtlText, PaintPath, MainTitle, TITLE_SPACE, textBlockHeight } from './common';
import { ItemIcon, hasIcon } from '../core/icons';

/**
 * היררכיית עץ — הפריט הראשון הוא השורש (למטה במרכז), והשאר מסתעפים
 * ממנו כלפי מעלה בקשתות. כל צומת = "גלולה" עם מספר/אייקון וכותרת.
 * RTL: הצאצא הראשון בצד ימין.
 */
export default function TreeTemplate({ doc, theme, rough, width = 960 }: TemplateProps) {
  const top = doc.title ? TITLE_SPACE : 30;
  const items = doc.items;
  const root = items[0];
  const children = items.slice(1);
  const cn = children.length;

  const margin = 40;
  const colW = cn > 0 ? (width - margin * 2) / cn : width - margin * 2;
  const nodeW = Math.min(cn > 0 ? colW - 14 : 280, 230);
  const badge = 30;
  const titleSize = 13.5;
  const bodySize = 11;
  const textW = nodeW - badge - 24;

  const blockH = (it: { title: string; body?: string }) => {
    const th = textBlockHeight(it.title, titleSize, textW, 1.2, 2, 700);
    const bh = it.body ? textBlockHeight(it.body, bodySize, textW, 1.25, 1) + 3 : 0;
    return th + bh;
  };
  const nodeH = Math.max(blockH(root), ...children.map(blockH), 22) + 24;

  const childCY = top + nodeH / 2 + 10;
  const vGap = 110;
  const rootCY = cn > 0 ? childCY + nodeH + vGap : childCY;
  const totalH = rootCY + nodeH / 2 + 30;

  const rootX = width / 2;
  const childX = (i: number) => margin + (cn - 1 - i) * colW + colW / 2; // RTL

  function Node({ cx, cy, item, color, filled, num }: { cx: number; cy: number; item: { title: string; body?: string; icon?: string }; color: string; filled: boolean; num: number }) {
    const bx = cx - nodeW / 2;
    const by = cy - nodeH / 2;
    const circleCx = bx + nodeW - 12 - badge / 2;
    const txtRight = circleCx - badge / 2 - 10;
    const bh = blockH(item);
    const titleY = cy - bh / 2 + titleSize;
    const titleH = textBlockHeight(item.title, titleSize, textW, 1.2, 2, 700);
    return (
      <g>
        <Box x={bx} y={by} w={nodeW} h={nodeH} r={16} fill={filled ? color : theme.cardBg} stroke={color} isRough={rough} fillStyle="solid" seed={num + 3} />
        <circle cx={circleCx} cy={cy} r={badge / 2} fill={filled ? 'rgba(255,255,255,0.22)' : color} />
        {hasIcon(item.icon) ? (
          <ItemIcon name={item.icon} cx={circleCx} cy={cy} size={16} color="#ffffff" />
        ) : (
          <text x={circleCx} y={cy + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill="#ffffff" fontFamily="'Heebo', sans-serif">{num}</text>
        )}
        <RtlText x={txtRight} y={titleY} text={item.title} size={titleSize} weight={700} color={filled ? '#ffffff' : theme.text} anchor="end" maxWidth={textW} maxLines={2} lineHeight={1.2} />
        {item.body && (
          <RtlText x={txtRight} y={titleY + titleH + 1} text={item.body} size={bodySize} color={filled ? 'rgba(255,255,255,0.85)' : theme.subtext} anchor="end" maxWidth={textW} maxLines={1} lineHeight={1.25} />
        )}
      </g>
    );
  }

  return (
    <svg width={width} height={totalH} viewBox={`0 0 ${width} ${totalH}`} xmlns="http://www.w3.org/2000/svg" style={{ background: theme.bg }}>
      <rect width={width} height={totalH} fill={theme.bg} />
      <MainTitle title={doc.title} width={width} theme={theme} />

      {/* קשתות מהשורש לכל צאצא */}
      {children.map((_, i) => {
        const cx = childX(i);
        const color = theme.palette[i % theme.palette.length];
        const x1 = rootX, y1 = rootCY - nodeH / 2;
        const x2 = cx, y2 = childCY + nodeH / 2;
        const midY = (y1 + y2) / 2;
        const d = `M ${x1},${y1} C ${x1},${midY} ${x2},${midY} ${x2},${y2}`;
        return <PaintPath key={`c${i}`} d={d} fill="none" stroke={color} isRough={rough} strokeWidth={3} strokeLinecap="round" />;
      })}

      {/* צאצאים */}
      {children.map((it, i) => (
        <Node key={i} cx={childX(i)} cy={childCY} item={it} color={theme.palette[i % theme.palette.length]} filled={false} num={i + 2} />
      ))}

      {/* שורש */}
      <Node cx={rootX} cy={rootCY} item={root} color={theme.accent} filled num={1} />
    </svg>
  );
}
