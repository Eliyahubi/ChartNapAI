# ChartNap AI

מחולל אינפוגרפיקה מקומי מבוסס React, עם תמיכה מלאה בעברית, RTL, עריכה ידנית וייצוא למגוון פורמטים.

Client-side infographic generator built with React, with full Hebrew/RTL support, manual editing, structured JSON input, and multi-format export.

## סקירה | Overview

ChartNap AI מאפשר להפוך טקסט, מסמך או JSON מובנה לאינפוגרפיקה מוכנה לשימוש. המערכת רצה בדפדפן, ללא שרת חובה, ומאפשרת לעבוד עם מפתח API אישי או במצב דמו מבוסס כללים.

ChartNap AI turns text, documents, or structured JSON into ready-to-use infographics. It runs in the browser, does not require a backend, and supports either a personal API key or a rule-based demo mode.

## יתרונות מרכזיים | Key Benefits

- תמיכה מלאה בעברית ובכיווניות RTL, כולל ייצוא תקין לתמונה, SVG ו-PowerPoint.
- Full Hebrew and RTL support, including reliable export to image, SVG, and PowerPoint.
- עריכה ידנית של כותרת, פריטים, סדר, טקסטים, אייקונים, ערכות צבע וסגנון ציור.
- Manual editing for titles, items, order, text, icons, color themes, and drawing style.
- עבודה עם טקסט חופשי, קבצים או JSON מובנה.
- Supports free text, uploaded files, or structured JSON.
- אפשר להעתיק פרומפט למודל שפה חיצוני, לקבל ממנו JSON תקין, ולהדביק אותו באפליקציה ליצירת אינפוגרפיקה מדויקת יותר.
- You can copy a prompt to an external language model, receive valid JSON, and paste it back into the app to generate a more controlled infographic.
- ייצוא תמונה בשלושה גדלים קבועים: אנכי 9:16, אופקי 16:9 וריבוע 1:1, בנוסף לגודל אוטומטי.
- PNG export in three fixed formats: vertical 9:16, horizontal 16:9, and square 1:1, plus automatic size.
- ייצוא PowerPoint עריך עם תיבות טקסט וצורות, לא רק תמונה שטוחה.
- Editable PowerPoint export with native text boxes and shapes, not only a flat image.
- ייצוא SVG בקווי מתאר לשמירה על מראה זהה, ו-SVG עם טקסט חי לעריכה בכלים וקטוריים.
- SVG export as outlined text for consistent rendering, and live-text SVG for vector editing tools.

## צילומי מסך | Screenshots

צילומי המסך נמצאים בתיקיית `_screenshot` ומשולבים כאן כגלריה.

The screenshots are stored in `_screenshot` and embedded below as a gallery.

<p>
  <img src="_screenshot/infographic-9x16%20%281%29.png" width="180" alt="ChartNap AI screenshot 1">
  <img src="_screenshot/infographic-9x16%20%282%29.png" width="180" alt="ChartNap AI screenshot 2">
  <img src="_screenshot/infographic-9x16%20%283%29.png" width="180" alt="ChartNap AI screenshot 3">
  <img src="_screenshot/infographic-9x16%20%284%29.png" width="180" alt="ChartNap AI screenshot 4">
  <img src="_screenshot/infographic-9x16%20%285%29.png" width="180" alt="ChartNap AI screenshot 5">
  <img src="_screenshot/infographic-9x16%20%286%29.png" width="180" alt="ChartNap AI screenshot 6">
  <img src="_screenshot/infographic-9x16%20%287%29.png" width="180" alt="ChartNap AI screenshot 7">
  <img src="_screenshot/infographic-9x16%20%288%29.png" width="180" alt="ChartNap AI screenshot 8">
  <img src="_screenshot/infographic-9x16%20%289%29.png" width="180" alt="ChartNap AI screenshot 9">
  <img src="_screenshot/infographic-9x16%20%2810%29.png" width="180" alt="ChartNap AI screenshot 10">
  <img src="_screenshot/infographic-9x16%20%2811%29.png" width="180" alt="ChartNap AI screenshot 11">
  <img src="_screenshot/infographic-9x16%20%2812%29.png" width="180" alt="ChartNap AI screenshot 12">
  <img src="_screenshot/infographic-9x16%20%2813%29.png" width="180" alt="ChartNap AI screenshot 13">
  <img src="_screenshot/infographic-9x16%20%2814%29.png" width="180" alt="ChartNap AI screenshot 14">
  <img src="_screenshot/infographic-9x16%20%2815%29.png" width="180" alt="ChartNap AI screenshot 15">
  <img src="_screenshot/infographic-9x16%20%2816%29.png" width="180" alt="ChartNap AI screenshot 16">
  <img src="_screenshot/infographic-9x16%20%2817%29.png" width="180" alt="ChartNap AI screenshot 17">
  <img src="_screenshot/infographic-9x16%20%2818%29.png" width="180" alt="ChartNap AI screenshot 18">
  <img src="_screenshot/infographic-9x16%20%2819%29.png" width="180" alt="ChartNap AI screenshot 19">
  <img src="_screenshot/infographic-9x16%20%2820%29.png" width="180" alt="ChartNap AI screenshot 20">
  <img src="_screenshot/infographic-9x16%20%2821%29.png" width="180" alt="ChartNap AI screenshot 21">
</p>

## יכולות | Features

- 21 תבניות אינפוגרפיקה: רשימה, תהליך, מחזור, פירמידה, השוואה, ציר זמן, משפך, מטריצה, מפת חשיבה, מטרה, מדרגות, הרים, נחש, סקטורים, מדרגות 3D, טבעת, מפת דרכים, עץ, כרטיסים, שברון וציר זמן אנכי.
- 21 infographic templates: list, flow, cycle, pyramid, comparison, timeline, funnel, matrix, mind map, target, steps, mountain, snake, sector, 3D stairs, ring, roadmap, tree, cards, chevron, and vertical timeline.
- מנועי AI נתמכים: Google Gemini, Anthropic Claude, OpenAI ו-Ollama מקומי. מפתחות נשמרים בדפדפן בלבד.
- Supported AI engines: Google Gemini, Anthropic Claude, OpenAI, and local Ollama. Keys are stored only in the browser.
- מצב דמו ללא מפתח API, המבוסס על זיהוי מילות מפתח.
- Demo mode without an API key, based on keyword detection.
- העלאת קבצים: Word, PDF, Excel, TXT, Markdown, JSON, CSV ועוד.
- File upload: Word, PDF, Excel, TXT, Markdown, JSON, CSV, and more.
- ממשק בכמה שפות, עם התאמה אוטומטית לכיווניות RTL/LTR.
- Multi-language UI with automatic RTL/LTR direction handling.
- ספריית אייקונים מבוססת lucide עם חיפוש לפי שמות ותוויות.
- Searchable lucide-based icon library.
- סגנונות ציור: נקי, ידני ו-watercolor.
- Drawing styles: clean, hand-drawn, and watercolor.
- ערכות צבע מוכנות ופלטה מותאמת אישית.
- Built-in color themes and custom palette support.

## עבודה עם JSON ומודל שפה | JSON and LLM Workflow

אפשר לעבוד בשתי דרכים:

There are two main workflows:

1. כתיבה או העלאה ישירה: מדביקים טקסט, מעלים קובץ, בוחרים מנוע AI ומייצרים אינפוגרפיקה.
2. עבודה עם JSON: מעתיקים מהאפליקציה פרומפט ייעודי, שולחים אותו למודל שפה חיצוני יחד עם התוכן, מקבלים JSON תקין, ומדביקים אותו בתיבת הטקסט באפליקציה.

1. Direct input or upload: paste text, upload a file, choose an AI engine, and generate an infographic.
2. JSON workflow: copy the app's dedicated prompt, send it to an external language model with your content, receive valid JSON, and paste it into the app.

מבנה ה-JSON מבוסס על סכמה סמנטית פשוטה:

The JSON structure is based on a simple semantic schema:

```json
{
  "type": "flow",
  "title": "כותרת האינפוגרפיקה",
  "items": [
    {
      "title": "שלב ראשון",
      "body": "הסבר קצר",
      "icon": "sparkles"
    },
    {
      "title": "שלב שני",
      "body": "הסבר קצר נוסף",
      "icon": "settings"
    }
  ]
}
```

השיטה הזו מתאימה כאשר רוצים שליטה גבוהה יותר במבנה, בשמות השלבים, בכמות הפריטים ובאייקונים.

This workflow is useful when you need more control over the structure, item names, number of items, and icons.

## ייצוא | Export

| פורמט | שימוש עיקרי |
|---|---|
| PNG אוטומטי | שמירה מהירה לפי גודל האינפוגרפיקה בפועל |
| PNG 9:16 | סטורי, מובייל, מסך אנכי |
| PNG 16:9 | מצגות, מסכים רחבים, שקפים |
| PNG 1:1 | פוסטים מרובעים ורשתות חברתיות |
| SVG בקווי מתאר | תוצאה יציבה להדבקה או פתיחה בכלים שונים, ללא תלות בפונט |
| SVG עם טקסט חי | עריכה בכלים וקטוריים כגון Illustrator או Inkscape |
| PPTX | שקף PowerPoint עריך עם טקסט וצורות |

| Format | Main Use |
|---|---|
| Auto PNG | Quick export using the actual infographic size |
| PNG 9:16 | Stories, mobile, vertical screens |
| PNG 16:9 | Presentations, widescreen displays, slides |
| PNG 1:1 | Square posts and social platforms |
| Outlined SVG | Stable rendering across tools without font dependency |
| Live-text SVG | Editing in vector tools such as Illustrator or Inkscape |
| PPTX | Editable PowerPoint slide with native text and shapes |

## התקנה | Installation

נדרש Node.js 18 ומעלה.

Requires Node.js 18 or later.

### הפעלה ללא טרמינל | No Terminal

לאחר התקנת Node.js, הפעילו את אחד הקבצים:

After installing Node.js, run one of these launchers:

- macOS: `start-mac.command`
- Windows: `start-windows.bat`

בהפעלה ראשונה יותקנו התלויות. לאחר מכן הדפדפן ייפתח אוטומטית.

On the first run, dependencies are installed. After that, the browser opens automatically.

### הפעלה בטרמינל | Terminal

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

### בניית גרסת הפצה | Production Build

```bash
npm run build
npm run preview
```

תיקיית `dist` היא סטטית וניתנת לפרסום בכל שירות אחסון סטטי.

The `dist` folder is static and can be deployed to any static hosting service.

## מפתחות API | API Keys

אפשר לבחור מנוע AI ולהדביק מפתח אישי. המפתח נשמר ב-localStorage בדפדפן ונשלח רק לספק שנבחר.

You can choose an AI engine and paste your own key. The key is stored in browser localStorage and sent only to the selected provider.

| Engine | Get a key | Notes |
|---|---|---|
| Google Gemini | <https://aistudio.google.com/apikey> | Default model: `gemini-2.5-flash` |
| Anthropic Claude | <https://console.anthropic.com/settings/keys> | Default model: `claude-sonnet-4-6` |
| OpenAI | <https://platform.openai.com/api-keys> | Default model: `gpt-4o-mini` |
| Ollama | <https://ollama.com> | Local model, no API key required |
| Demo | - | Rule-based mode without external AI |

אפשר לגבות ולהעביר הגדרות באמצעות `Save settings to file` ו-`Load settings from file`.

Settings can be backed up or moved using `Save settings to file` and `Load settings from file`.

## טכנולוגיה | Tech

React, Vite, TypeScript, Zod, RoughJS, lucide, opentype.js, pptxgenjs, mammoth, pdfjs-dist ו-xlsx.

React, Vite, TypeScript, Zod, RoughJS, lucide, opentype.js, pptxgenjs, mammoth, pdfjs-dist, and xlsx.

מנוע הרינדור מייצר SVG דטרמיניסטי מתוך JSON סמנטי. הטיפול בעברית כולל מדידת טקסט, מיקום מפורש, bidi isolates וייצוא קווי מתאר.

The rendering engine creates deterministic SVG from semantic JSON. Hebrew handling includes text measurement, explicit positioning, bidi isolates, and outlined export.

## הערות | Notes

- קריאות API ישירות מהדפדפן מתאימות לשימוש מקומי או אישי. לפרסום ציבורי מומלץ להשתמש בפרוקסי שרת.
- Direct browser API calls are suitable for local or personal use. For public deployment, use a server-side proxy.
- בסגנונות ידני ו-watercolor ייתכנו הבדלים כאשר SVG נפתח בכלי Office. במקרים כאלה מומלץ להשתמש ב-PNG או PPTX.
- Hand-drawn and watercolor styles may render differently when SVG is opened in Office tools. Use PNG or PPTX when exact rendering is required.

## רישיון | License

MIT. Icons: [lucide](https://lucide.dev) (ISC). Font: [Heebo](https://fonts.google.com/specimen/Heebo) (OFL).
