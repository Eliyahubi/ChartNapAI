import type { TemplateProps } from './common';
import { Circle, RtlText, MainTitle, TITLE_SPACE, textBlockHeight, Arrow } from './common';

/**
 * ציר זמן RTL: האירוע הראשון בקצה הימני, הזמן מתקדם שמאלה.
 * אירועים לסירוגין מעל/מתחת לציר.
 */
export default function TimelineTemplate({ doc, theme, rough, width = 960 }: TemplateProps) {
  const n = doc.items.length;
  const top = doc.title ? TITLE_SPACE : 30;
  const margin = 70;
  const lineY = top + 190;
  const usable = width - margin * 2;
  const step = n > 1 ? usable / (n - 1) : 0;
  const nodeD = 26;
  const titleSize = 15.5;
  const bodySize = 12.5;
  const textMaxW = Math.min(200, step > 0 ? step - 14 : 200);

  const totalH = lineY + 190 + 20;

  /** x של אירוע i: מימין לשמאל */
  const xOf = (i: number) => width - margin - i * step;

  /** מרכז בלוק הטקסט, מוגבל כך שלא ייחתך בקצוות הקנבס */
  const textCx = (x: number) => Math.min(Math.max(x, 14 + textMaxW / 2), width - 14 - textMaxW / 2);

  return (
    <svg width={width} height={totalH} viewBox={`0 0 ${width} ${totalH}`} xmlns="http://www.w3.org/2000/svg" style={{ background: theme.bg }}>
      <rect width={width} height={totalH} fill={theme.bg} />
      <MainTitle title={doc.title} width={width} theme={theme} />
      {/* הציר עצמו — חץ שמצביע שמאלה (כיוון הזמן ב-RTL) */}
      <Arrow x1={width - margin + 30} y1={lineY} x2={margin - 34} y2={lineY} color={theme.accent} isRough={rough} width={3} />
      {doc.items.map((it, i) => {
        const x = xOf(i);
        const above = i % 2 === 0;
        const color = theme.palette[i % theme.palette.length];
        const titleH = textBlockHeight(it.title, titleSize, textMaxW, 1.3, 2, 700);
        const bodyH = it.body ? textBlockHeight(it.body, bodySize, textMaxW, 1.35, 3) : 0;
        const stemLen = 38;
        const blockH = titleH + (it.body ? bodyH + 6 : 0);
        const textTopY = above ? lineY - stemLen - blockH - 12 : lineY + stemLen + 26;

        return (
          <g key={i}>
            <line x1={x} y1={above ? lineY - stemLen : lineY + stemLen} x2={x} y2={lineY} stroke={color} strokeWidth={2} strokeDasharray={rough ? '5 4' : undefined} />
            <Circle cx={x} cy={lineY} d={nodeD} fill={color} stroke={color} isRough={rough} seed={i + 1} />
            {it.label && (
              <text x={x} y={above ? lineY + 32 : lineY - 20} textAnchor="middle" fontSize={15} fontWeight={800} fill={color} fontFamily="'Heebo', sans-serif">
                {it.label}
              </text>
            )}
            <RtlText x={textCx(x)} y={textTopY} text={it.title} size={titleSize} weight={700} color={theme.text} anchor="middle" maxWidth={textMaxW} maxLines={2} />
            {it.body && (
              <RtlText x={textCx(x)} y={textTopY + titleH + 5} text={it.body} size={bodySize} color={theme.subtext} anchor="middle" maxWidth={textMaxW} maxLines={3} />
            )}
          </g>
        );
      })}
    </svg>
  );
}
