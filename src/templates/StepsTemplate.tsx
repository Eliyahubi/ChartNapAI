import type { TemplateProps } from './common';
import { Box, RtlText, MainTitle, TITLE_SPACE, textBlockHeight, Arrow } from './common';

/**
 * מדרגות RTL: עלייה מימין-למטה לשמאל-למעלה — הקריאה מתחילה מימין
 * וההתקדמות (והצמיחה) שמאלה ומעלה. טקסט מעל כל מדרגה.
 */
export default function StepsTemplate({ doc, theme, rough, width = 960 }: TemplateProps) {
  const n = Math.min(doc.items.length, 6);
  const items = doc.items.slice(0, n);
  const top = doc.title ? TITLE_SPACE : 30;
  const margin = 50;
  const stepW = (width - margin * 2) / n;
  const riser = 52; // הפרש גובה בין מדרגות
  const baseH = 56; // גובה המדרגה הראשונה

  const titleSize = 15.5;
  const bodySize = 12.5;
  const textMaxW = stepW - 18;

  // גובה בלוק הטקסט הגבוה ביותר — שמור מעל המדרגה הגבוהה
  const blockHeights = items.map((it) => {
    const th = textBlockHeight(it.title, titleSize, textMaxW, 1.25, 2, 700);
    const bh = it.body ? textBlockHeight(it.body, bodySize, textMaxW, 1.35, 3) + 4 : 0;
    return th + bh + 14;
  });
  const maxBlock = Math.max(...blockHeights);

  const floorY = top + maxBlock + (n - 1) * riser + baseH + 24; // קו הרצפה
  const totalH = floorY + 18;

  return (
    <svg width={width} height={totalH} viewBox={`0 0 ${width} ${totalH}`} xmlns="http://www.w3.org/2000/svg" style={{ background: theme.bg }}>
      <rect width={width} height={totalH} fill={theme.bg} />
      <MainTitle title={doc.title} width={width} theme={theme} />
      {/* חץ עלייה לאורך המדרגות — רק כשיש מספיק מדרגות שלא יתנגש בכותרת */}
      {n >= 3 && (
        <Arrow
          x1={width - margin - stepW * 0.45}
          y1={floorY - baseH - 38 - blockHeights[0]}
          x2={margin + stepW * 0.55}
          y2={Math.max(top + 14, floorY - baseH - (n - 1) * riser - 38 - blockHeights[n - 1])}
          color={theme.subtext}
          isRough={rough}
          width={1.6}
        />
      )}
      {items.map((it, i) => {
        // RTL: מדרגה 1 בקצה הימני
        const x = width - margin - (i + 1) * stepW;
        const h = baseH + i * riser;
        const y = floorY - h;
        const color = theme.palette[i % theme.palette.length];
        const titleH = textBlockHeight(it.title, titleSize, textMaxW, 1.25, 2, 700);
        const textTop = y - blockHeights[i];

        return (
          <g key={i}>
            <Box x={x} y={y} w={stepW - 8} h={h} fill={color} stroke={color} isRough={rough} fillStyle="solid" r={4} seed={i + 2} />
            <text x={x + (stepW - 8) / 2} y={y + 30} textAnchor="middle" fontSize={20} fontWeight={800} fill="#ffffff" fontFamily="'Heebo', sans-serif">
              {i + 1}
            </text>
            <RtlText x={x + (stepW - 8) / 2} y={textTop + titleSize} text={it.title} size={titleSize} weight={700} color={theme.text} anchor="middle" maxWidth={textMaxW} maxLines={2} lineHeight={1.25} />
            {it.body && (
              <RtlText x={x + (stepW - 8) / 2} y={textTop + titleH + bodySize + 4} text={it.body} size={bodySize} color={theme.subtext} anchor="middle" maxWidth={textMaxW} maxLines={3} lineHeight={1.35} />
            )}
          </g>
        );
      })}
      {/* קו רצפה */}
      <line x1={margin - 10} y1={floorY} x2={width - margin + 10} y2={floorY} stroke={theme.subtext} strokeWidth={1.5} />
    </svg>
  );
}
