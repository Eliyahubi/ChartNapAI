import type { TemplateProps } from './common';
import { Polygon, RtlText, MainTitle, TITLE_SPACE, textBlockHeight } from './common';

/**
 * משפך RTL: השכבה הרחבה (פריט 1) למעלה, מצטמצם כלפי מטה.
 * המשפך בצד ימין — תחילת הקריאה; טקסט ההסבר משמאל עם קו מוביל.
 */
export default function FunnelTemplate({ doc, theme, rough, width = 960 }: TemplateProps) {
  const n = Math.min(doc.items.length, 5);
  const items = doc.items.slice(0, n);
  const top = doc.title ? TITLE_SPACE : 30;
  const layerH = 76;
  const gap = 6;
  const funW = 440;
  const funRight = width - 60;
  const funCx = funRight - funW / 2;
  const stemHalf = 52; // חצי רוחב פתח היציאה

  const totalH = top + n * (layerH + gap) + 44;
  const textRight = funRight - funW - 46;
  const textMaxW = textRight - 50;

  /** חצי רוחב בתחתית שכבה i (0 = העליונה הרחבה) */
  const halfW = (i: number) => funW / 2 - ((funW / 2 - stemHalf) * (i + 1)) / n;

  return (
    <svg width={width} height={totalH} viewBox={`0 0 ${width} ${totalH}`} xmlns="http://www.w3.org/2000/svg" style={{ background: theme.bg }}>
      <rect width={width} height={totalH} fill={theme.bg} />
      <MainTitle title={doc.title} width={width} theme={theme} />
      {items.map((it, i) => {
        const yTop = top + i * (layerH + gap);
        const yBot = yTop + layerH;
        const topHalf = i === 0 ? funW / 2 : halfW(i - 1);
        const botHalf = halfW(i);
        const color = theme.palette[i % theme.palette.length];
        const points: [number, number][] = [
          [funCx - topHalf, yTop],
          [funCx + topHalf, yTop],
          [funCx + botHalf, yBot],
          [funCx - botHalf, yBot],
        ];
        const midY = (yTop + yBot) / 2;
        const titleSize = 15.5;
        const bodySize = 13;
        const titleH = textBlockHeight(it.title, titleSize, textMaxW, 1.3, 2, 700);

        return (
          <g key={i}>
            <Polygon points={points} fill={color} stroke={color} isRough={rough} fillStyle="solid" seed={i + 1} />
            <text x={funCx} y={midY + 8} textAnchor="middle" fontSize={22} fontWeight={800} fill="#ffffff" fontFamily="'Heebo', sans-serif">
              {i + 1}
            </text>
            <line x1={funCx - botHalf - 8} y1={midY} x2={textRight + 14} y2={midY} stroke={theme.subtext} strokeWidth={1.2} strokeDasharray="4 4" />
            <RtlText x={textRight} y={midY - (it.body ? titleH / 2 + 4 : -5)} text={it.title} size={titleSize} weight={700} color={theme.text} maxWidth={textMaxW} maxLines={2} />
            {it.body && (
              <RtlText x={textRight} y={midY + titleH / 2 + 8} text={it.body} size={bodySize} color={theme.subtext} maxWidth={textMaxW} maxLines={2} />
            )}
          </g>
        );
      })}
      {/* חץ יציאה מתחתית המשפך */}
      <line x1={funCx} y1={top + n * (layerH + gap)} x2={funCx} y2={top + n * (layerH + gap) + 26} stroke={theme.accent} strokeWidth={2.5} strokeLinecap="round" />
      <polyline
        points={`${funCx - 7},${top + n * (layerH + gap) + 18} ${funCx},${top + n * (layerH + gap) + 28} ${funCx + 7},${top + n * (layerH + gap) + 18}`}
        fill="none" stroke={theme.accent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}
