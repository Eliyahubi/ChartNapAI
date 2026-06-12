import type { TemplateProps } from './common';
import { Box, Circle, RtlText, MainTitle, TITLE_SPACE, textBlockHeight } from './common';
import { ItemIcon, hasIcon } from '../core/icons';

/**
 * רשימה: כרטיסים אנכיים. עיגול ממוספר בצד ימין (התחלת הקריאה ב-RTL),
 * הטקסט מיושר לימין.
 */
export default function ListTemplate({ doc, theme, rough, width = 960 }: TemplateProps) {
  const margin = 40;
  const cardW = width - margin * 2;
  const numD = 52; // קוטר עיגול המספר
  const textRight = width - margin - numD - 28; // עוגן ימני לטקסט
  const textMaxW = cardW - numD - 60;
  const gap = 18;

  // חישוב גובה דינמי לכל כרטיס
  const titleSize = 19;
  const bodySize = 15;
  const heights = doc.items.map((it) => {
    const th = textBlockHeight(it.title, titleSize, textMaxW, 1.3, 2, 700);
    const bh = it.body ? textBlockHeight(it.body, bodySize, textMaxW, 1.4, 3) : 0;
    return Math.max(numD + 28, th + bh + 42);
  });

  const top = doc.title ? TITLE_SPACE : 24;
  const totalH = top + heights.reduce((a, b) => a + b + gap, 0) + 16;

  let y = top;
  return (
    <svg width={width} height={totalH} viewBox={`0 0 ${width} ${totalH}`} xmlns="http://www.w3.org/2000/svg" style={{ background: theme.bg }}>
      <rect width={width} height={totalH} fill={theme.bg} />
      <MainTitle title={doc.title} width={width} theme={theme} />
      {doc.items.map((it, i) => {
        const h = heights[i];
        const cardY = y;
        y += h + gap;
        const color = theme.palette[i % theme.palette.length];
        const cy = cardY + h / 2;
        return (
          <g key={i}>
            <Box x={margin} y={cardY} w={cardW} h={h} fill={theme.cardBg} stroke={color} isRough={rough} seed={i + 1} fillStyle="solid" />
            {/* פס צבע בצד ימין של הכרטיס */}
            <rect x={width - margin - 6} y={cardY} width={6} height={h} rx={3} fill={color} />
            <Circle cx={width - margin - numD / 2 - 18} cy={cy} d={numD} fill={color} stroke={color} isRough={rough} fillStyle="solid" seed={i + 10} />
            {hasIcon(it.icon) ? (
              <ItemIcon name={it.icon} cx={width - margin - numD / 2 - 18} cy={cy} size={26} color="#ffffff" />
            ) : (
              <text x={width - margin - numD / 2 - 18} y={cy + 8} textAnchor="middle" fontSize={23} fontWeight={700} fill="#ffffff" fontFamily="'Heebo', sans-serif">
                {i + 1}
              </text>
            )}
            <RtlText x={textRight} y={cardY + 30} text={it.title} size={titleSize} weight={700} color={theme.text} maxWidth={textMaxW} maxLines={2} />
            {it.body && (
              <RtlText
                x={textRight}
                y={cardY + 30 + textBlockHeight(it.title, titleSize, textMaxW, 1.3, 2, 700) + 8}
                text={it.body}
                size={bodySize}
                color={theme.subtext}
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
