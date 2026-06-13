import type { TemplateProps } from './common';
import { Box, RtlText, MainTitle, TITLE_SPACE, textBlockHeight } from './common';
import { ItemIcon, hasIcon } from '../core/icons';

/**
 * כרטיסי רצף — שורת כרטיסים אנכיים מדורגים (לסירוגין מעט מעלה/מטה),
 * כל כרטיס: עיגול אייקון/מספר למעלה, כותרת, גוף, ושורת נקודות התקדמות.
 * RTL: כרטיס 1 בצד ימין.
 */
export default function CardsTemplate({ doc, theme, rough, width = 960 }: TemplateProps) {
  const n = doc.items.length;
  const top = doc.title ? TITLE_SPACE : 30;
  const margin = 36;
  const gap = 16;
  const cardW = (width - margin * 2 - gap * (n - 1)) / n;

  const titleSize = 14.5;
  const bodySize = 11.5;
  const textW = cardW - 26;
  const headH = 64;   // אזור העיגול למעלה
  const dotsH = 26;   // שורת הנקודות למטה

  // גובה אחיד מהטקסט הארוך ביותר
  const innerMax = Math.max(
    ...doc.items.map((it) =>
      textBlockHeight(it.title, titleSize, textW, 1.25, 2, 700) +
      (it.body ? textBlockHeight(it.body, bodySize, textW, 1.3, 4) + 6 : 0)
    )
  );
  const cardH = headH + innerMax + dotsH + 20;
  const stagger = 26;
  const totalH = top + stagger + cardH + 26;

  return (
    <svg width={width} height={totalH} viewBox={`0 0 ${width} ${totalH}`} xmlns="http://www.w3.org/2000/svg" style={{ background: theme.bg }}>
      <rect width={width} height={totalH} fill={theme.bg} />
      <MainTitle title={doc.title} width={width} theme={theme} />

      {doc.items.map((it, i) => {
        const color = theme.palette[i % theme.palette.length];
        const visIdx = n - 1 - i; // RTL: פריט 0 בימין
        const x = margin + visIdx * (cardW + gap);
        const y = top + (i % 2 === 0 ? 0 : stagger);
        const cx = x + cardW / 2;

        const circleCy = y + 34;
        const titleY = y + headH + titleSize;
        const titleH = textBlockHeight(it.title, titleSize, textW, 1.25, 2, 700);

        return (
          <g key={i}>
            {/* כרטיס */}
            <Box x={x} y={y} w={cardW} h={cardH} r={16} fill={theme.cardBg} stroke={color} isRough={rough} fillStyle="solid" seed={i + 5} />
            {/* פס עליון בצבע */}
            <rect x={x} y={y} width={cardW} height={6} rx={3} fill={color} />

            {/* עיגול אייקון/מספר */}
            <circle cx={cx} cy={circleCy} r={22} fill={color} />
            {hasIcon(it.icon) ? (
              <ItemIcon name={it.icon} cx={cx} cy={circleCy} size={22} color="#ffffff" />
            ) : (
              <text x={cx} y={circleCy + 7} textAnchor="middle" fontSize={20} fontWeight={800} fill="#ffffff" fontFamily="'Heebo', sans-serif">{i + 1}</text>
            )}

            {/* כותרת + גוף */}
            <RtlText x={cx} y={titleY} text={it.title} size={titleSize} weight={700} color={theme.text} anchor="middle" maxWidth={textW} maxLines={2} lineHeight={1.25} />
            {it.body && (
              <RtlText x={cx} y={titleY + titleH + 4} text={it.body} size={bodySize} color={theme.subtext} anchor="middle" maxWidth={textW} maxLines={4} lineHeight={1.3} />
            )}

            {/* נקודות התקדמות — i+1 מלאות */}
            {Array.from({ length: n }).map((_, d) => {
              const dotR = 3.4;
              const spacing = dotR * 2 + 5;
              const totalDotsW = n * dotR * 2 + (n - 1) * 5;
              const dx = cx - totalDotsW / 2 + dotR + d * spacing;
              const dy = y + cardH - 16;
              return <circle key={d} cx={dx} cy={dy} r={dotR} fill={d <= i ? color : theme.subtext} fillOpacity={d <= i ? 1 : 0.3} />;
            })}
          </g>
        );
      })}
    </svg>
  );
}
