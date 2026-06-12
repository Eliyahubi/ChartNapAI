import type { TemplateProps } from './common';
import { Polygon, RtlText, MainTitle, TITLE_SPACE, textBlockHeight } from './common';

/**
 * פירמידה RTL: הפריט הראשון בפסגה. הפירמידה בצד ימין (תחילת הקריאה),
 * טקסט ההסבר משמאל לכל שכבה עם קו מוביל, מיושר לימין.
 */
export default function PyramidTemplate({ doc, theme, rough, width = 960 }: TemplateProps) {
  const n = doc.items.length;
  const top = doc.title ? TITLE_SPACE : 30;
  const layerH = 78;
  const gap = 8;
  const pyrW = 430;
  const pyrRight = width - 60; // הקצה הימני של הפירמידה
  const pyrCx = pyrRight - pyrW / 2;
  const apexHalf = 36; // חצי רוחב הפסגה

  const totalH = top + n * (layerH + gap) + 40;
  const textRight = pyrRight - pyrW - 46; // עוגן הטקסט משמאל לפירמידה
  const textMaxW = textRight - 50;

  /** חצי רוחב של שכבה i (0 = פסגה) */
  const halfW = (i: number) => apexHalf + ((pyrW / 2 - apexHalf) * (i + 1)) / n;

  return (
    <svg width={width} height={totalH} viewBox={`0 0 ${width} ${totalH}`} xmlns="http://www.w3.org/2000/svg" style={{ background: theme.bg }}>
      <rect width={width} height={totalH} fill={theme.bg} />
      <MainTitle title={doc.title} width={width} theme={theme} />
      {doc.items.map((it, i) => {
        const yTop = top + i * (layerH + gap);
        const yBot = yTop + layerH;
        const topHalf = i === 0 ? apexHalf : halfW(i - 1);
        const botHalf = halfW(i);
        const color = theme.palette[i % theme.palette.length];
        const points: [number, number][] = [
          [pyrCx - topHalf, yTop],
          [pyrCx + topHalf, yTop],
          [pyrCx + botHalf, yBot],
          [pyrCx - botHalf, yBot],
        ];
        const midY = (yTop + yBot) / 2;
        const titleSize = 15.5;
        const bodySize = 13;
        const titleH = textBlockHeight(it.title, titleSize, textMaxW, 1.3, 2, 700);

        return (
          <g key={i}>
            <Polygon points={points} fill={color} stroke={color} isRough={rough} fillStyle="solid" seed={i + 1} />
            {/* מספר בתוך השכבה */}
            <text x={pyrCx} y={midY + 8} textAnchor="middle" fontSize={22} fontWeight={800} fill="#ffffff" fontFamily="'Heebo', sans-serif">
              {i + 1}
            </text>
            {/* קו מוביל לטקסט */}
            <line x1={pyrCx - botHalf - 6} y1={midY} x2={textRight + 14} y2={midY} stroke={theme.subtext} strokeWidth={1.2} strokeDasharray="4 4" />
            <RtlText x={textRight} y={midY - (it.body ? titleH / 2 + 4 : -5)} text={it.title} size={titleSize} weight={700} color={theme.text} maxWidth={textMaxW} maxLines={2} />
            {it.body && (
              <RtlText x={textRight} y={midY + titleH / 2 + 8} text={it.body} size={bodySize} color={theme.subtext} maxWidth={textMaxW} maxLines={2} />
            )}
          </g>
        );
      })}
    </svg>
  );
}
