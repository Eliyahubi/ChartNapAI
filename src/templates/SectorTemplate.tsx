import type { TemplateProps } from './common';
import { PaintPath, RtlText, MainTitle, TITLE_SPACE, textBlockHeight } from './common';

/**
 * סקטורים — טבעת 360° מחולקת ל-n פרוסות, עם תוויות משני צדי הטבעת.
 * RTL: המחצית הראשונה (1..k) בצד ימין מלמעלה למטה, השאר בצד שמאל.
 * הנקודה הצבעונית בקצה החיצוני, הטקסט זורם פנימה לעבר הטבעת.
 */
export default function SectorTemplate({ doc, theme, rough, width = 960 }: TemplateProps) {
  const n = doc.items.length;
  const top = doc.title ? TITLE_SPACE : 30;

  const margin = 28;
  const gap = 26;                                   // רווח בין הטבעת לטור הטקסט
  const sideW = Math.min(270, width * 0.3);         // רוחב טור טקסט בכל צד
  const dotR = 13;

  const outerR = Math.min(170, (width / 2 - margin - sideW - gap), (width - 200) / 2);
  const innerR = outerR * 0.56;
  const cx = width / 2;

  const titleSize = 14.5;
  const bodySize = 11.5;
  const labelTextW = sideW - dotR * 2 - 16;

  // גובה בלוק לכל פריט (כותרת + גוף)
  const blockH = (it: { title: string; body?: string }) =>
    textBlockHeight(it.title, titleSize, labelTextW, 1.2, 2, 700) +
    (it.body ? textBlockHeight(it.body, bodySize, labelTextW, 1.3, 2) + 3 : 0);

  const rightCount = Math.ceil(n / 2);
  const leftCount = n - rightCount;
  const groupMax = Math.max(rightCount, leftCount, 1);
  const rowH = Math.max(...doc.items.map(blockH), dotR * 2) + 20;

  const contentH = Math.max(outerR * 2, groupMax * rowH);
  const cy = top + contentH / 2;
  const totalH = top + contentH + 28;

  // גיאומטריה של הפרוסות
  const GAP_DEG = Math.min(4, (360 / n) * 0.08);
  const sectorDeg = (360 - GAP_DEG * n) / n;
  const sectorRad = (sectorDeg * Math.PI) / 180;
  const gapRad = (GAP_DEG * Math.PI) / 180;
  const startOffset = -Math.PI / 2;

  function arc(startA: number, endA: number, rOuter: number, rInner: number): string {
    const large = endA - startA > Math.PI ? 1 : 0;
    const ox1 = cx + rOuter * Math.cos(startA);
    const oy1 = cy + rOuter * Math.sin(startA);
    const ox2 = cx + rOuter * Math.cos(endA);
    const oy2 = cy + rOuter * Math.sin(endA);
    const ix1 = cx + rInner * Math.cos(endA);
    const iy1 = cy + rInner * Math.sin(endA);
    const ix2 = cx + rInner * Math.cos(startA);
    const iy2 = cy + rInner * Math.sin(startA);
    return (
      `M ${ox1} ${oy1} A ${rOuter} ${rOuter} 0 ${large} 1 ${ox2} ${oy2} ` +
      `L ${ix1} ${iy1} A ${rInner} ${rInner} 0 ${large} 0 ${ix2} ${iy2} Z`
    );
  }

  // מיקום אנכי של פריט בתוך קבוצת צד
  function labelY(posInGroup: number, count: number): number {
    const groupH = count * rowH;
    return cy - groupH / 2 + rowH * (posInGroup + 0.5);
  }

  function Label({ item, i, onRight, y }: { item: { title: string; body?: string }; i: number; onRight: boolean; y: number }) {
    const color = theme.palette[i % theme.palette.length];
    const dotX = onRight ? width - margin - dotR : margin + dotR;
    const txtX = onRight ? dotX - dotR - 12 : dotX + dotR + 12;
    const anchor = onRight ? ('end' as const) : ('start' as const);
    const bh = blockH(item);
    const titleY = y - bh / 2 + titleSize;
    const titleH = textBlockHeight(item.title, titleSize, labelTextW, 1.2, 2, 700);
    return (
      <g>
        <circle cx={dotX} cy={y} r={dotR} fill={color} />
        <text x={dotX} y={y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff" fontFamily="'Heebo', sans-serif">{i + 1}</text>
        <RtlText x={txtX} y={titleY} text={item.title} size={titleSize} weight={700} color={theme.text} anchor={anchor} maxWidth={labelTextW} maxLines={2} lineHeight={1.2} />
        {item.body && (
          <RtlText x={txtX} y={titleY + titleH + 3} text={item.body} size={bodySize} color={theme.subtext} anchor={anchor} maxWidth={labelTextW} maxLines={2} lineHeight={1.3} />
        )}
      </g>
    );
  }

  return (
    <svg width={width} height={totalH} viewBox={`0 0 ${width} ${totalH}`} xmlns="http://www.w3.org/2000/svg" style={{ background: theme.bg }}>
      <rect width={width} height={totalH} fill={theme.bg} />
      <MainTitle title={doc.title} width={width} theme={theme} />

      {/* פרוסות הטבעת + מספר בכל פרוסה */}
      {doc.items.map((_, i) => {
        const startA = startOffset + i * (sectorRad + gapRad);
        const endA = startA + sectorRad;
        const midA = startA + sectorRad / 2;
        const midR = (outerR + innerR) / 2;
        const color = theme.palette[i % theme.palette.length];
        return (
          <g key={i}>
            <PaintPath d={arc(startA, endA, outerR, innerR)} fill={color} stroke={theme.bg} strokeWidth={2} isRough={rough} fillStyle="solid" seed={i + 1} />
            <text x={cx + midR * Math.cos(midA)} y={cy + midR * Math.sin(midA) + 6} textAnchor="middle" fontSize={17} fontWeight={800} fill="#ffffff" fontFamily="'Heebo', sans-serif">{i + 1}</text>
          </g>
        );
      })}

      {/* תוויות: מחצית ראשונה בימין, השאר בשמאל */}
      {doc.items.map((item, i) => {
        const onRight = i < rightCount;
        const pos = onRight ? i : i - rightCount;
        const count = onRight ? rightCount : leftCount;
        return <Label key={`l${i}`} item={item} i={i} onRight={onRight} y={labelY(pos, count)} />;
      })}
    </svg>
  );
}
