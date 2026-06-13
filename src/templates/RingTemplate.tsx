import type { TemplateProps } from './common';
import { Circle, RtlText, MainTitle, TITLE_SPACE, textBlockHeight } from './common';

/**
 * טבעת חצים — פריטים על היקף מעגל, חצים בין שכנים.
 * מתחיל למעלה (−90°), מסתובב עם כיוון השעון.
 */
export default function RingTemplate({ doc, theme, rough, width = 960 }: TemplateProps) {
  const n = doc.items.length;
  const top = doc.title ? TITLE_SPACE : 30;

  const R = Math.min(210, (width - 320) / 2); // רדיוס פריסת הפריטים
  const nodeD = 72; // קוטר צומת
  const cx = width / 2;
  const cy = top + R + nodeD / 2 + 90;
  const totalH = cy + R + nodeD / 2 + 100;

  const LINE_GAP = 0.18; // רווח בין קצה הצומת לחץ (ברדיאנים)

  /** זווית פריט i: מתחיל למעלה, עם כיוון השעון */
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;

  return (
    <svg
      width={width}
      height={totalH}
      viewBox={`0 0 ${width} ${totalH}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: theme.bg }}
    >
      <rect width={width} height={totalH} fill={theme.bg} />
      <defs>
        {doc.items.map((_, i) => {
          const color = theme.palette[i % theme.palette.length];
          return (
            <marker
              key={i}
              id={`rngArr${i}`}
              markerWidth="9"
              markerHeight="9"
              refX="8"
              refY="4.5"
              orient="auto"
            >
              <path d="M0,0 L9,4.5 L0,9 Z" fill={color} />
            </marker>
          );
        })}
      </defs>

      <MainTitle title={doc.title} width={width} theme={theme} />

      {/* קשתות בין שכנים */}
      {doc.items.map((_, i) => {
        const a1 = angle(i) + LINE_GAP;
        const a2 = angle(i + 1) - LINE_GAP;
        const x1 = cx + R * Math.cos(a1);
        const y1 = cy + R * Math.sin(a1);
        const x2 = cx + R * Math.cos(a2);
        const y2 = cy + R * Math.sin(a2);
        const color = theme.palette[i % theme.palette.length];
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`}
            fill="none"
            stroke={color}
            strokeWidth={2.8}
            markerEnd={`url(#rngArr${i})`}
            strokeDasharray={rough ? '6 4' : undefined}
          />
        );
      })}

      {/* נקודות + טקסט */}
      {doc.items.map((item, i) => {
        const a = angle(i);
        const nx = cx + R * Math.cos(a);
        const ny = cy + R * Math.sin(a);
        const color = theme.palette[i % theme.palette.length];

        // מיקום הטקסט: מחוץ לצומת
        const labelDist = R + nodeD / 2 + 16;
        const lx = cx + labelDist * Math.cos(a);
        const ly = cy + labelDist * Math.sin(a);

        const cosA = Math.cos(a);
        const onRight = cosA > 0.28;
        const onLeft = cosA < -0.28;
        const anchor: 'start' | 'middle' | 'end' = onRight ? 'start' : onLeft ? 'end' : 'middle';

        const textMaxW = 200;
        const titleSize = 15.5;
        const bodySize = 12.5;
        const titleH = textBlockHeight(item.title, titleSize, textMaxW, 1.3, 2, 700);
        // הזזת y מעלה עבור פריטים בחצי העליון
        const textY = Math.sin(a) < -0.35 ? ly - 10 - titleH : ly - 2;

        return (
          <g key={i}>
            <Circle
              cx={nx}
              cy={ny}
              d={nodeD}
              fill={color}
              stroke={color}
              isRough={rough}
              fillStyle="solid"
              seed={i + 1}
            />
            <text
              x={nx}
              y={ny + 7}
              textAnchor="middle"
              fontSize={22}
              fontWeight={800}
              fill="#ffffff"
              fontFamily="'Heebo', sans-serif"
            >
              {i + 1}
            </text>

            <RtlText
              x={lx}
              y={textY}
              text={item.title}
              size={titleSize}
              weight={700}
              color={theme.text}
              anchor={anchor}
              maxWidth={textMaxW}
              maxLines={2}
            />
            {item.body && (
              <RtlText
                x={lx}
                y={textY + titleH + 3}
                text={item.body}
                size={bodySize}
                color={theme.subtext}
                anchor={anchor}
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
