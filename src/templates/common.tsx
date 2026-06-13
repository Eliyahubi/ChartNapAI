import { createContext, useContext, useMemo } from 'react';
import rough from 'roughjs';
import type { Theme } from '../core/themes';

/* ---------- מצב ציור גלובלי ---------- */
export type PaintMode = 'clean' | 'rough' | 'wash';
export const PaintContext = createContext<PaintMode>('clean');

/** פילטר צבעי מים: רעש פרקטלי שמעוות את קצוות הצורה */
function WashDefs() {
  return (
    <defs>
      <filter id="hnWashF" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.015 0.02" numOctaves="3" seed="7" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="13" />
      </filter>
    </defs>
  );
}

export const FONT = "'Heebo', 'Arial Hebrew', 'Noto Sans Hebrew', sans-serif";

export interface TemplateProps {
  doc: import('../core/schema').VisualDoc;
  theme: Theme;
  rough: boolean;
  width?: number;
}

/* ---------- מדידת רוחב טקסט ---------- */
/**
 * ברירת מחדל: אומדן (Heebo עברית ≈ 0.52em לתו, מודגש מעט רחב יותר).
 * בדפדפן מוחלף במדידה מדויקת עם canvas.measureText (ראו registerCanvasMeasurer).
 */
type Measurer = (text: string, fontSize: number, weight: number) => number;

let measure: Measurer = (text, fontSize, weight) =>
  text.length * fontSize * (weight >= 700 ? 0.55 : 0.52);

export function setTextMeasurer(fn: Measurer) {
  measure = fn;
}

/** רישום מודד מבוסס canvas — לקרוא בדפדפן אחרי טעינת הפונטים */
export function registerCanvasMeasurer() {
  if (typeof document === 'undefined') return;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  setTextMeasurer((text, fontSize, weight) => {
    ctx.font = `${weight} ${fontSize}px Heebo, 'Arial Hebrew', sans-serif`;
    return ctx.measureText(text).width;
  });
}

/* ---------- שבירת שורות לטקסט עברי ---------- */
export function wrapText(text: string, fontSize: number, maxWidth: number, weight = 400): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const candidate = line ? line + ' ' + w : w;
    if (measure(candidate, fontSize, weight) > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/* ---------- טקסט RTL בתוך SVG ---------- */
/**
 * עטיפת רצפים לטיניים ב-isolates (LRI...PDI) כדי ש"ב-AI" לא יתהפך
 * גם במנועי רינדור שלא מיישמים unicode-bidi:plaintext (resvg, ייצוא PNG).
 */
export function fixBidi(text: string): string {
  return text.replace(/[A-Za-z][A-Za-z0-9'’.&%/-]*(?:\s+[A-Za-z0-9'’.&%/-]+)*/g, (m) => `⁦${m}⁩`);
}

export function RtlText({
  x,
  y,
  text,
  size,
  color,
  weight = 400,
  anchor = 'end', // ב-RTL נקודת העיגון הטבעית היא הקצה הימני
  maxWidth,
  lineHeight = 1.35,
  maxLines = 4,
}: {
  x: number;
  y: number;
  text: string;
  size: number;
  color: string;
  weight?: number;
  anchor?: 'start' | 'middle' | 'end';
  maxWidth?: number;
  lineHeight?: number;
  maxLines?: number;
}) {
  let lines = maxWidth ? wrapText(text, size, maxWidth, weight) : [text];
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    lines[maxLines - 1] = lines[maxLines - 1].replace(/.{2}$/, '') + '…';
  }
  /**
   * עיגון: תמיד textAnchor="middle" עם הזזת x לפי רוחב מדוד.
   * הסיבה: ב-direction="rtl" המשמעות של start/end מתהפכת בדפדפן
   * (end = הקצה השמאלי!) ומנועי רינדור אחרים מתנהגים אחרת.
   * middle הוא היחיד שעקבי בכל המנועים. anchor כאן הוא *ויזואלי*:
   * 'end' = הקצה הימני ב-x, 'start' = הקצה השמאלי ב-x.
   */
  return (
    <g>
      {lines.map((ln, i) => {
        const w = measure(ln, size, weight);
        const cx = anchor === 'end' ? x - w / 2 : anchor === 'start' ? x + w / 2 : x;
        return (
          <text
            key={i}
            x={cx}
            y={y + i * size * lineHeight}
            fontFamily={FONT}
            fontSize={size}
            fontWeight={weight}
            fill={color}
            direction="rtl"
            textAnchor="middle"
            /* רוחב מדוד נצרב בקובץ: מציגים בלי Heebo (Preview וכד')
               יכווצו את השורה בדיוק לרוחב הזה — אין גלישה מהשוליים בייצוא */
            textLength={ln.length > 2 ? Math.round(w) : undefined}
            lengthAdjust="spacingAndGlyphs"
          >
            {'‏' + fixBidi(ln)}
          </text>
        );
      })}
    </g>
  );
}

export function textBlockHeight(
  text: string,
  size: number,
  maxWidth: number,
  lineHeight = 1.35,
  maxLines = 4,
  weight = 400
): number {
  const n = Math.min(wrapText(text, size, maxWidth, weight).length, maxLines);
  return n * size * lineHeight;
}

/* ---------- צורות: רגיל / rough ---------- */
const generator = rough.generator();

function roughDrawableToPaths(drawable: ReturnType<typeof generator.rectangle>, fill: string, stroke: string) {
  return drawable.sets.map((set, i) => {
    const d = generator.opsToPath(set);
    if (set.type === 'fillPath') {
      return <path key={i} d={d} fill={fill} stroke="none" />;
    }
    if (set.type === 'fillSketch') {
      return <path key={i} d={d} fill="none" stroke={fill} strokeWidth={1.4} />;
    }
    return <path key={i} d={d} fill="none" stroke={stroke} strokeWidth={1.8} />;
  });
}

export function Box({
  x,
  y,
  w,
  h,
  fill,
  stroke,
  r = 10,
  isRough,
  fillStyle = 'hachure',
  seed = 1,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  stroke: string;
  r?: number;
  isRough: boolean;
  fillStyle?: string;
  seed?: number;
}) {
  const paint = useContext(PaintContext);
  const content = useMemo(() => {
    if (!isRough && paint === 'wash') {
      const op = fillStyle === 'solid' ? 0.78 : 0.5;
      return (
        <g>
          <WashDefs />
          <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} fillOpacity={op} stroke={stroke} strokeOpacity={0.85} strokeWidth={2.2} filter="url(#hnWashF)" />
        </g>
      );
    }
    if (!isRough) {
      return <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={stroke} strokeWidth={1.5} />;
    }
    const drawable = generator.rectangle(x, y, w, h, {
      fill,
      stroke,
      fillStyle,
      roughness: 1.6,
      fillWeight: 1.2,
      hachureGap: 7,
      seed,
    });
    return <g>{roughDrawableToPaths(drawable, fill, stroke)}</g>;
  }, [x, y, w, h, fill, stroke, r, isRough, fillStyle, seed, paint]);
  return content;
}

export function Circle({
  cx,
  cy,
  d,
  fill,
  stroke,
  isRough,
  fillStyle = 'hachure',
  seed = 1,
}: {
  cx: number;
  cy: number;
  d: number;
  fill: string;
  stroke: string;
  isRough: boolean;
  fillStyle?: string;
  seed?: number;
}) {
  const paint = useContext(PaintContext);
  const content = useMemo(() => {
    if (!isRough && paint === 'wash') {
      const op = fillStyle === 'solid' ? 0.82 : 0.5;
      return (
        <g>
          <WashDefs />
          <circle cx={cx} cy={cy} r={d / 2} fill={fill} fillOpacity={op} stroke={stroke} strokeOpacity={0.85} strokeWidth={2.2} filter="url(#hnWashF)" />
        </g>
      );
    }
    if (!isRough) {
      return <circle cx={cx} cy={cy} r={d / 2} fill={fill} stroke={stroke} strokeWidth={1.5} />;
    }
    const drawable = generator.circle(cx, cy, d, {
      fill,
      stroke,
      fillStyle,
      roughness: 1.4,
      fillWeight: 1.2,
      hachureGap: 6,
      seed,
    });
    return <g>{roughDrawableToPaths(drawable, fill, stroke)}</g>;
  }, [cx, cy, d, fill, stroke, isRough, fillStyle, seed, paint]);
  return content;
}

export function Polygon({
  points,
  fill,
  stroke,
  isRough,
  fillStyle = 'hachure',
  seed = 1,
}: {
  points: [number, number][];
  fill: string;
  stroke: string;
  isRough: boolean;
  fillStyle?: string;
  seed?: number;
}) {
  const paint = useContext(PaintContext);
  const content = useMemo(() => {
    if (!isRough && paint === 'wash') {
      const op = fillStyle === 'solid' ? 0.78 : 0.5;
      return (
        <g>
          <WashDefs />
          <polygon
            points={points.map((p) => p.join(',')).join(' ')}
            fill={fill}
            fillOpacity={op}
            stroke={stroke}
            strokeOpacity={0.85}
            strokeWidth={2.2}
            filter="url(#hnWashF)"
          />
        </g>
      );
    }
    if (!isRough) {
      return (
        <polygon
          points={points.map((p) => p.join(',')).join(' ')}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.5}
        />
      );
    }
    const drawable = generator.polygon(points, {
      fill,
      stroke,
      fillStyle,
      roughness: 1.5,
      fillWeight: 1.2,
      hachureGap: 7,
      seed,
    });
    return <g>{roughDrawableToPaths(drawable, fill, stroke)}</g>;
  }, [JSON.stringify(points), fill, stroke, isRough, fillStyle, seed, paint]);
  return content;
}

/* ---------- נתיב SVG כללי (קשתות, סקטורים, דרכים) עם תמיכת סגנונות ---------- */
export function PaintPath({
  d,
  fill = 'none',
  stroke = 'none',
  isRough,
  fillStyle = 'solid',
  seed = 1,
  strokeWidth = 1.5,
  fillOpacity,
  strokeLinecap,
  dash,
}: {
  d: string;
  fill?: string;
  stroke?: string;
  isRough: boolean;
  fillStyle?: string;
  seed?: number;
  strokeWidth?: number;
  fillOpacity?: number;
  strokeLinecap?: 'round' | 'butt' | 'square';
  dash?: string;
}) {
  const paint = useContext(PaintContext);
  const content = useMemo(() => {
    if (!isRough && paint === 'wash' && fill !== 'none') {
      const op = fillOpacity ?? (fillStyle === 'solid' ? 0.78 : 0.5);
      return (
        <g>
          <WashDefs />
          <path d={d} fill={fill} fillOpacity={op} stroke={stroke} strokeOpacity={0.85} strokeWidth={Math.max(strokeWidth, 2.2)} filter="url(#hnWashF)" strokeLinecap={strokeLinecap} strokeDasharray={dash} />
        </g>
      );
    }
    if (!isRough) {
      return <path d={d} fill={fill} fillOpacity={fillOpacity} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeDasharray={dash} />;
    }
    try {
      const drawable = generator.path(d, {
        fill: fill === 'none' ? undefined : fill,
        stroke: stroke === 'none' ? fill : stroke,
        fillStyle,
        roughness: 1.3,
        fillWeight: 1.2,
        hachureGap: 7,
        strokeWidth: Math.min(strokeWidth, 3),
        seed,
      });
      return <g>{roughDrawableToPaths(drawable, fill === 'none' ? stroke : fill, stroke === 'none' ? fill : stroke)}</g>;
    } catch {
      return <path d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeDasharray={dash} />;
    }
  }, [d, fill, stroke, isRough, fillStyle, seed, strokeWidth, fillOpacity, strokeLinecap, dash, paint]);
  return content;
}

/* ---------- ערבוב צבעי hex (תחליף קל ל-tinycolor) ---------- */
export function mixHex(c1: string, c2: string, w: number): string {
  const p = (c: string) => {
    const h = c.replace('#', '');
    const f = h.length === 3 ? h.split('').map((x) => x + x).join('') : h;
    return [parseInt(f.slice(0, 2), 16), parseInt(f.slice(2, 4), 16), parseInt(f.slice(4, 6), 16)];
  };
  const a = p(c1);
  const b = p(c2);
  const m = a.map((v, i) => Math.round(v + (b[i] - v) * w));
  return '#' + m.map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
}

/* ---------- חץ RTL (מצביע שמאלה כברירת מחדל) ---------- */
export function Arrow({
  x1,
  y1,
  x2,
  y2,
  color,
  isRough,
  width = 2.5,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  isRough: boolean;
  width?: number;
}) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLen = 11;
  const hx1 = x2 - headLen * Math.cos(angle - 0.45);
  const hy1 = y2 - headLen * Math.sin(angle - 0.45);
  const hx2 = x2 - headLen * Math.cos(angle + 0.45);
  const hy2 = y2 - headLen * Math.sin(angle + 0.45);

  const line = useMemo(() => {
    if (!isRough) {
      return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" />;
    }
    const drawable = generator.line(x1, y1, x2, y2, { stroke: color, roughness: 1.2, strokeWidth: width, seed: 7 });
    return <g>{roughDrawableToPaths(drawable, 'none', color)}</g>;
  }, [x1, y1, x2, y2, color, isRough, width]);

  return (
    /* data-arrow: רמז לממיר ה-PPTX — קו עם ראש חץ נטיבי */
    <g data-arrow={`${x1},${y1},${x2},${y2}`} data-color={color} data-width={width}>
      {line}
      <polyline
        points={`${hx1},${hy1} ${x2},${y2} ${hx2},${hy2}`}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

/* ---------- כותרת ראשית ---------- */
export function MainTitle({ title, width, theme }: { title?: string; width: number; theme: Theme }) {
  if (!title) return null;
  return (
    <RtlText x={width / 2} y={46} text={title} size={28} weight={700} color={theme.text} anchor="middle" maxWidth={width - 80} maxLines={2} />
  );
}

export const TITLE_SPACE = 70; // גובה שמור לכותרת
