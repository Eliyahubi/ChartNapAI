import { useState } from 'react';
import type { VisualDoc, VisualItem } from '../core/schema';
import { ICONS, ICON_NAMES, CATEGORIES } from '../core/icons';
import { useI18n } from '../core/i18n';

/**
 * לוח בחירת אייקונים: כפתור עם האייקון הנוכחי; לחיצה פותחת לוח
 * עם חיפוש וכל המאגר מחולק לקטגוריות.
 */
function IconPicker({ value, onChange }: { value?: string; onChange: (v?: string) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const { t, catLabel } = useI18n();
  const cur = value && ICONS[value] ? ICONS[value] : null;
  const Cur = cur?.C;

  const query = q.trim();
  const matches = (n: string) =>
    !query || ICONS[n].he.includes(query) || n.includes(query.toLowerCase());

  function pick(v?: string) {
    onChange(v);
    setOpen(false);
    setQ('');
  }

  return (
    <div className="icon-picker">
      <button
        className={`icon-picker-btn ${cur ? 'has-icon' : ''}`}
        title={cur ? cur.he : t('pickIcon')}
        onClick={() => setOpen(!open)}
      >
        {Cur ? <Cur size={15} /> : <span className="icon-empty">◌</span>}
      </button>
      {open && (
        <div className="icon-pop">
          <div className="icon-pop-head">
            <input
              className="icon-search"
              dir="auto"
              autoFocus
              placeholder={t('searchIcon')}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="icon-none" onClick={() => pick(undefined)}>
              {t('noIcon')}
            </button>
          </div>
          <div className="icon-pop-body">
            {CATEGORIES.map((cat, ci) => {
              const names = ICON_NAMES.filter((n) => ICONS[n].cat === cat && matches(n));
              if (!names.length) return null;
              return (
                <div key={cat}>
                  <div className="icon-cat">{catLabel(ci)}</div>
                  <div className="icon-grid">
                    {names.map((n) => {
                      const C = ICONS[n].C;
                      return (
                        <button
                          key={n}
                          className={`icon-cell ${value === n ? 'sel' : ''}`}
                          title={ICONS[n].he}
                          onClick={() => pick(n)}
                        >
                          <C size={15} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * פאנל עריכת תוכן: עריכה חיה של ה-VisualDoc אחרי הניתוח.
 * כל שינוי מתרנדר מיידית ב-SVG — הציור נשאר דטרמיניסטי.
 */
export default function EditPanel({
  doc,
  onChange,
}: {
  doc: VisualDoc;
  onChange: (doc: VisualDoc) => void;
}) {
  const { t } = useI18n();
  const isComparison = doc.type === 'comparison';
  const isTimeline = doc.type === 'timeline' || doc.type === 'chevron' || doc.type === 'vtimeline';

  function setItem(i: number, patch: Partial<VisualItem>) {
    const items = doc.items.map((it, j) => (j === i ? { ...it, ...patch } : it));
    onChange({ ...doc, items });
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= doc.items.length) return;
    const items = [...doc.items];
    [items[i], items[j]] = [items[j], items[i]];
    onChange({ ...doc, items });
  }

  function remove(i: number) {
    if (doc.items.length <= 2) return; // מינימום 2 פריטים
    onChange({ ...doc, items: doc.items.filter((_, j) => j !== i) });
  }

  function add() {
    if (doc.items.length >= 8) return;
    const item: VisualItem = { title: '—', body: '' };
    if (isComparison) item.side = 'a';
    onChange({ ...doc, items: [...doc.items, item] });
  }

  return (
    <div className="edit-panel">
      <label className="lbl">{t('editContent')}</label>

      <input
        className="edit-input edit-title"
        dir="auto"
        value={doc.title ?? ''}
        placeholder={t('mainTitlePh')}
        onChange={(e) => onChange({ ...doc, title: e.target.value })}
      />

      {isComparison && (
        <div className="edit-sides">
          <input
            className="edit-input"
            dir="auto"
            value={doc.sideLabels?.[0] ?? ''}
            placeholder={t('sideAPh')}
            onChange={(e) => onChange({ ...doc, sideLabels: [e.target.value, doc.sideLabels?.[1] ?? ''] })}
          />
          <input
            className="edit-input"
            dir="auto"
            value={doc.sideLabels?.[1] ?? ''}
            placeholder={t('sideBPh')}
            onChange={(e) => onChange({ ...doc, sideLabels: [doc.sideLabels?.[0] ?? '', e.target.value] })}
          />
        </div>
      )}

      {doc.items.map((it, i) => (
        <div className="edit-item" key={i}>
          <div className="edit-item-head">
            <span className="edit-item-num">{i + 1}</span>
            {isComparison && (
              <select
                className="edit-side-select"
                value={it.side ?? 'a'}
                onChange={(e) => setItem(i, { side: e.target.value as 'a' | 'b' })}
              >
                <option value="a">{t('sideRight')}</option>
                <option value="b">{t('sideLeft')}</option>
              </select>
            )}
            {isTimeline && (
              <input
                className="edit-input edit-label"
                dir="auto"
                value={it.label ?? ''}
                placeholder={t('yearPh')}
                onChange={(e) => setItem(i, { label: e.target.value })}
              />
            )}
            <IconPicker value={it.icon} onChange={(v) => setItem(i, { icon: v })} />
            <div className="edit-item-actions">
              <button title={t('up')} onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
              <button title={t('down')} onClick={() => move(i, 1)} disabled={i === doc.items.length - 1}>↓</button>
              <button title={t('del')} onClick={() => remove(i)} disabled={doc.items.length <= 2}>✕</button>
            </div>
          </div>
          <input
            className="edit-input"
            dir="auto"
            value={it.title}
            placeholder={t('itemTitlePh')}
            onChange={(e) => setItem(i, { title: e.target.value })}
          />
          <textarea
            className="edit-input edit-body"
            dir="auto"
            value={it.body ?? ''}
            rows={2}
            placeholder={t('itemBodyPh')}
            onChange={(e) => setItem(i, { body: e.target.value })}
          />
        </div>
      ))}

      <button className="edit-add" onClick={add} disabled={doc.items.length >= 8}>
        {t('addItem')}
      </button>
    </div>
  );
}
