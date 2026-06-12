import type { TemplateProps } from './common';
import { Circle, RtlText, MainTitle, TITLE_SPACE, textBlockHeight } from './common';

/**
 * מחזור RTL: הפריט הראשון למעלה, ההתקדמות נגד כיוון השעון
 * (ימין ← למטה ← שמאל ← למעלה) — תואם כיוון קריאה עברי.
 */
export default function CycleTemplate({ doc, theme, rough, width = 960 }: TemplateProps) {
  const n = doc.items.length;
  const top = doc.title ? TITLE_SPACE : 30;
  const R = 175; // רדיוס המעגל המרכזי
  const nodeD = 96;
  const cx = width / 2;
  // מרווח עליון גדול: תווית הצומת העליון יושבת מעל המעגל וצריכה מקום
  const cy = top + R + nodeD / 2 + 110;
  const totalH = cy + R + nodeD / 2 + 110;

  /** זווית פריט i: מתחיל למעלה (−90°), נגד כיוון השעון */
  const angle = (i: number) => -Math.PI / 2 - (i * 2 * Math.PI) / n;

  return (
    <svg width={width} height={totalH} viewBox={`0 0 ${width} ${totalH}`} xmlns="http://www.w3.org/2000/svg" style={{ background: theme.bg }}>
      <rect width={width} height={totalH} fill={theme.bg} />
      <defs>
        <marker id="cycArrow" markerWidth="10" markerHeight="10" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill={theme.accent} />
        </marker>
      </defs>
      <MainTitle title={doc.title} width={width} theme={theme} />

      {/* קשתות בין הצמתים */}
      {doc.items.map((_, i) => {
        const a1 = angle(i) - 0.42;
        const a2 = angle(i + 1) + 0.42;
        const x1 = cx + R * Math.cos(a1);
        const y1 = cy + R * Math.sin(a1);
        const x2 = cx + R * Math.cos(a2);
        const y2 = cy + R * Math.sin(a2);
        // נגד כיוון השעון => sweep-flag 0
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} A ${R} ${R} 0 0 0 ${x2} ${y2}`}
            fill="none"
            stroke={theme.accent}
            strokeWidth={2.4}
            markerEnd="url(#cycArrow)"
            strokeDasharray={rough ? '7 5' : undefined}
          />
        );
      })}

      {/* צמתים וטקסט */}
      {doc.items.map((it, i) => {
        const a = angle(i);
        const x = cx + R * Math.cos(a);
        const y = cy + R * Math.sin(a);
        const color = theme.palette[i % theme.palette.length];

        // מיקום הטקסט: מחוץ למעגל, בהמשך הרדיוס
        const labelDist = R + nodeD / 2 + 18;
        const lx = cx + labelDist * Math.cos(a);
        const ly = cy + labelDist * Math.sin(a);
        const onRight = Math.cos(a) > 0.25;
        const onLeft = Math.cos(a) < -0.25;
        const anchor: 'start' | 'middle' | 'end' = onRight ? 'start' : onLeft ? 'end' : 'middle';
        // ב-RTL anchor "start" = הקצה הימני של הטקסט בכיוון rtl; direction=rtl הופך משמעות
        const textMaxW = 215;
        const titleSize = 16.5;
        const bodySize = 13;
        const titleH = textBlockHeight(it.title, titleSize, textMaxW, 1.3, 2, 700);

        return (
          <g key={i}>
            <Circle cx={x} cy={y} d={nodeD} fill={color} stroke={color} isRough={rough} fillStyle="solid" seed={i + 1} />
            <text x={x} y={y + 10} textAnchor="middle" fontSize={26} fontWeight={800} fill="#ffffff" fontFamily="'Heebo', sans-serif">
              {i + 1}
            </text>
            <RtlText
              x={lx}
              y={Math.sin(a) < -0.4 ? ly - 14 - titleH : ly}
              text={it.title}
              size={titleSize}
              weight={700}
              color={theme.text}
              anchor={anchor}
              maxWidth={textMaxW}
              maxLines={2}
            />
            {it.body && (
              <RtlText
                x={lx}
                y={(Math.sin(a) < -0.4 ? ly - 14 - titleH : ly) + titleH + 4}
                text={it.body}
                size={bodySize}
                color={theme.subtext}
                anchor={anchor}
                maxWidth={textMaxW}
                maxLines={3}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
