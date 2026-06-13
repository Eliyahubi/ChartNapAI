import { useEffect, useRef, useState } from 'react';
import type { VisualDoc, VisualType } from './core/schema';
import { VisualDocSchema, VISUAL_TYPES } from './core/schema';
import { classifyHeuristic } from './core/classify';
import { classifyWithClaude, classifyWithGemini, classifyWithOpenAI, classifyWithOllama } from './core/llm';
import { THEMES, themeByName, makeCustomTheme } from './core/themes';
import { Infographic } from './templates';
import { PaintContext, type PaintMode } from './templates/common';
import { downloadSvg, downloadSvgLiveText, downloadPptx, downloadPngRatio, type PngRatio } from './core/export';
import EditPanel from './components/EditPanel';
import VariantGallery from './components/VariantGallery';
import { I18nContext, makeI18n, UI_LANGS, type UiLang } from './core/i18n';

type Engine = 'demo' | 'manual' | 'gemini' | 'claude' | 'openai' | 'ollama';

const DEFAULT_CUSTOM = ['#0d7377', '#f29f05', '#7b2d8b', '#2d6a8b'];

/** מסמך ריק לבנייה ידנית — כותרת ושני פריטים למילוי */
const BLANK_DOC: VisualDoc = {
  type: 'list',
  title: '',
  items: [
    { title: '', body: '' },
    { title: '', body: '' },
  ],
};

const ENGINES: { id: Engine; label: string; needsKey: boolean; defaultModel: string; keyUrl?: string }[] = [
  { id: 'demo', label: '', needsKey: false, defaultModel: '' },
  { id: 'manual', label: '', needsKey: false, defaultModel: '' },
  { id: 'gemini', label: 'Google Gemini', needsKey: true, defaultModel: 'gemini-2.5-flash', keyUrl: 'https://aistudio.google.com/apikey' },
  { id: 'claude', label: 'Anthropic Claude', needsKey: true, defaultModel: 'claude-sonnet-4-6', keyUrl: 'https://console.anthropic.com/settings/keys' },
  { id: 'openai', label: 'OpenAI', needsKey: true, defaultModel: 'gpt-4o-mini', keyUrl: 'https://platform.openai.com/api-keys' },
  { id: 'ollama', label: 'Ollama', needsKey: false, defaultModel: 'gemma3:latest' },
];

const OUT_LANGS = ['עברית', 'English', 'العربية', 'Русский', 'Français', 'Español'];

export default function App() {
  const [uiLang, setUiLang] = useState<UiLang>(() => (localStorage.getItem('ui_lang') as UiLang) ?? 'he');
  const i18n = makeI18n(uiLang);
  const { t } = i18n;

  const [text, setText] = useState('');
  const [doc, setDoc] = useState<VisualDoc | null>(null);
  const [typeOverride, setTypeOverride] = useState<VisualType | 'auto'>('auto');
  const [themeName, setThemeName] = useState(() => localStorage.getItem('theme') ?? THEMES[0].name);
  const [customBg, setCustomBg] = useState(() => localStorage.getItem('custom_bg') ?? '#ffffff');
  const [customPalette, setCustomPalette] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('custom_palette') ?? '') as string[]; } catch { return DEFAULT_CUSTOM; }
  });
  const [paint, setPaint] = useState<PaintMode>(() => (localStorage.getItem('paint') as PaintMode) ?? 'clean');
  const [lang, setLang] = useState(() => localStorage.getItem('lang') ?? 'auto');
  const [engine, setEngine] = useState<Engine>(() => {
    const e = localStorage.getItem('engine') as Engine;
    return ENGINES.some((x) => x.id === e) ? e : 'demo';
  });
  const [keys, setKeys] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem('api_keys') ?? '{}'); } catch { return {}; }
  });
  const [models, setModels] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem('api_models') ?? '{}'); } catch { return {}; }
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [pngRatio, setPngRatio] = useState<PngRatio>('auto');
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const settingsInputRef = useRef<HTMLInputElement>(null);

  // כיוון ושפת המסמך לפי שפת הממשק
  useEffect(() => {
    document.documentElement.dir = i18n.dir;
    document.documentElement.lang = uiLang;
    localStorage.setItem('ui_lang', uiLang);
  }, [uiLang, i18n.dir]);

  const theme = themeName === 'custom' ? makeCustomTheme(customBg, customPalette) : themeByName(themeName);
  const currentType: VisualType | null = doc ? (typeOverride === 'auto' ? doc.type : typeOverride) : null;
  const engineDef = ENGINES.find((e) => e.id === engine)!;
  const curKey = keys[engine] ?? '';
  const curModel = models[engine] || engineDef.defaultModel;

  function setKey(v: string) {
    const next = { ...keys, [engine]: v };
    setKeys(next);
    localStorage.setItem('api_keys', JSON.stringify(next));
  }

  function setModel(v: string) {
    const next = { ...models, [engine]: v };
    setModels(next);
    localStorage.setItem('api_models', JSON.stringify(next));
  }

  function pickTheme(name: string) {
    setThemeName(name);
    localStorage.setItem('theme', name);
  }

  function setCustomColor(i: number, color: string) {
    const next = customPalette.map((c, j) => (j === i ? color : c));
    setCustomPalette(next);
    localStorage.setItem('custom_palette', JSON.stringify(next));
  }

  async function generate() {
    setError('');
    localStorage.setItem('engine', engine);
    // הדבקת JSON מובנה (מ-LLM חיצוני) — שימוש ישיר במבנה המדויק, בלי ניתוח
    const pasted = tryParseDoc(text);
    if (pasted) {
      setDoc(pasted);
      setTypeOverride('auto');
      setNotice(t('jsonLoaded'));
      setTimeout(() => setNotice(''), 4000);
      return;
    }
    // בנייה ידנית: פותחים מסמך ריק ישר לעריכה — בלי טקסט ובלי מודל
    if (engine === 'manual') {
      setDoc(JSON.parse(JSON.stringify(BLANK_DOC)) as VisualDoc);
      setTypeOverride('auto');
      return;
    }
    setBusy(true);
    try {
      if (engineDef.needsKey && !curKey.trim()) throw new Error(t('keyMissing'));
      if (engine === 'gemini') {
        setDoc(await classifyWithGemini(text, curKey.trim(), lang, curModel));
      } else if (engine === 'claude') {
        setDoc(await classifyWithClaude(text, curKey.trim(), lang, curModel));
      } else if (engine === 'openai') {
        setDoc(await classifyWithOpenAI(text, curKey.trim(), lang, curModel));
      } else if (engine === 'ollama') {
        setDoc(await classifyWithOllama(text, curModel, lang));
      } else {
        setDoc(classifyHeuristic(text));
      }
      setTypeOverride('auto');
    } catch (e) {
      setError(`${t('error')}: ${(e as Error).message} — ${t('fallbackDemo')}`);
      setDoc(classifyHeuristic(text));
    } finally {
      setBusy(false);
    }
  }

  /** חילוץ טקסט מקובץ — docx, pdf, xlsx, וכל קובץ טקסט (txt/md/json/csv) */
  async function handleFile(file: File) {
    setError('');
    setBusy(true);
    try {
      const name = file.name.toLowerCase();
      const ext = name.slice(name.lastIndexOf('.') + 1);

      if (ext === 'docx') {
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
        setText(result.value ?? '');
      } else if (ext === 'pdf') {
        const pdfjs = await import('pdfjs-dist');
        const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
        const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
        let out = '';
        for (let p = 1; p <= pdf.numPages; p++) {
          const page = await pdf.getPage(p);
          const tc = await page.getTextContent();
          out += tc.items.map((it) => ('str' in it ? (it as { str: string }).str : '')).join(' ') + '\n';
        }
        setText(out.trim());
      } else if (ext === 'xlsx' || ext === 'xls' || ext === 'xlsm') {
        const XLSX = await import('xlsx');
        const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
        const parts = wb.SheetNames.map((sn) => XLSX.utils.sheet_to_csv(wb.Sheets[sn]));
        setText(parts.join('\n').trim());
      } else if (['txt', 'md', 'markdown', 'json', 'csv', 'tsv', 'log', 'rtf', 'html', 'htm'].includes(ext)) {
        setText((await file.text()).trim());
      } else {
        // ניסיון אחרון: לקרוא כטקסט גולמי
        const raw = (await file.text()).trim();
        if (!raw) throw new Error(t('unsupported'));
        setText(raw);
      }
    } catch (e) {
      setError(`${t('fileFail')}: ${(e as Error).message}`);
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  /** אם המשתמש הדביק JSON תקין של מבנה אינפוגרפיקה — מחזיר אותו ישירות */
  function tryParseDoc(raw: string): VisualDoc | null {
    let s = raw.trim();
    if (!s) return null;
    s = s.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    if (!s.startsWith('{')) return null;
    try {
      const parsed = VisualDocSchema.safeParse(JSON.parse(s));
      return parsed.success ? parsed.data : null;
    } catch {
      return null;
    }
  }

  /** פרומפט מובנה ל-LLM חיצוני — מחזיר JSON שהדבקתו בתיבה תיתן את המבנה המדויק */
  function buildPrompt(): string {
    const types = VISUAL_TYPES.join(', ');
    return [
      'אתה ממיר תוכן לאינפוגרפיקה. נתח את התוכן שאספק בסוף, וֶהחזר אובייקט JSON יחיד בלבד — בלי טקסט נוסף, בלי הסברים, בלי גדרות ‏```‏.',
      '',
      'מבנה ה-JSON הנדרש:',
      '{',
      `  "type": <אחד מאלה: ${types}>,`,
      '  "title": "כותרת ראשית קצרה (עד 80 תווים)",',
      '  "items": [',
      '    { "title": "כותרת פריט (2-5 מילים)", "body": "משפט הסבר קצר (לא חובה)", "label": "שנה — לציר זמן בלבד", "side": "a או b — להשוואה בלבד" }',
      '  ],',
      '  "sideLabels": ["כותרת צד ימין", "כותרת צד שמאל"]   // רק עבור type=comparison',
      '}',
      '',
      'כללים:',
      '- בחר את ה-type המתאים ביותר לתוכן (תהליך=flow, השוואה=comparison, מחזור=cycle, פירמידה=pyramid, ציר זמן=timeline, ציר זמן אנכי=vtimeline, משפך=funnel, מטריצת SWOT=matrix, מפת חשיבה=mindmap, היררכיה/ארגוני=tree, מטרה=target, מדרגות=steps/stairs3d, צמיחה=mountain, רצף מתפתל=snake, חלוקה לחלקים=sector, מעגל=ring, מפת דרכים=roadmap, חיצי שברון=chevron, כרטיסים=cards, רשימה=list).',
      '- בין 2 ל-8 פריטים.',
      '- "body" תמציתי (עד ~160 תווים). השמט "label"/"side"/"sideLabels" אם לא רלוונטיים.',
      '- כתוב באותה שפה של התוכן.',
      '- החזר JSON תקין בלבד.',
      '',
      'התוכן לניתוח:',
      '"""',
      '<<< הדבק כאן את הטקסט/התוכן שלך >>>',
      '"""',
    ].join('\n');
  }

  async function copyPrompt() {
    setError('');
    setNotice('');
    try {
      await navigator.clipboard.writeText(buildPrompt());
      setNotice(t('promptCopied'));
      setTimeout(() => setNotice(''), 5000);
    } catch {
      setError(t('promptCopyFail'));
    }
  }

  function getSvg(): SVGSVGElement | null {
    return svgWrapRef.current?.querySelector('svg') ?? null;
  }

  /** איפוס מלא של התוכן — בלי לגעת במפתחות ובהעדפות */
  function resetAll() {
    setDoc(null);
    setText('');
    setTypeOverride('auto');
    setError('');
    setNotice('');
  }

  /* ---------- ייצוא/ייבוא הגדרות (מפתחות והעדפות) לקובץ ---------- */
  const SETTINGS_KEYS = ['api_keys', 'api_models', 'engine', 'lang', 'ui_lang', 'theme', 'custom_bg', 'custom_palette', 'paint'];

  function exportSettings() {
    const data: Record<string, string | null> = { _app: 'ChartNap AI' };
    for (const k of SETTINGS_KEYS) data[k] = localStorage.getItem(k);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chartnap-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importSettings(file: File) {
    setError('');
    setNotice('');
    try {
      const data = JSON.parse(await file.text()) as Record<string, string | null>;
      if (data._app !== 'ChartNap AI') throw new Error(t('importBad'));
      for (const k of SETTINGS_KEYS) {
        if (typeof data[k] === 'string') localStorage.setItem(k, data[k] as string);
      }
      setNotice(t('importOk'));
      setTimeout(() => window.location.reload(), 600);
    } catch {
      setError(t('importBad'));
    } finally {
      if (settingsInputRef.current) settingsInputRef.current.value = '';
    }
  }

  return (
    <I18nContext.Provider value={i18n}>
      <div className="app">
        <header>
          <div className="header-row">
            <h1>📊 ChartNap AI</h1>
            <select
              className="ui-lang-select"
              value={uiLang}
              title={t('uiLang')}
              onChange={(e) => setUiLang(e.target.value as UiLang)}
            >
              {UI_LANGS.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>
          <p className="tag">{t('tagline')}</p>
        </header>

        <main>
          <section className="panel input-panel">
            <label className="lbl">{t('yourText')}</label>
            <textarea
              dir="auto"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={7}
              placeholder={t('placeholder')}
            />

            <div className="row">
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx,.pdf,.xlsx,.xls,.xlsm,.txt,.md,.markdown,.json,.csv,.tsv,.log,.rtf,.html,.htm"
                style={{ display: 'none' }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
              <button onClick={() => fileInputRef.current?.click()} disabled={busy}>
                {t('upload')}
              </button>
              <button className="mini" onClick={copyPrompt} title={t('copyPromptHint')}>
                {t('copyPrompt')}
              </button>
            </div>
            <p className="hint">{t('copyPromptHint')}</p>

            <div className="row">
              <label className="lbl">{t('outLang')}</label>
              <select
                className="lang-select"
                value={lang}
                onChange={(e) => { setLang(e.target.value); localStorage.setItem('lang', e.target.value); }}
              >
                <option value="auto">{t('sameAsInput')}</option>
                {OUT_LANGS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div className="row">
              <label className="lbl">{t('engine')}</label>
              <select
                className="lang-select"
                value={engine}
                onChange={(e) => setEngine(e.target.value as Engine)}
              >
                {ENGINES.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.id === 'demo' ? t('demo') : e.id === 'manual' ? t('manual') : e.label}
                  </option>
                ))}
              </select>
            </div>

            {engineDef.needsKey && (
              <input
                className="key-input"
                type="password"
                dir="ltr"
                placeholder={`${t('apiKey')} (${engineDef.label})`}
                value={curKey}
                onChange={(e) => setKey(e.target.value)}
              />
            )}
            {engine !== 'demo' && engine !== 'manual' && (
              <input
                className="key-input"
                dir="ltr"
                placeholder={`${t('model')} — ${engineDef.defaultModel}`}
                value={models[engine] ?? ''}
                onChange={(e) => setModel(e.target.value)}
              />
            )}
            {engineDef.keyUrl && (
              <p className="hint">
                <a href={engineDef.keyUrl} target="_blank" rel="noreferrer">{engineDef.keyUrl}</a>
              </p>
            )}
            {engine === 'demo' && <p className="hint">{t('demoHint')}</p>}
            {engine === 'manual' && <p className="hint">{t('manualHint')}</p>}

            <button
              className="primary"
              onClick={generate}
              disabled={busy || (engine !== 'manual' && text.trim().length < 20)}
            >
              {busy ? t('analyzing') : engine === 'manual' ? t('startManual') : t('generate')}
            </button>
            {error && <p className="error">{error}</p>}
            {notice && <p className="hint">{notice}</p>}

            <div className="settings-row">
              <input
                ref={settingsInputRef}
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) importSettings(f); }}
              />
              <button className="mini" onClick={exportSettings}>{t('exportSettings')}</button>
              <button className="mini" onClick={() => settingsInputRef.current?.click()}>{t('importSettings')}</button>
            </div>
            <p className="hint">{t('settingsNote')}</p>

            {doc && <EditPanel doc={doc} onChange={setDoc} />}
          </section>

          <section className="panel result-panel">
            {doc && currentType ? (
              <PaintContext.Provider value={paint}>
                <VariantGallery
                  doc={doc}
                  theme={theme}
                  rough={paint === 'rough'}
                  current={currentType}
                  onPick={(tp) => setTypeOverride(tp)}
                />
                <div className="controls">
                  <label>
                    {t('theme')}
                    <select value={themeName} onChange={(e) => pickTheme(e.target.value)}>
                      {THEMES.map((th) => (
                        <option key={th.name} value={th.name}>{i18n.themeLabel(th.name)}</option>
                      ))}
                      <option value="custom">{t('customTheme')}</option>
                    </select>
                  </label>
                  {themeName === 'custom' && (
                    <span className="custom-pickers">
                      <label title={t('bg')}>
                        {t('bg')}
                        <input type="color" value={customBg} onChange={(e) => { setCustomBg(e.target.value); localStorage.setItem('custom_bg', e.target.value); }} />
                      </label>
                      {customPalette.map((c, i) => (
                        <input key={i} type="color" value={c} onChange={(e) => setCustomColor(i, e.target.value)} />
                      ))}
                    </span>
                  )}
                  <label>
                    {t('style')}
                    <select value={paint} onChange={(e) => { setPaint(e.target.value as PaintMode); localStorage.setItem('paint', e.target.value); }}>
                      <option value="clean">{t('clean')}</option>
                      <option value="rough">{t('rough')}</option>
                      <option value="wash">{t('wash')}</option>
                    </select>
                  </label>
                  <button className="reset-btn" onClick={resetAll}>{t('reset')}</button>
                  <div className="spacer" />
                  <button onClick={() => { const s = getSvg(); if (s) downloadSvg(s); }} title={t('svgOutlineHint')}>⬇ SVG</button>
                  <button onClick={() => { const s = getSvg(); if (s) downloadSvgLiveText(s); }} title={t('svgEditableHint')}>{t('svgEditable')}</button>
                  <label>
                    {t('imgSize')}
                    <select value={pngRatio} onChange={(e) => setPngRatio(e.target.value as PngRatio)}>
                      <option value="auto">{t('sizeAuto')}</option>
                      <option value="1:1">1:1</option>
                      <option value="9:16">9:16</option>
                      <option value="16:9">16:9</option>
                    </select>
                  </label>
                  <button onClick={() => { const s = getSvg(); if (s) downloadPngRatio(s, pngRatio); }}>⬇ PNG</button>
                  <button onClick={() => { const s = getSvg(); if (s) downloadPptx(s); }}>⬇ PPTX</button>
                </div>
                <div className="canvas" ref={svgWrapRef}>
                  <Infographic doc={doc} theme={theme} rough={paint === 'rough'} typeOverride={typeOverride} />
                </div>
              </PaintContext.Provider>
            ) : (
              <div className="empty">
                <p>{t('emptyTitle')}</p>
                <p className="hint">{t('emptyHint')}</p>
              </div>
            )}
          </section>
        </main>

        <footer className="site-footer">
          {t('builtBy')} ·{' '}
          <a href="https://elbitlaw.com" target="_blank" rel="noreferrer">elbitlaw.com</a>
        </footer>
      </div>
    </I18nContext.Provider>
  );
}
