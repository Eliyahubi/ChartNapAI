import type { TemplateProps } from './common';
import { PaintPath, RtlText, MainTitle, TITLE_SPACE, textBlockHeight, mixHex } from './common';

/**
 * מדרגות תלת-ממד — קוביות איזומטריות עולות מימין לשמאל (RTL).
 * כל קובייה: פנים קדמי + גג + צד ימני. מספר על הפנים.
 * הטקסט ממוקם *מתחת* לכל קובייה, ברוחב הקובייה — כך אינו גולש לשכנות.
 */
export default function Stairs3dTemplate({ doc, theme, rough, width = 960 }: TemplateProps) {
  const n = doc.items.length;
  const top = doc.title ? TITLE_SPACE : 20;

  // גדלי הקובייה — מותאמים לרוחב ול-n פריטים
  const cW = Math.min(150, (width - 120) / n); // רוחב הפנים הקדמי
  const cH = cW * 0.75;       // גובה הפנים הקדמי
  const dX = cW * 0.28;       // עומק x (היטל איזומטרי)
  const dY = cW * 0.16;       // עומק y
  const stepUp = cH * 0.7;    // עליית כל מדרגה
  const GAP_X = cW * 0.06;    // רווח בין קוביות

  // בסיס ה-y: בּסיס הקובייה הנמוכה ביותר (i=0)
  const baseY = top + (n - 1) * stepUp + cH + dY + 14;

  // רוחב כולל: n קוביות + dX עבור האחרונה
  const totalUsed = n * (cW + GAP_X) + dX;
  const startX = (width - totalUsed) / 2;

  // רוחב הטקסט מתחת לקובייה — לא חורג מעבר לרוחב הקובייה + הרווח
  const textW = cW + GAP_X - 4;
  const titleSize = 13.5;
  const bodySize = 11;
  const labelGap = 14; // מרווח בין תחתית הקובייה לטקסט

  // גובה בלוק טקסט לכל פריט, וחישוב הגובה הכולל לפי הקובייה הנמוכה (הטקסט הנמוך ביותר)
  let maxBottom = baseY;
  const labelH: number[] = doc.items.map((item) => {
    const th = textBlockHeight(item.title, titleSize, textW, 1.25, 2, 700);
    const bh = item.body ? textBlockHeight(item.body, bodySize, textW, 1.3, 2) + 3 : 0;
    return th + bh;
  });
  doc.items.forEach((_, i) => {
    const cubeBottom = baseY - i * stepUp;
    maxBottom = Math.max(maxBottom, cubeBottom + labelGap + labelH[i]);
  });
  const totalH = maxBottom + 22;

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
        // RTL: פריט 0 ימינה (נמוך), פריט n-1 שמאלה (גבוה)
        const rtlIdx = n - 1 - i; // האינדקס הויזואלי בסדר LTR
        const cubeX = startX + rtlIdx * (cW + GAP_X);
        const cubeY = baseY - cH - (i * stepUp); // עולה עם i

        const color = theme.palette[i % theme.palette.length];
        const topColor = mixHex(color, '#ffffff', 0.35);
        const sideColor = mixHex(color, '#000000', 0.28);

        // פינות הפנים הקדמי
        const ftl = { x: cubeX, y: cubeY };
        const ftr = { x: cubeX + cW, y: cubeY };
        const fbr = { x: cubeX + cW, y: cubeY + cH };
        const fbl = { x: cubeX, y: cubeY + cH };

        // פינות עומק
        const btl = { x: cubeX + dX, y: cubeY - dY };
        const btr = { x: cubeX + cW + dX, y: cubeY - dY };

        const dTop = `M ${ftl.x},${ftl.y} L ${ftr.x},${ftr.y} L ${btr.x},${btr.y} L ${btl.x},${btl.y} Z`;
        const dFront = `M ${ftl.x},${ftl.y} L ${ftr.x},${ftr.y} L ${fbr.x},${fbr.y} L ${fbl.x},${fbl.y} Z`;
        const dSide = `M ${ftr.x},${ftr.y} L ${btr.x},${btr.y} L ${btr.x},${btr.y + cH} L ${fbr.x},${fbr.y} Z`;

        // טקסט מתחת לקובייה, ממורכז לרוחב הפנים הקדמי
        const txtCx = cubeX + cW / 2;
        const txtY = cubeY + cH + labelGap + titleSize;
        const titleH = textBlockHeight(item.title, titleSize, textW, 1.25, 2, 700);

        return (
          <g key={i}>
            {/* פנים קדמי */}
            <PaintPath d={dFront} fill={color} stroke={mixHex(color, '#000000', 0.1)} strokeWidth={1} isRough={rough} fillStyle="solid" seed={i * 3 + 1} />
            {/* גג */}
            <PaintPath d={dTop} fill={topColor} stroke={mixHex(topColor, '#000000', 0.1)} strokeWidth={1} isRough={rough} fillStyle="solid" seed={i * 3 + 2} />
            {/* צד ימני */}
            <PaintPath d={dSide} fill={sideColor} stroke={mixHex(sideColor, '#000000', 0.1)} strokeWidth={1} isRough={rough} fillStyle="solid" seed={i * 3 + 3} />

            {/* מספר על הפנים */}
            <text
              x={cubeX + cW / 2}
              y={cubeY + cH / 2 + 8}
              textAnchor="middle"
              fontSize={Math.max(16, cW * 0.2)}
              fontWeight={800}
              fill="rgba(255,255,255,0.9)"
              fontFamily="'Heebo', sans-serif"
            >
              {i + 1}
            </text>

            {/* טקסט מתחת לקובייה */}
            <RtlText
              x={txtCx}
              y={txtY}
              text={item.title}
              size={titleSize}
              weight={700}
              color={theme.text}
              anchor="middle"
              maxWidth={textW}
              maxLines={2}
              lineHeight={1.25}
            />
            {item.body && (
              <RtlText
                x={txtCx}
                y={txtY + titleH + 1}
                text={item.body}
                size={bodySize}
                color={theme.subtext}
                anchor="middle"
                maxWidth={textW}
                maxLines={2}
                lineHeight={1.3}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
