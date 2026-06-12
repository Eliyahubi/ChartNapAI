import type { VisualDoc, VisualItem, VisualType } from './schema';

/**
 * מסווג היוריסטי — "מצב דמו" שעובד בלי מפתח API.
 * מזהה את סוג הוויזואליזציה לפי מילות מפתח בעברית ומפרק את הטקסט לפריטים.
 * ה-LLM (llm.ts) נותן תוצאה איכותית יותר; זה הגיבוי הדטרמיניסטי.
 */

const RULES: { type: VisualType; words: RegExp }[] = [
  { type: 'comparison', words: /לעומת|מנגד|בניגוד|יתרונות וחסרונות|מצד אחד|מצד שני|בעד ונגד|ההבדל בין/ },
  { type: 'fishbone', words: /הגורמים ל|הסיבות ל|נובע מ|בגלל|כתוצאה מ|מה גורם|שורש הבעיה/ },
  { type: 'funnel', words: /משפך|סינון|מצטמצם|מסנן|המרה|ליד|מתוך \d+ נשאר/ },
  { type: 'matrix', words: /SWOT|סווט|חוזקות וחולשות|מטריצה|ארבעה רבעים|שני צירים/ },
  { type: 'target', words: /ליבה|במרכז ה|מעגל פנימי|עדיפות עליונה|מיקוד|טווח קצר וארוך/ },
  { type: 'steps', words: /מדרגות|בדרך ל|עלייה|צמיחה|להגיע ל|יעד סופי|התקדמות לקראת/ },
  { type: 'mindmap', words: /היבטים|תחומים|מפת חשיבה|סיעור מוחות|נושאים הקשורים|זוויות/ },
  { type: 'flow', words: /שלב|תהליך|לאחר מכן|בהמשך|תחילה|ראשית|שנית|ולבסוף|צעד|הדרגתי/ },
  { type: 'cycle', words: /מחזור|מעגל|חוזר על עצמו|שוב ושוב|לולאה|איטרציה|מחזורי/ },
  { type: 'pyramid', words: /היררכיה|בסיס|רמות|שכבות|פירמידה|דרג|בראש ה|תשתית/ },
  { type: 'timeline', words: /\b(19|20)\d{2}\b|ציר זמן|כרונולוגי|בשנת|בעשור|תאריך/ },
];

export function detectType(text: string): VisualType {
  for (const rule of RULES) {
    if (rule.words.test(text)) return rule.type;
  }
  return 'list';
}

/** פיצול טקסט למשפטים, עם רגישות לקיצורים עבריים נפוצים */
function splitSentences(text: string): string[] {
  return text
    .replace(/\n+/g, '. ')
    .split(/(?<=[.!?:;])\s+/)
    .map((s) => s.replace(/^[\d.\-•*]+\s*/, '').trim())
    .filter((s) => s.length > 12);
}

/** כותרת קצרה מתוך משפט: 3-4 מילים משמעותיות ראשונות */
function makeTitle(sentence: string): string {
  const stop = new Set(['של', 'את', 'על', 'עם', 'גם', 'כי', 'אשר', 'הוא', 'היא', 'זה', 'זו', 'אבל', 'או', 'אם', 'כל', 'יש', 'אין', 'מאוד', 'יותר', 'כאשר', 'לאחר', 'מכן', 'כדי']);
  const words = sentence.replace(/[,"'״׳()]/g, '').split(/\s+/);
  const kept: string[] = [];
  for (const w of words) {
    if (kept.length >= 4) break;
    if (stop.has(w) && kept.length > 0) continue;
    kept.push(w);
  }
  let title = kept.join(' ');
  if (title.length > 40) title = title.slice(0, 38) + '…';
  return title;
}

function extractYear(sentence: string): string | undefined {
  const m = sentence.match(/\b(19|20)\d{2}\b/);
  return m ? m[0] : undefined;
}

export function classifyHeuristic(text: string): VisualDoc {
  const type = detectType(text);
  const sentences = splitSentences(text);
  const max = type === 'pyramid' ? 5 : 6;
  const chosen = sentences.slice(0, Math.max(2, Math.min(sentences.length, max)));

  const items: VisualItem[] = chosen.map((s, i) => {
    const item: VisualItem = {
      title: makeTitle(s),
      body: s.length > 160 ? s.slice(0, 158) + '…' : s,
    };
    if (type === 'comparison') item.side = i % 2 === 0 ? 'a' : 'b';
    if (type === 'timeline') item.label = extractYear(s);
    return item;
  });

  // השוואה דורשת לפחות פריט אחד בכל צד
  if (type === 'comparison' && items.length < 2) {
    return { type: 'list', items };
  }

  const doc: VisualDoc = { type, items };
  if (type === 'comparison') doc.sideLabels = ['צד ראשון', 'צד שני'];
  return doc;
}
