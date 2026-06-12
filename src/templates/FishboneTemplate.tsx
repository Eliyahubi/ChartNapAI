import type { TemplateProps } from './common';
import { Box, RtlText, MainTitle, TITLE_SPACE, textBlockHeight, Arrow } from './common';

/**
 * עצם דג RTL (סיבה ותוצאה): השדרה אופקית, הגורמים מתחברים לסירוגין
 * מעל ומתחת, והחץ מצביע שמאלה אל תיבת התוצאה (doc.title).
 */
export default function FishboneTemplate({ doc, theme, rough, width = 960 }: TemplateProps) {
  const n = Math.min(doc.items.length, 6);
  const items = doc.items.slice(0, n);
  const top = doc.title ? TITLE_SPACE : 30;

  const titleSize = 15;
  const bodySize = 12.5;
  const textMaxW = 190;

  const blockH = (it: (typeof items)[number]) =>
    textBlockHeight(it.title, titleSize, textMaxW, 1.25, 2, 700) +
    (it.body ? textBlockHeight(it.body, bodySize, textMaxW, 1.35, 2) + 4 : 0);

  const maxAbove = Math.max(...items.filter((_, i) => i % 2 === 0).map(blockH), 30);
  const maxBelow = Math.max(...items.filter((_, i) => i % 2 === 1).map(blockH), 30);

  const ribLen = 84; // אורך אנכי של צלע
  const spineY = top + maxAbove + ribLen + 36;
  const totalH = spineY + ribLen + maxBelow + 46;

  // תיבת התוצאה בקצה השמאלי
  const resultW = 168;
  const resultH = 84;
  const resultX = 36;
  const spineRight = width - 56;
  const spineLeft = resultX + resultW + 26;

  const perSlot = (spineRight - spineLeft - 40) / Math.max(Math.ceil(n / 2), 1);

  const result = doc.title || 'התוצאה';

  return (
    <svg width={width} height={totalH} viewBox={`0 0 ${width} ${totalH}`} xmlns="http://www.w3.org/2000/svg" style={{ background: theme.bg }}>
      <rect width={width} height={totalH} fill={theme.bg} />
      {/* שדרה — חץ שמאלה אל התוצאה */}
      <Arrow x1={spineRight} y1={spineY} x2={spineLeft - 4} y2={spineY} color={theme.accent} isRough={rough} width={3} />
      {/* תיבת תוצאה */}
      <Box x={resultX} y={spineY - resultH / 2} w={resultW} h={resultH} fill={theme.palette[0]} stroke={theme.palette[0]} isRough={rough} fillStyle="solid" seed={11} />
      <RtlText x={resultX + resultW / 2} y={spineY + 6} text={result} size={16.5} weight={800} color="#ffffff" anchor="middle" maxWidth={resultW - 22} maxLines={3} lineHeight={1.25} />

      {items.map((it, i) => {
        const above = i % 2 === 0;
        const slot = Math.floor(i / 2);
        // RTL: הגורם הראשון בקצה הימני, מתקדמים שמאלה
        const xAttach = spineRight - 30 - slot * perSlot;
        const xTip = xAttach - 46; // הצלע נוטה שמאלה (לכיוון הזרימה)
        const yTip = above ? spineY - ribLen : spineY + ribLen;
        const color = theme.palette[i % theme.palette.length];
        const titleH = textBlockHeight(it.title, titleSize, textMaxW, 1.25, 2, 700);
        const textY = above ? yTip - 12 - blockH(it) + titleSize : yTip + 22;
        // מניעת חיתוך בקצה הימני של הקנבס
        const textCx = Math.min(xTip + textMaxW / 2 - 10, width - 14 - textMaxW / 2);

        return (
          <g key={i}>
            <line x1={xAttach} y1={spineY} x2={xTip} y2={yTip} stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeDasharray={rough ? '6 5' : undefined} />
            <circle cx={xTip} cy={yTip} r={13} fill={color} />
            <text x={xTip} y={yTip + 5} textAnchor="middle" fontSize={13} fontWeight={800} fill="#ffffff" fontFamily="'Heebo', sans-serif">
              {i + 1}
            </text>
            <RtlText x={textCx} y={textY} text={it.title} size={titleSize} weight={700} color={theme.text} anchor="middle" maxWidth={textMaxW} maxLines={2} lineHeight={1.25} />
            {it.body && (
              <RtlText x={textCx} y={textY + titleH + 2} text={it.body} size={bodySize} color={theme.subtext} anchor="middle" maxWidth={textMaxW} maxLines={2} lineHeight={1.35} />
            )}
          </g>
        );
      })}
      <MainTitle title={undefined} width={width} theme={theme} />
    </svg>
  );
}
