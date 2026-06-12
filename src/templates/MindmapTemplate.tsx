import type { TemplateProps } from './common';
import { Circle, RtlText, MainTitle, textBlockHeight, wrapText } from './common';
import { ItemIcon, hasIcon } from '../core/icons';

/**
 * מפת חשיבה RTL (Hub & Spokes): הנושא במרכז, ענפים מסביב.
 * הענף הראשון מימין (תחילת קריאה), ההמשך נגד כיוון השעון.
 */
export default function MindmapTemplate({ doc, theme, rough, width = 960 }: TemplateProps) {
  const n = Math.min(doc.items.length, 8);
  const items = doc.items.slice(0, n);
  const R = 200; // מרחק הענפים מהמרכז
  const hubR = 86;
  const cx = width / 2;
  const cy = R + 120;
  const totalH = cy + R + 130;
  const center = doc.title || 'הנושא';

  /** ענף i: מתחיל מימין (0°), נגד כיוון השעון */
  const angle = (i: number) => -((i * 2 * Math.PI) / n);

  const hubLines = wrapText(center, 19, hubR * 1.6, 800).slice(0, 3);

  return (
    <svg width={width} height={totalH} viewBox={`0 0 ${width} ${totalH}`} xmlns="http://www.w3.org/2000/svg" style={{ background: theme.bg }}>
      <rect width={width} height={totalH} fill={theme.bg} />
      {/* קווי ענפים */}
      {items.map((_, i) => {
        const a = angle(i);
        const x = cx + R * Math.cos(a);
        const y = cy + R * Math.sin(a);
        const color = theme.palette[i % theme.palette.length];
        const sx = cx + hubR * Math.cos(a);
        const sy = cy + hubR * Math.sin(a);
        return <line key={i} x1={sx} y1={sy} x2={x} y2={y} stroke={color} strokeWidth={2.5} strokeDasharray={rough ? '6 5' : undefined} strokeLinecap="round" />;
      })}
      {/* מרכז */}
      <Circle cx={cx} cy={cy} d={hubR * 2} fill={theme.palette[0]} stroke={theme.palette[0]} isRough={rough} fillStyle="solid" seed={42} />
      <g>
        {hubLines.map((ln, i) => (
          <text
            key={i}
            x={cx}
            y={cy - ((hubLines.length - 1) * 12) + i * 24 + 7}
            textAnchor="middle"
            fontSize={19}
            fontWeight={800}
            fill="#ffffff"
            fontFamily="'Heebo', sans-serif"
            direction="rtl"
          >
            {ln}
          </text>
        ))}
      </g>
      {/* צמתים וטקסט */}
      {items.map((it, i) => {
        const a = angle(i);
        const x = cx + R * Math.cos(a);
        const y = cy + R * Math.sin(a);
        const color = theme.palette[i % theme.palette.length];
        const nodeD = 46;

        const labelDist = R + nodeD / 2 + 16;
        const lx = cx + labelDist * Math.cos(a);
        const ly = cy + labelDist * Math.sin(a);
        const onRight = Math.cos(a) > 0.3;
        const onLeft = Math.cos(a) < -0.3;
        const anchor: 'start' | 'middle' | 'end' = onRight ? 'start' : onLeft ? 'end' : 'middle';
        const textMaxW = onRight || onLeft ? 200 : 230;
        const titleSize = 16;
        const bodySize = 12.5;
        const titleH = textBlockHeight(it.title, titleSize, textMaxW, 1.3, 2, 700);
        const above = Math.sin(a) < -0.4;

        return (
          <g key={i}>
            <Circle cx={x} cy={y} d={nodeD} fill={color} stroke={color} isRough={rough} fillStyle="solid" seed={i + 7} />
            {hasIcon(it.icon) ? (
              <ItemIcon name={it.icon} cx={x} cy={y} size={23} color="#ffffff" />
            ) : (
              <text x={x} y={y + 6} textAnchor="middle" fontSize={16} fontWeight={800} fill="#ffffff" fontFamily="'Heebo', sans-serif">
                {i + 1}
              </text>
            )}
            <RtlText x={lx} y={above ? ly - 10 - titleH : ly + 4} text={it.title} size={titleSize} weight={700} color={theme.text} anchor={anchor} maxWidth={textMaxW} maxLines={2} />
            {it.body && (
              <RtlText x={lx} y={(above ? ly - 10 - titleH : ly + 4) + titleH + 3} text={it.body} size={bodySize} color={theme.subtext} anchor={anchor} maxWidth={textMaxW} maxLines={2} />
            )}
          </g>
        );
      })}
      <MainTitle title={undefined} width={width} theme={theme} />
    </svg>
  );
}
