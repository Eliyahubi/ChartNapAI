import { z } from 'zod';

/**
 * הסכמה הסמנטית — לב המערכת.
 * ה-LLM (או המסווג ההיוריסטי) מתרגם טקסט חופשי למבנה הזה,
 * ומנוע הפריסה מצייר אותו דטרמיניסטית.
 */

export const VISUAL_TYPES = [
  'list', // רשימת נקודות
  'flow', // תהליך / שלבים
  'cycle', // מחזור
  'pyramid', // היררכיה
  'comparison', // השוואה (שני צדדים)
  'timeline', // ציר זמן
  'funnel', // משפך — סינון/צמצום הדרגתי
  'matrix', // מטריצה 2x2 — קטגוריות מצטלבות (SWOT)
  'mindmap', // מפת חשיבה — מרכז + ענפים
  'target', // מטרה — רמות מהליבה החוצה
  'steps', // מדרגות — התקדמות לעבר יעד
  'mountain', // הרים עולים — סדרת צמיחה
  'snake', // נחש — סרט מתפתל
  'sector', // סקטורים — טבעת 360°
  'stairs3d', // מדרגות תלת-ממד — קוביות איזומטריות
  'ring', // טבעת חצים — פריטים על מעגל
  'roadmap', // מפת דרכים — כביש מתפתל
  'tree', // היררכיית עץ — שורש מתפצל לענפים
  'cards', // כרטיסי רצף — שורת כרטיסים מאוירים
  'chevron', // חיצי שברון — רצף אופקי
  'vtimeline', // ציר זמן אנכי — פס מרכזי עם תחנות
] as const;

export type VisualType = (typeof VISUAL_TYPES)[number];

// מודלים נוטים להחזיר null בשדות אופציונליים — מנרמלים ל-undefined
const optStr = (max: number) =>
  z.string().max(max).nullish().transform((v) => v ?? undefined);

export const VisualItemSchema = z.object({
  title: z.string().min(1).max(60).describe('כותרת קצרה (2-5 מילים)'),
  body: optStr(220).describe('משפט הסבר קצר'),
  side: z.enum(['a', 'b']).nullish().transform((v) => v ?? undefined).describe('להשוואה בלבד: לאיזה צד שייך הפריט'),
  label: optStr(20).describe('לציר זמן: תאריך/שנה'),
  icon: optStr(30).describe('שם אייקון מהמאגר (אנגלית)'),
});

export const VisualDocSchema = z.object({
  type: z.enum(VISUAL_TYPES).describe('סוג הוויזואליזציה המתאים ביותר לתוכן'),
  title: optStr(80).describe('כותרת ראשית לאינפוגרפיקה'),
  items: z.array(VisualItemSchema).min(2).max(8),
  sideLabels: z
    .tuple([z.string().max(30), z.string().max(30)])
    .nullish()
    .transform((v) => v ?? undefined)
    .describe('להשוואה: כותרות שני הצדדים'),
});

export type VisualItem = z.infer<typeof VisualItemSchema>;
export type VisualDoc = z.infer<typeof VisualDocSchema>;

export const TYPE_LABELS: Record<VisualType, string> = {
  list: 'רשימה',
  flow: 'תהליך',
  cycle: 'מחזור',
  pyramid: 'פירמידה',
  comparison: 'השוואה',
  timeline: 'ציר זמן',
  funnel: 'משפך',
  matrix: 'מטריצה',
  mindmap: 'מפת חשיבה',
  target: 'מטרה',
  steps: 'מדרגות',
  mountain: 'הרים עולים',
  snake: 'נחש גריד',
  sector: 'סקטורים',
  stairs3d: 'מדרגות 3D',
  ring: 'טבעת חצים',
  roadmap: 'מפת דרכים',
  tree: 'היררכיית עץ',
  cards: 'כרטיסי רצף',
  chevron: 'חיצי שברון',
  vtimeline: 'ציר זמן אנכי',
};
