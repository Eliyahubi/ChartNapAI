import type { TemplateProps } from './common';
import { RtlText, MainTitle, TITLE_SPACE, textBlockHeight } from './common';

/**
 * נחש — סרט רטרו רב-פסים שמתפתל מלמעלה למטה (בזיגזג), עם עיגולים
 * ממוספרים בכל צומת וטקסט לצד. הסרט מצויר כערימת קווים מקבילים
 * (פס צבע + רווח רקע) שיוצרים אפקט "מסילה" צבעונית רציפה.
 * הקריאה RTL: צומת 1 בצד ימין.
 */
export default function SnakeTemplate({ doc, theme, rough: _rough, width = 960 }: TemplateProps) {
  const n = doc.items.length;
  const top = doc.title ? TITLE_SPACE : 30;

  const pad = 28;
  const sideTextW = Math.min(250, width * 0.27); // רוחב טור הטקסט בכל צד
  const nodeR = 26;
  const rowH = 132;                              // מרחק אנכי בין צמתים

  // עוגני ה-x של הסרט (בין שני טורי הטקסט)
  const rightX = width - sideTextW - pad - nodeR;
  const leftX = sideTextW + pad + nodeR;

  // מרכזי הצמתים — זיגזג RTL: i זוגי בימין, i אי-זוגי בשמאל
  const nodes = doc.items.map((_, i) => ({
    x: i % 2 === 0 ? rightX : leftX,
    y: top + nodeR + 18 + i * rowH,
  }));

  const totalH = top + nodeR + 18 + (n - 1) * rowH + nodeR + 44;

  // זנבות כניסה/יציאה — ממשיכים את משיק הסרט (בלי וו/לולאה)
  function extend(a: { x: number; y: number }, b: { x: number; y: number }, len: number) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const m = Math.hypot(dx, dy) || 1;
    return { x: a.x + (dx / m) * len, y: a.y + (dy / m) * len };
  }
  const ribbonPts =
    n === 1
      ? [{ x: nodes[0].x, y: nodes[0].y - 40 }, nodes[0], { x: nodes[0].x, y: nodes[0].y + 40 }]
      : [
          extend(nodes[0], nodes[1], 46),
          ...nodes,
          extend(nodes[n - 1], nodes[n - 2], 70),
        ];

  // עקומה חלקה (Catmull-Rom → Bézier) דרך נקודות הסרט
  function smooth(pts: { x: number; y: number }[]): string {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] ?? p2;
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;
    }
    return d;
  }
  const ribbonD = smooth(ribbonPts);

  // ערימת קווים מקבילים: פס צבע → רווח רקע → פס צבע …
  const RIBBON_W = 38;
  const STRIPE = 4.5; // עובי פס צבע (לכל צד)
  const GAP = 2.4;    // רווח רקע (לכל צד)
  const layers: { w: number; color: string }[] = [];
  {
    let w = RIBBON_W;
    let ci = 0;
    while (w > 1.5) {
      layers.push({ w, color: theme.palette[ci % theme.palette.length] });
      w -= 2 * STRIPE;
      if (w <= 1) break;
      layers.push({ w, color: theme.bg });
      w -= 2 * GAP;
      ci++;
    }
  }

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

      {/* הסרט הרב-פסי */}
      {layers.map((L, k) => (
        <path
          key={k}
          d={ribbonD}
          fill="none"
          stroke={L.color}
          strokeWidth={L.w}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {/* צמתים + טקסט */}
      {doc.items.map((item, i) => {
        const p = nodes[i];
        const color = theme.palette[i % theme.palette.length];
        const onRight = i % 2 === 0;

        // טור הטקסט בצד החיצוני של הצומת
        const txtX = onRight ? width - pad : leftX - nodeR - 16;
        const txtMaxW = onRight
          ? sideTextW - 6
          : leftX - nodeR - 16 - pad;

        const titleH = textBlockHeight(item.title, 15.5, txtMaxW, 1.25, 2, 700);
        const blockH = titleH + (item.body ? textBlockHeight(item.body, 12, txtMaxW, 1.3, 3) + 4 : 0);
        const titleY = p.y - blockH / 2 + 13;

        return (
          <g key={i}>
            {/* עיגול הצומת — טבעת רקע להפרדה מהסרט */}
            <circle cx={p.x} cy={p.y} r={nodeR + 4} fill={theme.bg} />
            <circle cx={p.x} cy={p.y} r={nodeR} fill={color} />
            <text
              x={p.x}
              y={p.y + 7}
              textAnchor="middle"
              fontSize={20}
              fontWeight={800}
              fill="#ffffff"
              fontFamily="'Heebo', sans-serif"
            >
              {i + 1}
            </text>

            {/* טקסט בצד */}
            <RtlText
              x={txtX}
              y={titleY}
              text={item.title}
              size={15.5}
              weight={700}
              color={theme.text}
              anchor="end"
              maxWidth={txtMaxW}
              maxLines={2}
              lineHeight={1.25}
            />
            {item.body && (
              <RtlText
                x={txtX}
                y={titleY + titleH + 4}
                text={item.body}
                size={12}
                color={theme.subtext}
                anchor="end"
                maxWidth={txtMaxW}
                maxLines={3}
                lineHeight={1.3}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
