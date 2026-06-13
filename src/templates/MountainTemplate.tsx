import type { TemplateProps } from './common';
import { PaintPath, RtlText, MainTitle, TITLE_SPACE, textBlockHeight, mixHex } from './common';

/**
 * הרים עולים — כל פריט = הר, גדלים מימין לשמאל (RTL).
 * 4 פוליגונים לכל הר: שמאל-עליון, ימין-עליון, שמאל-תחתון, ימין-תחתון.
 * פריטים מוצגים מתחת להרים.
 */
export default function MountainTemplate({ doc, theme, rough, width = 960 }: TemplateProps) {
  const n = doc.items.length;
  const top = doc.title ? TITLE_SPACE : 30;
  const maxMH = 280; // גובה ההר הגדול ביותר
  const slotW = width / n;
  const baseY = top + maxMH + 30;

  // גובה בלוק טקסט מקסימלי לפריט
  const textGap = 26; // רווח בין בסיס ההרים לכותרות
  const textAreaH =
    textBlockHeight('כותרת', 15, slotW - 16, 1.35, 2, 700) +
    textBlockHeight('גוף', 12, slotW - 16, 1.3, 2, 400) + 6;
  const totalH = baseY + textGap + textAreaH + 24;

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

      {doc.items.map((item, i) => {
        // RTL: פריט 0 בחריץ הימני ביותר, פריט n-1 בשמאלי ביותר
        const rtlIndex = n - 1 - i;
        const t = n > 1 ? i / (n - 1) : 0.5; // 0=קטן, 1=גדול
        const mH = maxMH * (0.18 + 0.82 * t);
        const mW = slotW * (0.28 + 0.58 * t);

        // מרכז ה-x לפי סדר RTL
        const cx = slotW * rtlIndex + slotW / 2;

        const color = theme.palette[i % theme.palette.length];
        const ltColor = mixHex(color, '#ffffff', 0.52); // שמאל-עליון (שלג)
        const rtColor = mixHex(ltColor, '#000000', 0.15); // ימין-עליון (צל)
        const lbColor = color; // שמאל-תחתון
        const rbColor = mixHex(color, '#000000', 0.22); // ימין-תחתון

        // נקודות גיאומטריות
        const peakY = baseY - mH;
        const snowY = peakY + mH * 0.35;
        const snowHW = (mW / 2) * 0.35; // חצי רוחב השלג

        // נתיבי 4 פוליגונים
        const dLT = `M ${cx},${peakY} L ${cx - snowHW},${snowY} L ${cx},${snowY} Z`;
        const dRT = `M ${cx},${snowY} L ${cx + snowHW},${snowY} L ${cx},${peakY} Z`;
        const dLB = `M ${cx - snowHW},${snowY} L ${cx - mW / 2},${baseY} L ${cx},${baseY} L ${cx},${snowY} Z`;
        const dRB = `M ${cx},${snowY} L ${cx},${baseY} L ${cx + mW / 2},${baseY} L ${cx + snowHW},${snowY} Z`;

        const textY = baseY + textGap;
        const titleH = textBlockHeight(item.title, 15, slotW - 16, 1.35, 2, 700);

        return (
          <g key={i}>
            {/* גוף ההר */}
            <PaintPath d={dLB} fill={lbColor} stroke={lbColor} isRough={rough} fillStyle="solid" seed={i * 4 + 1} />
            <PaintPath d={dRB} fill={rbColor} stroke={rbColor} isRough={rough} fillStyle="solid" seed={i * 4 + 2} />
            <PaintPath d={dLT} fill={ltColor} stroke={ltColor} isRough={rough} fillStyle="solid" seed={i * 4 + 3} />
            <PaintPath d={dRT} fill={rtColor} stroke={rtColor} isRough={rough} fillStyle="solid" seed={i * 4 + 4} />

            {/* מספר על ההר */}
            <text
              x={cx}
              y={snowY + (baseY - snowY) * 0.52 + 7}
              textAnchor="middle"
              fontSize={Math.max(13, mH * 0.12)}
              fontWeight={800}
              fill="#ffffff"
              fillOpacity={0.92}
              fontFamily="'Heebo', sans-serif"
            >
              {i + 1}
            </text>

            {/* כותרת + גוף מתחת */}
            <RtlText
              x={cx}
              y={textY}
              text={item.title}
              size={15}
              weight={700}
              color={theme.text}
              anchor="middle"
              maxWidth={slotW - 14}
              maxLines={2}
            />
            {item.body && (
              <RtlText
                x={cx}
                y={textY + titleH + 3}
                text={item.body}
                size={12}
                color={theme.subtext}
                anchor="middle"
                maxWidth={slotW - 14}
                maxLines={2}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
