import { VisualDocSchema, type VisualDoc } from './schema';

/**
 * שכבת ה-AI: קריאה ישירה ל-Anthropic API מהדפדפן (מתאים ל-MVP מקומי).
 * בפריסה אמיתית עדיף פרוקסי צד-שרת כדי לא לחשוף מפתח.
 */

const SYSTEM_PROMPT = `אתה מנוע סמנטי של מחולל אינפוגרפיקה בעברית.
המשתמש שולח פסקת טקסט. תפקידך:
1. לזהות את המבנה הלוגי של התוכן ולבחור סוג ויזואליזציה מתאים:
   - "list": נקודות עצמאיות ללא סדר מחייב
   - "flow": תהליך עם שלבים עוקבים
   - "cycle": תהליך מחזורי שחוזר על עצמו
   - "pyramid": היררכיה או שכבות (מהבסיס לפסגה)
   - "comparison": השוואה בין שני צדדים/גישות
   - "timeline": אירועים על ציר זמן
   - "funnel": סינון או צמצום הדרגתי משלב רחב לצר (3-5 פריטים)
   - "matrix": ארבע קטגוריות מצטלבות כמו SWOT (בדיוק 4 פריטים)
   - "mindmap": נושא מרכזי אחד עם היבטים בלתי תלויים סביבו (ה-title הוא המרכז)
   - "target": רמות מיקוד או עדיפות מהליבה החוצה (3-4 פריטים, הראשון = הליבה)
   - "steps": התקדמות מדורגת בעלייה לעבר יעד (3-6 פריטים)
   - "fishbone": גורמים או סיבות שמובילים לתוצאה אחת (ה-title הוא התוצאה)
2. לחלץ 3-6 פריטים. לכל פריט: title (2-5 מילים, קליט) ו-body (משפט אחד, עד 20 מילים).
3. ב-comparison: לכל פריט הוסף side ("a" או "b") וקבע sideLabels — שמות שני הצדדים.
4. ב-timeline: לכל פריט הוסף label עם השנה/התאריך.
5. הוסף title כללי קצר לאינפוגרפיקה.
6. לכל פריט הוסף icon — שם אייקון שמתאים לתוכן הפריט, מהרשימה הזו בלבד (באנגלית):
   scale, gavel, file, clock, calendar, money, growth, decline, team, person, idea, target,
   shield, warning, success, fail, settings, search, book, briefcase, building, globe, heart,
   brain, rocket, flag, key, lock, mail, phone, chat, chart-pie, chart-bar, checklist,
   education, medical, truck, leaf, energy, award.
   אם אין התאמה ברורה — השמט את השדה.

כללים:
- ניסוח תמציתי, תקני ונכון עובדתית ביחס לקלט.
- אל תמציא מידע שלא בקלט.
- החזר אך ורק JSON תקין, ללא טקסט נוסף וללא code fences.

מבנה הפלט:
{"type":"flow","title":"...","items":[{"title":"...","body":"...","icon":"scale"},{"title":"...","body":"...","icon":"file"}],"sideLabels":["...","..."]}`;

/** הנחיית שפת פלט: 'auto' = שפת הקלט; אחרת תרגום לשפת היעד */
export function langRule(lang: string): string {
  if (!lang || lang === 'auto') {
    return '\nשפת הפלט: כתוב את כל הכותרות והתכנים באותה שפה שבה כתוב טקסט הקלט.';
  }
  return `\nשפת הפלט: תרגם וכתוב את כל הכותרות והתכנים (title, body, sideLabels) בשפה: ${lang}. גם אם הקלט בשפה אחרת — הפלט כולו בשפת היעד.`;
}

/**
 * Ollama מקומי — חינמי, בלי מפתח, רץ על המחשב שלך.
 * דורש: ollama serve + מודל שתומך עברית סבירה (למשל gemma3, llama3.1, aya).
 */
export async function classifyWithOllama(
  text: string,
  model = 'gemma3:latest',
  lang = 'auto',
  baseUrl = 'http://localhost:11434'
): Promise<VisualDoc> {
  const res = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      format: 'json',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT + langRule(lang) },
        { role: 'user', content: text },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`Ollama ${res.status} — ודאו ש-ollama רץ ושהמודל "${model}" מותקן`);
  }
  const data = await res.json();
  const parsed = JSON.parse(data.message?.content ?? '{}');
  return VisualDocSchema.parse(parsed);
}

export async function classifyWithClaude(
  text: string,
  apiKey: string,
  lang = 'auto',
  model = 'claude-sonnet-4-6'
): Promise<VisualDoc> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1500,
      system: SYSTEM_PROMPT + langRule(lang),
      messages: [{ role: 'user', content: text }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API ${res.status}: ${err.slice(0, 300)}`);
  }

  const data = await res.json();
  const raw: string = data.content?.[0]?.text ?? '';
  const jsonText = raw.replace(/^```(json)?/m, '').replace(/```$/m, '').trim();
  const parsed = JSON.parse(jsonText);
  return VisualDocSchema.parse(parsed);
}

/** ניקוי code fences ופענוח */
function parseDoc(raw: string): VisualDoc {
  const jsonText = raw.replace(/```json/g, '').replace(/```/g, '').trim();
  return VisualDocSchema.parse(JSON.parse(jsonText));
}

/**
 * Google Gemini (AI Studio) — קריאה ישירה מהדפדפן עם מפתח המשתמש.
 * מפתח חינמי: https://aistudio.google.com/apikey
 */
export async function classifyWithGemini(
  text: string,
  apiKey: string,
  lang = 'auto',
  model = 'gemini-2.5-flash'
): Promise<VisualDoc> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT + langRule(lang) }] },
        contents: [{ role: 'user', parts: [{ text }] }],
        generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 2048 },
      }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini ${res.status}: ${err.slice(0, 200)}`);
  }
  const data = await res.json();
  const raw: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return parseDoc(raw);
}

/**
 * OpenAI — קריאה ישירה מהדפדפן עם מפתח המשתמש.
 * מפתח: https://platform.openai.com/api-keys
 */
export async function classifyWithOpenAI(
  text: string,
  apiKey: string,
  lang = 'auto',
  model = 'gpt-4o-mini'
): Promise<VisualDoc> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT + langRule(lang) },
        { role: 'user', content: text },
      ],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI ${res.status}: ${err.slice(0, 200)}`);
  }
  const data = await res.json();
  return parseDoc(data.choices?.[0]?.message?.content ?? '');
}
