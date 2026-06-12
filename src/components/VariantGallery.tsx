import { useState } from 'react';
import type { VisualDoc, VisualType } from '../core/schema';
import { VISUAL_TYPES } from '../core/schema';
import type { Theme } from '../core/themes';
import { Infographic } from '../templates';
import { useI18n } from '../core/i18n';

/**
 * בורר תבניות קומפקטי: שורת סיכום + רשת תבניות נפתחת.
 * סגור כברירת מחדל; בפתיחה הרשת עוטפת ונסגרת אוטומטית אחרי בחירה.
 */
export default function VariantGallery({
  doc,
  theme,
  rough,
  current,
  onPick,
}: {
  doc: VisualDoc;
  theme: Theme;
  rough: boolean;
  current: VisualType;
  onPick: (t: VisualType) => void;
}) {
  const [open, setOpen] = useState(false);
  const { t, typeLabel } = useI18n();

  return (
    <div className="variant-picker">
      <div className="variant-bar">
        <span className="variant-current">
          {t('template')}: <b>{typeLabel(current)}</b>
          {current === doc.type && <span className="variant-star"> ★</span>}
        </span>
        {current !== doc.type && (
          <button className="variant-reco" onClick={() => onPick(doc.type)}>
            ★ {t('recommended')}: {typeLabel(doc.type)}
          </button>
        )}
        <div className="spacer" />
        <button className="variant-toggle" onClick={() => setOpen(!open)}>
          {open ? t('close') : t('change')}
        </button>
      </div>

      {open && (
        <div className="thumb-grid">
          {VISUAL_TYPES.map((tp) => (
            <button
              key={tp}
              className={`thumb ${tp === current ? 'active' : ''}`}
              onClick={() => {
                onPick(tp);
                setOpen(false);
              }}
              title={typeLabel(tp)}
            >
              <div className="thumb-canvas">
                <Infographic doc={doc} theme={theme} rough={rough} typeOverride={tp} />
              </div>
              <span className="thumb-label">
                {typeLabel(tp)}
                {tp === doc.type ? ' ★' : ''}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
