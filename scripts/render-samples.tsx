/**
 * סקריפט אימות ויזואלי: מרנדר את כל התבניות ל-SVG ול-PNG.
 * הרצה: npx tsx scripts/render-samples.tsx
 */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import { Infographic } from '../src/templates';
import { THEMES } from '../src/core/themes';
import type { VisualDoc } from '../src/core/schema';

const DOCS: Record<string, VisualDoc> = {
  flow: {
    type: 'flow',
    title: 'תהליך הגשת מכרז מוצלח',
    items: [
      { title: 'קריאת מסמכי המכרז', body: 'קריאה מעמיקה וזיהוי תנאי הסף הקריטיים' },
      { title: 'מיפוי דרישות', body: 'בניית מטריצת עמידה בתנאים לכל סעיף' },
      { title: 'הכנת המענה', body: 'כתיבת המענה המקצועי ואיסוף אסמכתאות' },
      { title: 'בקרת איכות', body: 'בדיקה כפולה של כל המסמכים והנספחים' },
      { title: 'הגשה', body: 'הגשת ההצעה עם מרווח ביטחון לפני המועד' },
    ],
  },
  list: {
    type: 'list',
    title: 'ארבעה עקרונות לשימוש נכון ב-AI',
    items: [
      { title: 'אימות עובדתי', body: 'כל פלט של מודל שפה מחייב בדיקה מול מקור מוסמך' },
      { title: 'הנדסת פרומפט', body: 'הקשר, דוגמאות ומבנה פלט משפרים תוצאות דרמטית' },
      { title: 'פרטיות מידע', body: 'אין להזין מידע רגיש או מזהה למערכות חיצוניות' },
      { title: 'אחריות אנושית', body: 'ההחלטה הסופית נשארת תמיד בידי המומחה האנושי' },
    ],
  },
  cycle: {
    type: 'cycle',
    title: 'מחזור שיפור מתמיד',
    items: [
      { title: 'תכנון', body: 'הגדרת יעדים ומדדים' },
      { title: 'ביצוע', body: 'יישום בהיקף מצומצם' },
      { title: 'בדיקה', body: 'מדידת תוצאות מול יעדים' },
      { title: 'פעולה', body: 'הטמעה רחבה או תיקון' },
    ],
  },
  pyramid: {
    type: 'pyramid',
    title: 'היררכיית הצרכים של מאסלו',
    items: [
      { title: 'הגשמה עצמית', body: 'מימוש הפוטנציאל האישי' },
      { title: 'הערכה', body: 'כבוד, הכרה והישגים' },
      { title: 'שייכות', body: 'קשרים חברתיים ואהבה' },
      { title: 'ביטחון', body: 'יציבות כלכלית ופיזית' },
      { title: 'צרכים פיזיולוגיים', body: 'מזון, שינה וקורת גג' },
    ],
  },
  comparison: {
    type: 'comparison',
    title: 'בוררות מול תביעה בבית משפט',
    sideLabels: ['בוררות', 'בית משפט'],
    items: [
      { title: 'הליך מהיר', body: 'הכרעה תוך חודשים ספורים', side: 'a' },
      { title: 'דיסקרטיות', body: 'ההליך חסוי ולא פומבי', side: 'a' },
      { title: 'עלות גבוהה', body: 'שכר הבורר על הצדדים', side: 'a' },
      { title: 'הליך ממושך', body: 'שנים עד פסק דין חלוט', side: 'b' },
      { title: 'פומביות', body: 'הדיון וההכרעה פומביים', side: 'b' },
      { title: 'אגרה מופחתת', body: 'עלות ההליך נמוכה יחסית', side: 'b' },
    ],
  },
  timeline: {
    type: 'timeline',
    title: 'אבני דרך בבינה מלאכותית',
    items: [
      { title: 'מבחן טיורינג', body: 'אלן טיורינג מציע מבחן לאינטליגנציה', label: '1950' },
      { title: 'ועידת דרטמות', body: 'הולדת המונח בינה מלאכותית', label: '1956' },
      { title: 'למידה עמוקה', body: 'פריצת דרך ברשתות נוירונים', label: '2012' },
      { title: 'טרנספורמרים', body: 'ארכיטקטורה ששינתה את התחום', label: '2017' },
      { title: 'מודלי שפה גדולים', body: 'AI גנרטיבי לכל אדם', label: '2022' },
    ],
  },
};

const outDir = 'samples';
if (!existsSync(outDir)) mkdirSync(outDir);

const fontFiles = process.env.HEEBO_TTF ? [process.env.HEEBO_TTF] : [];

for (const [name, doc] of Object.entries(DOCS)) {
  for (const variant of ['crisp', 'rough'] as const) {
    const theme = variant === 'rough' ? THEMES[2] : THEMES[0];
    const svg = renderToStaticMarkup(
      <Infographic doc={doc} theme={theme} rough={variant === 'rough'} />
    );
    const file = `${outDir}/${name}-${variant}`;
    writeFileSync(`${file}.svg`, svg);
    try {
      const resvg = new Resvg(svg, {
        fitTo: { mode: 'width', value: 1200 },
        font: { fontFiles, loadSystemFonts: true, defaultFontFamily: 'Heebo' },
      });
      writeFileSync(`${file}.png`, resvg.render().asPng());
      console.log(`✓ ${file}.png`);
    } catch (e) {
      console.error(`✗ ${file}: ${(e as Error).message}`);
    }
  }
}
console.log('done');
