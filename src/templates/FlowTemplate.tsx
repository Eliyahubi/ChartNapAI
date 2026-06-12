import type { TemplateProps } from './common';
import { Box, Circle, RtlText, Arrow, MainTitle, TITLE_SPACE, textBlockHeight } from './common';
import { ItemIcon, hasIcon } from '../core/icons';

/**
 * תהליך RTL: שלב 1 בקצה הימני, הזרימה שמאלה, החצים מצביעים שמאלה.
 * עד 3 שלבים — שורה אחת; יותר — שתי שורות בנחש (boustrophedon).
 */
export default function FlowTemplate({ doc, theme, rough, width = 960 }: TemplateProps) {
  const n = doc.items.length;
  const perRow = n <= 3 ? n : Math.ceil(n / 2);
  const rows = Math.ceil(n / perRow);
  const margin = 40;
  const gapX = 46;
  const cardW = (width - margin * 2 - gapX * (perRow - 1)) / perRow;
  const titleSize = 17;
  const bodySize = 13.5;
  const textMaxW = cardW - 32;

  // גובה אחיד לכל הכרטיסים לפי הטקסט הארוך ביותר
  const cardH = Math.max(
    ...doc.items.map(
      (it) =>
        56 +
        textBlockHeight(it.title, titleSize, textMaxW, 1.3, 2, 700) +
        (it.body ? textBlockHeight(it.body, bodySize, textMaxW, 1.4, 4) + 10 : 0) +
        18
    )
  );

  const top = doc.title ? TITLE_SPACE : 28;
  const gapY = 56;
  const totalH = top + rows * cardH + (rows - 1) * gapY + 30;

  /** מיקום כרטיס לפי אינדקס: שורה ראשונה ימין→שמאל, שנייה שמאל→ימין (נחש) */
  function pos(i: number) {
    const row = Math.floor(i / perRow);
    const col = i % perRow;
    const visCol = row % 2 === 0 ? col : perRow - 1 - col; // נחש
    const x = width - margin - cardW - visCol * (cardW + gapX); // 0 = הכי ימני
    const y = top + row * (cardH + gapY);
    return { x, y, row, visCol };
  }

  return (
    <svg width={width} height={totalH} viewBox={`0 0 ${width} ${totalH}`} xmlns="http://www.w3.org/2000/svg" style={{ background: theme.bg }}>
      <rect width={width} height={totalH} fill={theme.bg} />
      <MainTitle title={doc.title} width={width} theme={theme} />
      {/* חצים */}
      {doc.items.map((_, i) => {
        if (i === n - 1) return null;
        const a = pos(i);
        const b = pos(i + 1);
        if (a.row === b.row) {
          const y = a.y + cardH / 2;
          // באותה שורה: חץ אופקי בין הכרטיסים
          const fromX = a.row % 2 === 0 ? a.x : a.x + cardW;
          const toX = a.row % 2 === 0 ? b.x + cardW : b.x;
          return <Arrow key={i} x1={fromX - (a.row % 2 === 0 ? 6 : -6)} y1={y} x2={toX + (a.row % 2 === 0 ? 8 : -8)} y2={y} color={theme.accent} isRough={rough} />;
        }
        // מעבר שורה: חץ אנכי
        const x = a.x + cardW / 2;
        return <Arrow key={i} x1={x} y1={a.y + cardH + 6} x2={b.x + cardW / 2} y2={b.y - 8} color={theme.accent} isRough={rough} />;
      })}
      {/* כרטיסים */}
      {doc.items.map((it, i) => {
        const { x, y } = pos(i);
        const color = theme.palette[i % theme.palette.length];
        const numD = 40;
        return (
          <g key={i}>
            <Box x={x} y={y} w={cardW} h={cardH} fill={theme.cardBg} stroke={color} isRough={rough} seed={i + 1} fillStyle="solid" />
            <rect x={x} y={y} width={cardW} height={7} rx={3} fill={color} />
            <Circle cx={x + cardW - 28} cy={y + 36} d={numD} fill={color} stroke={color} isRough={rough} fillStyle="solid" seed={i + 20} />
            {hasIcon(it.icon) ? (
              <ItemIcon name={it.icon} cx={x + cardW - 28} cy={y + 36} size={21} color="#ffffff" />
            ) : (
              <text x={x + cardW - 28} y={y + 43} textAnchor="middle" fontSize={18} fontWeight={700} fill="#ffffff" fontFamily="'Heebo', sans-serif">
                {i + 1}
              </text>
            )}
            <RtlText x={x + cardW - 56} y={y + 42} text={it.title} size={titleSize} weight={700} color={theme.text} maxWidth={textMaxW - 44} maxLines={2} />
            {it.body && (
              <RtlText x={x + cardW - 16} y={y + 56 + textBlockHeight(it.title, titleSize, textMaxW - 44, 1.3, 2, 700)} text={it.body} size={bodySize} color={theme.subtext} maxWidth={textMaxW} maxLines={4} />
            )}
          </g>
        );
      })}
    </svg>
  );
}
