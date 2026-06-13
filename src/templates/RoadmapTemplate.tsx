import type { TemplateProps } from './common';
import { Circle, RtlText, MainTitle, TITLE_SPACE, textBlockHeight } from './common';

/**
 * מפת דרכים — כביש מתפתל, פריטים לסירוגין שמאל/ימין.
 * הכביש עובר בשני עמודות עם S-קרב (קשת ביזייה) בין כל שני עצירות.
 */
export default function RoadmapTemplate({ doc, theme, rough, width = 960 }: TemplateProps) {
  const n = doc.items.length;
  const top = doc.title ? TITLE_SPACE : 30;

  const xL = width * 0.3; // מרכז עמודה שמאל
  const xR = width * 0.7; // מרכז עמודה ימין
  const stopH = 150; // גובה בין עצירות

  // מיקום כל עצירה
  const positions = doc.items.map((_, i) => ({
    x: i % 2 === 0 ? xL : xR,
    y: top + 40 + i * stopH,
  }));

  const totalH = (positions[n - 1]?.y ?? top + 40) + stopH * 0.5 + 60;

  // נתיב הכביש — bezier רציף
  let roadD = `M ${positions[0].x} ${top + 10}`;
  positions.forEach((p, i) => {
    if (i === 0) {
      roadD += ` L ${p.x} ${p.y}`;
    } else {
      const prev = positions[i - 1];
      const cp1y = prev.y + stopH * 0.55;
      const cp2y = p.y - stopH * 0.55;
      roadD += ` C ${prev.x},${cp1y} ${p.x},${cp2y} ${p.x},${p.y}`;
    }
  });
  // קצה תחתון
  roadD += ` L ${positions[n - 1].x} ${positions[n - 1].y + 30}`;

  const roadW = 36;
  const markerD = 42;
  const textMaxW = (xL - 60); // רוחב טקסט לצד

  return (
    <svg
      width={width}
      height={totalH}
      viewBox={`0 0 ${width} ${totalH}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: theme.bg }}
    >
      <rect width={width} height={totalH} fill={theme.bg} />
      <MainTitle title={doc.title} width={width} theme={theme} />

      {/* כביש רקע (עובי מלא) */}
      <path
        d={roadD}
        fill="none"
        stroke={theme.accent}
        strokeWidth={roadW}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={0.18}
      />
      {/* שוליים */}
      <path
        d={roadD}
        fill="none"
        stroke={theme.accent}
        strokeWidth={roadW - 2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={0.12}
      />
      {/* קו מרכז מקווקו */}
      <path
        d={roadD}
        fill="none"
        stroke="#ffffff"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="12 9"
        strokeOpacity={0.7}
      />

      {/* עצירות */}
      {positions.map((p, i) => {
        const item = doc.items[i];
        const color = theme.palette[i % theme.palette.length];
        const isRight = i % 2 === 1; // עמודה ימנית → טקסט משמאל ל-marker

        // מיקום טקסט: בצד הנגדי לעמודה
        const textX = isRight ? xL - 20 : xR + 20;
        const textAnchor: 'start' | 'end' = isRight ? 'end' : 'start';

        // קו מחבר מהעצירה לטקסט
        const lineEndX = isRight ? p.x - markerD / 2 - 6 : p.x + markerD / 2 + 6;
        const lineEndXText = isRight ? textX + 10 : textX - 10;

        const titleH = textBlockHeight(item.title, 15, textMaxW, 1.3, 2, 700);

        return (
          <g key={i}>
            {/* קו מחבר */}
            <line
              x1={lineEndX}
              y1={p.y}
              x2={lineEndXText}
              y2={p.y}
              stroke={color}
              strokeWidth={2}
              strokeDasharray={rough ? '5 3' : undefined}
            />

            {/* עיגול עצירה */}
            <Circle
              cx={p.x}
              cy={p.y}
              d={markerD}
              fill={color}
              stroke={color}
              isRough={rough}
              fillStyle="solid"
              seed={i + 1}
            />
            <text
              x={p.x}
              y={p.y + 7}
              textAnchor="middle"
              fontSize={17}
              fontWeight={800}
              fill="#ffffff"
              fontFamily="'Heebo', sans-serif"
            >
              {i + 1}
            </text>

            {/* כותרת */}
            <RtlText
              x={textX}
              y={p.y - titleH / 2 - 2}
              text={item.title}
              size={15}
              weight={700}
              color={theme.text}
              anchor={textAnchor}
              maxWidth={textMaxW}
              maxLines={2}
            />
            {item.body && (
              <RtlText
                x={textX}
                y={p.y - titleH / 2 - 2 + titleH + 3}
                text={item.body}
                size={12}
                color={theme.subtext}
                anchor={textAnchor}
                maxWidth={textMaxW}
                maxLines={2}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
