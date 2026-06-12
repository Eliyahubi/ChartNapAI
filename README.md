# 📊 ChartNap AI

**Text in — infographic out.** An open-source, fully client-side infographic generator with first-class Hebrew/RTL support, inspired by Napkin AI.

טקסט נכנס — אינפוגרפיקה יוצאת. מחולל אינפוגרפיקה בקוד פתוח, רץ כולו בדפדפן, עם תמיכת עברית/RTL מלאה.

## Features | יכולות

- **12 templates**: list, process, cycle, pyramid, comparison, timeline, funnel, matrix (SWOT), mind map, target, steps, fishbone — all RTL-first with live variant gallery.
- **AI analysis with YOUR key**: Google Gemini, Anthropic Claude, OpenAI, or local Ollama — your API key stays in your browser (localStorage), no server involved. A keyword-based demo mode works with no key at all.
- **Live content editing**: titles, items, ordering, and a searchable library of ~170 icons in 8 categories.
- **3 paint styles**: clean, hand-drawn (RoughJS), watercolor.
- **10 color themes** + fully custom palette.
- **Translation**: input in any language, output in the same language or translated (Hebrew, English, Arabic, Russian, French, Spanish).
- **UI in 6 languages** with automatic RTL/LTR flipping.
- **Exports**: outlined SVG (pastes correctly anywhere, no font needed), PNG, and **editable PowerPoint** — real text boxes and shapes, not a picture.
- **Word import**: upload a .docx and the text is extracted in-browser.

## Installation | התקנה

The only requirement is **Node.js 18+** — a one-time install from <https://nodejs.org> (download the LTS installer and keep all defaults).

### The easy way (no terminal) | הדרך הקלה

After installing Node.js, just **double-click the launcher** in this folder:

- **macOS**: `start-mac.command`
  (first time only: if macOS blocks it, right-click → Open. If it opens as text, run once in Terminal: `chmod +x start-mac.command`)
- **Windows**: `start-windows.bat`

The first run installs dependencies (about a minute); after that it starts in seconds and opens the browser automatically. Keep the window open while you use the app; close it to stop.

### The terminal way | דרך הטרמינל

```bash
cd chartnap-ai
npm install
npm run dev
```

Then open <http://localhost:5173>.

### Production build (optional)

```bash
npm run build      # creates dist/
npm run preview    # serves the build locally
```

The `dist/` folder is fully static — host it on any static server (GitHub Pages, Netlify, an office NAS...).

## API keys | מפתחות API

Pick an engine in the app and paste your own key. Keys are stored **only in your browser's localStorage** and sent **only to the provider you chose**.

| Engine | Get a key | Notes |
|---|---|---|
| Google Gemini | <https://aistudio.google.com/apikey> | Free tier available. Default model: `gemini-2.5-flash` |
| Anthropic Claude | <https://console.anthropic.com/settings/keys> | Default model: `claude-sonnet-4-6` |
| OpenAI | <https://platform.openai.com/api-keys> | Default model: `gpt-4o-mini` |
| Ollama (local, free) | <https://ollama.com> → `ollama pull gemma3` | No key needed; runs on your machine |
| Demo | — | No AI: keyword heuristics only |

You can override the model name per engine in the UI.

**Backup / move to another computer:** use the "Save settings to file" / "Load settings from file" buttons in the app — they export and import your API keys and preferences as a small `chartnap-settings.json` file, so you never have to find and paste keys again.

## Notes & limitations | הערות

- Direct-from-browser API calls are convenient for personal/local use. If you publish a public instance, proxy the calls server-side so users' traffic doesn't expose keys in shared environments.
- Hand-drawn / watercolor styles use SVG filters; when pasting SVG into Microsoft Office the filter is dropped — use PNG or the editable PPTX export for those styles.
- Icon tooltips in the picker are currently in Hebrew; search matches both Hebrew labels and English icon names.
- Infographic layouts are RTL-oriented by design; LTR-language output renders correctly but flows right-to-left.

## Tech | טכנולוגיה

React + Vite + TypeScript. Rendering: deterministic SVG layout engine (the AI only fills a semantic JSON — `src/core/schema.ts`). RoughJS for sketch style, lucide for icons, opentype.js for outlined-text export, pptxgenjs for PowerPoint, mammoth for .docx import. Hebrew text: canvas-measured explicit positioning + bidi isolates + `textLength` for engine-independent rendering.

## License

MIT. Icons: [lucide](https://lucide.dev) (ISC). Font: [Heebo](https://fonts.google.com/specimen/Heebo) (OFL).
