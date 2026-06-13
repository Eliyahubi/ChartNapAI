import * as opentype from 'opentype.js';
import pptxgen from 'pptxgenjs';
import hebReg from '@fontsource/heebo/files/heebo-hebrew-400-normal.woff?url';
import hebBold from '@fontsource/heebo/files/heebo-hebrew-700-normal.woff?url';
import latReg from '@fontsource/heebo/files/heebo-latin-400-normal.woff?url';
import latBold from '@fontsource/heebo/files/heebo-latin-700-normal.woff?url';

/**
 * ייצוא: SVG בקווי מתאר (ברירת מחדל — מודבק נכון בכל תוכנה),
 * SVG עם טקסט חי, PNG, ו-PPTX.
 */

/* ---------- טעינת פונטים ל-outline ---------- */
type OTFont = { charToGlyph: (c: string) => { index: number; getPath: (x: number, y: number, s: number) => { toPathData: (d: number) => string } }; getAdvanceWidth: (c: string, s: number) => number };

let outlineFonts: { reg: OTFont[]; bold: OTFont[] } | null = null;

async function loadOutlineFonts() {
  if (outlineFonts) return outlineFonts;
  const load = async (url: string): Promise<OTFont> => {
    const buf = await (await fetch(url)).arrayBuffer();
    return opentype.parse(buf) as OTFont;
  };
  const [hr, hb, lr, lb] = await Promise.all([load(hebReg), load(hebBold), load(latReg), load(latBold)]);
  outlineFonts = { reg: [hr, lr], bold: [hb, lb] };
  return outlineFonts;
}

const SKIP_CHARS = /[\s‎‏⁦-⁩]/;

/**
 * המרת כל הטקסט ב-SVG לקווי מתאר.
 * המיקום נלקח מהרינדור החי של הדפדפן (getExtentOfChar) — כולל bidi,
 * textLength וכל היתר — כך שהתוצאה זהה פיקסל-פיקסל למה שרואים.
 */
export async function svgToOutlinedString(svgEl: SVGSVGElement): Promise<string> {
  const fonts = await loadOutlineFonts();
  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  const liveTexts = Array.from(svgEl.querySelectorAll('text'));
  const cloneTexts = Array.from(clone.querySelectorAll('text'));

  liveTexts.forEach((lt, idx) => {
    const ct = cloneTexts[idx];
    if (!ct) return;
    const size = parseFloat(lt.getAttribute('font-size') || '14');
    const weight = parseInt(lt.getAttribute('font-weight') || '400', 10);
    const fill = lt.getAttribute('fill') || '#000000';
    const fontArr = weight >= 600 ? fonts.bold : fonts.reg;
    const str = lt.textContent || '';

    let inner = '';
    let n = 0;
    try { n = lt.getNumberOfChars(); } catch { n = 0; }
    for (let i = 0; i < n; i++) {
      const ch = str[i];
      if (!ch || SKIP_CHARS.test(ch)) continue;
      let ext: { x: number; width: number };
      let baseY: number;
      try {
        ext = lt.getExtentOfChar(i);
        baseY = lt.getStartPositionOfChar(i).y;
      } catch { continue; }
      if (!isFinite(ext.x) || !isFinite(baseY)) continue;

      const font = fontArr.find((f) => f.charToGlyph(ch).index !== 0) ?? fontArr[0];
      const glyph = font.charToGlyph(ch);
      if (!glyph || glyph.index === 0) continue;
      const d = glyph.getPath(0, 0, size).toPathData(2);
      if (!d) continue;
      // התאמה אופקית לרוחב התא בפועל (כולל כיווץ textLength)
      const natAdv = font.getAdvanceWidth(ch, size);
      const sx = natAdv > 0 ? Math.max(0.5, Math.min(ext.width / natAdv, 1.06)) : 1;
      inner += `<path d="${d}" transform="translate(${ext.x.toFixed(2)} ${baseY.toFixed(2)}) scale(${sx.toFixed(4)} 1)" fill="${fill}"/>`;
    }

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.innerHTML = inner;
    ct.replaceWith(g);
  });

  return new XMLSerializer().serializeToString(clone);
}

/* ---------- SVG עם טקסט חי + פונט מוטמע ---------- */

let cachedFontCss: string | null = null;

async function getEmbeddedFontCss(): Promise<string> {
  if (cachedFontCss) return cachedFontCss;
  try {
    const cssRes = await fetch(
      'https://fonts.googleapis.com/css2?family=Heebo:wght@400;700;800&display=swap'
    );
    let css = await cssRes.text();
    const urls = [...css.matchAll(/url\((https:[^)]+)\)/g)].map((m) => m[1]);
    for (const url of urls) {
      const fontRes = await fetch(url);
      const buf = await fontRes.arrayBuffer();
      // קידוד בנתחים — spread על מערך גדול מפוצץ את ה-call stack
      const u = new Uint8Array(buf);
      let bin = '';
      for (let i = 0; i < u.length; i += 8192) {
        bin += String.fromCharCode.apply(null, Array.from(u.subarray(i, i + 8192)));
      }
      css = css.replace(url, `data:font/woff2;base64,${btoa(bin)}`);
    }
    cachedFontCss = css;
    return css;
  } catch {
    return '';
  }
}

export async function svgToString(svgEl: SVGSVGElement): Promise<string> {
  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const fontCss = await getEmbeddedFontCss();
  if (fontCss) {
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = fontCss;
    clone.insertBefore(style, clone.firstChild);
  }
  return new XMLSerializer().serializeToString(clone);
}

/* ---------- הורדות ---------- */

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** ברירת המחדל: קווי מתאר — מודבק נכון ב-PowerPoint, Word, Illustrator */
export async function downloadSvg(svgEl: SVGSVGElement, filename = 'infographic.svg') {
  const str = await svgToOutlinedString(svgEl);
  download(new Blob([str], { type: 'image/svg+xml;charset=utf-8' }), filename);
}

/** גרסה עם טקסט חי — לעריכה בכלי וקטור */
export async function downloadSvgLiveText(svgEl: SVGSVGElement, filename = 'infographic-text.svg') {
  const str = await svgToString(svgEl);
  download(new Blob([str], { type: 'image/svg+xml;charset=utf-8' }), filename);
}

async function svgToPngDataUrl(svgEl: SVGSVGElement, scale = 2): Promise<{ dataUrl: string; w: number; h: number }> {
  const str = await svgToString(svgEl);
  const svgBlob = new Blob([str], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('SVG load failed'));
    img.src = url;
  });
  const w = svgEl.viewBox.baseVal.width || svgEl.clientWidth;
  const h = svgEl.viewBox.baseVal.height || svgEl.clientHeight;
  const canvas = document.createElement('canvas');
  canvas.width = w * scale;
  canvas.height = h * scale;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(scale, scale);
  ctx.drawImage(img, 0, 0, w, h);
  URL.revokeObjectURL(url);
  return { dataUrl: canvas.toDataURL('image/png'), w, h };
}

export async function downloadPng(svgEl: SVGSVGElement, filename = 'infographic.png', scale = 2) {
  const { dataUrl } = await svgToPngDataUrl(svgEl, scale);
  const res = await fetch(dataUrl);
  download(await res.blob(), filename);
}

/* ---------- PNG ביחסי גובה-רוחב לרשתות חברתיות ---------- */

export type PngRatio = 'auto' | '1:1' | '9:16' | '16:9';

const RATIO_DIMS: Record<Exclude<PngRatio, 'auto'>, [number, number]> = {
  '1:1': [1080, 1080],
  '9:16': [1080, 1920],
  '16:9': [1920, 1080],
};

/**
 * ייצוא PNG בקנבס ביחס נתון: רקע בצבע ערכת הצבע,
 * האינפוגרפיקה ממורכזת ומוקטנת/מוגדלת להתאמה עם שוליים.
 */
export async function downloadPngRatio(svgEl: SVGSVGElement, ratio: PngRatio, filename?: string) {
  if (ratio === 'auto') {
    return downloadPng(svgEl, filename ?? 'infographic.png', 2);
  }
  const [W, H] = RATIO_DIMS[ratio];
  const str = await svgToString(svgEl);
  const svgBlob = new Blob([str], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('SVG load failed'));
    img.src = url;
  });
  const w = svgEl.viewBox.baseVal.width || svgEl.clientWidth;
  const h = svgEl.viewBox.baseVal.height || svgEl.clientHeight;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  // רקע תואם לערכת הצבע (templates מציבים style.background על ה-svg)
  ctx.fillStyle = svgEl.style.background || '#ffffff';
  ctx.fillRect(0, 0, W, H);

  const pad = 0.94; // שוליים של 6%
  const scale = Math.min((W * pad) / w, (H * pad) / h);
  const dw = w * scale;
  const dh = h * scale;
  ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
  URL.revokeObjectURL(url);

  const name = filename ?? `infographic-${ratio.replace(':', 'x')}.png`;
  canvas.toBlob((blob) => {
    if (blob) download(blob, name);
  }, 'image/png');
}

/* ---------- PPTX עריך: SVG ← צורות וטקסט נטיביים ---------- */

interface PptxCtx {
  slide: ReturnType<InstanceType<typeof pptxgen>['addSlide']>;
  k: number; // אינץ' לפיקסל
  offX: number;
  offY: number;
  defs: string; // ה-defs של ה-SVG (פילטרים, markers) לטובת raster
  svgW: number;
  svgH: number;
}

const hex = (c: string | null): string => {
  if (!c || c === 'none') return 'FFFFFF';
  if (c.startsWith('#')) return c.slice(1).toUpperCase();
  const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (m) return [m[1], m[2], m[3]].map((v) => (+v).toString(16).padStart(2, '0')).join('').toUpperCase();
  return '000000';
};

function rasterToImage(miniSvg: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([miniSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      c.getContext('2d')!.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/png'));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('raster failed')); };
    img.src = url;
  });
}

/** אלמנט בלי מקבילה נטיבית (קשתות, rough, wash) → תמונה במיקום מדויק */
async function emitRaster(el: SVGGraphicsElement, ctx: PptxCtx) {
  let b: DOMRect;
  try { b = el.getBBox(); } catch { return; }
  if (!b.width || !b.height) return;
  const pad = 18; // שוליים ל-stroke ולעיוות פילטרים
  const x = b.x - pad, y = b.y - pad, w = b.width + pad * 2, h = b.height + pad * 2;
  const mini = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${Math.ceil(w * 3)}" height="${Math.ceil(h * 3)}">${ctx.defs}${new XMLSerializer().serializeToString(el)}</svg>`;
  try {
    const data = await rasterToImage(mini);
    ctx.slide.addImage({ data, x: ctx.offX + x * ctx.k, y: ctx.offY + y * ctx.k, w: w * ctx.k, h: h * ctx.k });
  } catch { /* מדלגים על אלמנט בעייתי */ }
}

function emitText(el: SVGTextElement, ctx: PptxCtx) {
  const raw = (el.textContent || '').replace(/[‎‏⁦-⁩]/g, '');
  if (!raw.trim()) return;
  const cx = parseFloat(el.getAttribute('x') || '0');
  const yBase = parseFloat(el.getAttribute('y') || '0');
  const size = parseFloat(el.getAttribute('font-size') || '14');
  const weight = parseInt(el.getAttribute('font-weight') || '400', 10);
  const color = hex(el.getAttribute('fill'));
  let wPx = parseFloat(el.getAttribute('textLength') || '0');
  if (!wPx) { try { wPx = el.getComputedTextLength(); } catch { wPx = raw.length * size * 0.55; } }
  const boxW = wPx + size * 1.2;
  const boxH = size * 1.5;
  ctx.slide.addText(raw, {
    x: ctx.offX + (cx - boxW / 2) * ctx.k,
    y: ctx.offY + (yBase - size * 1.05) * ctx.k,
    w: boxW * ctx.k,
    h: boxH * ctx.k,
    fontSize: Math.round(size * ctx.k * 72 * 10) / 10,
    bold: weight >= 600,
    color,
    fontFace: 'Heebo',
    align: 'center',
    valign: 'middle',
    margin: 0,
    lang: 'he-IL',
  });
}

function lineDash(el: Element): 'solid' | 'dash' {
  return el.getAttribute('stroke-dasharray') ? 'dash' : 'solid';
}

async function emitElement(el: Element, ctx: PptxCtx): Promise<void> {
  const tag = el.tagName.toLowerCase();
  if (tag === 'defs' || tag === 'style') return;

  // חץ — קו נטיבי עם ראש חץ
  const arrowData = el.getAttribute('data-arrow');
  if (tag === 'g' && arrowData) {
    const [x1, y1, x2, y2] = arrowData.split(',').map(Number);
    const color = hex(el.getAttribute('data-color'));
    const wpt = (parseFloat(el.getAttribute('data-width') || '2.5')) * ctx.k * 72;
    ctx.slide.addShape('line', {
      x: ctx.offX + Math.min(x1, x2) * ctx.k,
      y: ctx.offY + Math.min(y1, y2) * ctx.k,
      w: Math.abs(x2 - x1) * ctx.k,
      h: Math.abs(y2 - y1) * ctx.k,
      flipH: x2 < x1,
      flipV: y2 < y1,
      line: { color, width: Math.max(wpt, 1), endArrowType: 'triangle' },
    });
    return;
  }

  if (tag === 'g') {
    // קבוצה בלי טקסט (צורת rough/wash) → תמונה אחת; אחרת — רקורסיה
    if (!el.querySelector('text')) {
      await emitRaster(el as SVGGraphicsElement, ctx);
      return;
    }
    for (const child of Array.from(el.children)) await emitElement(child, ctx);
    return;
  }

  if (tag === 'text') { emitText(el as SVGTextElement, ctx); return; }

  // אלמנט עם פילטר (צבעי מים) — אין מקבילה נטיבית
  if (el.hasAttribute('filter')) { await emitRaster(el as SVGGraphicsElement, ctx); return; }

  if (tag === 'rect') {
    const x = parseFloat(el.getAttribute('x') || '0');
    const y = parseFloat(el.getAttribute('y') || '0');
    const w = parseFloat(el.getAttribute('width') || '0');
    const h = parseFloat(el.getAttribute('height') || '0');
    // רקע מלא ← רקע שקף
    if (w >= ctx.svgW - 1 && h >= ctx.svgH - 1) {
      ctx.slide.background = { color: hex(el.getAttribute('fill')) };
      return;
    }
    const rx = parseFloat(el.getAttribute('rx') || '0');
    const fill = el.getAttribute('fill');
    const stroke = el.getAttribute('stroke');
    const fo = parseFloat(el.getAttribute('fill-opacity') || '1');
    ctx.slide.addShape(rx > 0 ? 'roundRect' : 'rect', {
      x: ctx.offX + x * ctx.k, y: ctx.offY + y * ctx.k, w: w * ctx.k, h: h * ctx.k,
      fill: fill && fill !== 'none' ? { color: hex(fill), transparency: Math.round((1 - fo) * 100) } : { color: 'FFFFFF', transparency: 100 },
      line: stroke && stroke !== 'none' ? { color: hex(stroke), width: Math.max((parseFloat(el.getAttribute('stroke-width') || '1.5')) * ctx.k * 72, 0.5) } : { color: 'FFFFFF', transparency: 100 },
      rectRadius: rx > 0 ? Math.min(rx * ctx.k, 0.2) : undefined,
    });
    return;
  }

  if (tag === 'circle') {
    const cx = parseFloat(el.getAttribute('cx') || '0');
    const cy = parseFloat(el.getAttribute('cy') || '0');
    const r = parseFloat(el.getAttribute('r') || '0');
    const fill = el.getAttribute('fill');
    const stroke = el.getAttribute('stroke');
    const fo = parseFloat(el.getAttribute('fill-opacity') || '1');
    ctx.slide.addShape('ellipse', {
      x: ctx.offX + (cx - r) * ctx.k, y: ctx.offY + (cy - r) * ctx.k, w: r * 2 * ctx.k, h: r * 2 * ctx.k,
      fill: fill && fill !== 'none' ? { color: hex(fill), transparency: Math.round((1 - fo) * 100) } : { color: 'FFFFFF', transparency: 100 },
      line: stroke && stroke !== 'none' ? { color: hex(stroke), width: Math.max((parseFloat(el.getAttribute('stroke-width') || '1.5')) * ctx.k * 72, 0.5) } : { color: 'FFFFFF', transparency: 100 },
    });
    return;
  }

  if (tag === 'line') {
    const x1 = parseFloat(el.getAttribute('x1') || '0');
    const y1 = parseFloat(el.getAttribute('y1') || '0');
    const x2 = parseFloat(el.getAttribute('x2') || '0');
    const y2 = parseFloat(el.getAttribute('y2') || '0');
    ctx.slide.addShape('line', {
      x: ctx.offX + Math.min(x1, x2) * ctx.k,
      y: ctx.offY + Math.min(y1, y2) * ctx.k,
      w: Math.abs(x2 - x1) * ctx.k,
      h: Math.abs(y2 - y1) * ctx.k,
      // הקו נמתח מהפינה העליונה-שמאלית; שיפוע הפוך דורש flip
      flipV: (x2 < x1) !== (y2 < y1),
      line: {
        color: hex(el.getAttribute('stroke')),
        width: Math.max((parseFloat(el.getAttribute('stroke-width') || '1.5')) * ctx.k * 72, 0.5),
        dashType: lineDash(el),
      },
    });
    return;
  }

  // אייקון (svg מקונן): getBBox מחזיר קואורדינטות פנימיות —
  // קוראים את המיקום מהמאפיינים ומרסטרים את האייקון עצמו
  if (tag === 'svg') {
    const x = parseFloat(el.getAttribute('x') || '0');
    const y = parseFloat(el.getAttribute('y') || '0');
    const w = parseFloat(el.getAttribute('width') || '24');
    const h = parseFloat(el.getAttribute('height') || '24');
    const clone = el.cloneNode(true) as SVGElement;
    clone.removeAttribute('x');
    clone.removeAttribute('y');
    clone.setAttribute('width', String(Math.ceil(w * 4)));
    clone.setAttribute('height', String(Math.ceil(h * 4)));
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    try {
      const data = await rasterToImage(new XMLSerializer().serializeToString(clone));
      ctx.slide.addImage({ data, x: ctx.offX + x * ctx.k, y: ctx.offY + y * ctx.k, w: w * ctx.k, h: h * ctx.k });
    } catch { /* מדלגים */ }
    return;
  }

  // פוליגונים, paths, קשתות — תמונה נקודתית
  await emitRaster(el as SVGGraphicsElement, ctx);
}

async function buildEditablePres(svgEl: SVGSVGElement): Promise<InstanceType<typeof pptxgen>> {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9'; // 10 x 5.625 אינץ'
  const slide = pres.addSlide();

  const svgW = svgEl.viewBox.baseVal.width || 960;
  const svgH = svgEl.viewBox.baseVal.height || 540;
  const ratio = svgW / svgH;
  let iw = 9.4, ih = iw / ratio;
  if (ih > 5.15) { ih = 5.15; iw = ih * ratio; }
  const k = iw / svgW;
  const offX = (10 - iw) / 2;
  const offY = (5.625 - ih) / 2;

  const defsEl = svgEl.querySelector('defs');
  const defs = defsEl ? new XMLSerializer().serializeToString(defsEl) : '';

  const ctx: PptxCtx = { slide, k, offX, offY, defs, svgW, svgH };
  for (const child of Array.from(svgEl.children)) {
    await emitElement(child, ctx);
  }
  return pres;
}

/** שקף PowerPoint עריך: טקסטים כתיבות טקסט, צורות כצורות */
export async function downloadPptx(svgEl: SVGSVGElement, filename = 'infographic.pptx') {
  const pres = await buildEditablePres(svgEl);
  await pres.writeFile({ fileName: filename });
}

/** לבדיקות: PPTX כ-base64 בלי הורדה */
export async function pptxToBase64(svgEl: SVGSVGElement): Promise<string> {
  const pres = await buildEditablePres(svgEl);
  return (await pres.write({ outputType: 'base64' })) as string;
}
