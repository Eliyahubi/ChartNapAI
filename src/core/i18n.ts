import { createContext, useContext } from 'react';
import type { VisualType } from './schema';

/** שפות ממשק נתמכות */
export const UI_LANGS = [
  { code: 'he', label: 'עברית', dir: 'rtl' },
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'ru', label: 'Русский', dir: 'ltr' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'es', label: 'Español', dir: 'ltr' },
] as const;

export type UiLang = (typeof UI_LANGS)[number]['code'];

type Dict = Record<string, string>;

const he: Dict = {
  builtBy: 'נבנה על ידי אליהו ביטון', manual: 'בנייה ידנית (בלי AI)', startManual: '🛠 התחל בנייה ידנית', manualHint: 'בנייה ידנית: נפתחת תבנית ריקה — מלאו כותרת ופריטים בפאנל העריכה, בלי צורך בטקסט או במפתח.',
  reset: '🔄 התחלה מחדש', imgSize: 'יחס', sizeAuto: 'מקורי',
  exportSettings: '⬇ שמירת הגדרות לקובץ', importSettings: '⬆ טעינת הגדרות מקובץ', importOk: 'ההגדרות נטענו', importBad: 'קובץ הגדרות לא תקין', settingsNote: 'שומר את המפתחות וההעדפות לקובץ — לגיבוי או למחשב אחר.',
  tagline: 'טקסט נכנס — אינפוגרפיקה יוצאת',
  yourText: 'הטקסט שלך', placeholder: 'הכניסו כאן טקסט — פסקה, רעיון או תוכן שתרצו להפוך לאינפוגרפיקה...',
  upload: '📎 העלאת קובץ (Word · PDF · Excel · txt · md · json)', outLang: 'שפת הפלט', sameAsInput: 'כמו שפת הקלט', uiLang: 'שפת ממשק',
  copyPrompt: '📋 העתק פרומפט ל-AI', copyPromptHint: 'אין מפתח API? לחצו "העתק פרומפט", הדביקו בצ׳אט (ChatGPT/Claude/Gemini) יחד עם התוכן שלכם, והדביקו בתיבה את ה-JSON שיחזור — תקבלו את המבנה המדויק.',
  promptCopied: '✓ הפרומפט הועתק — הדביקו בצ׳אט יחד עם התוכן שלכם', promptCopyFail: 'העתקה ללוח נכשלה', jsonLoaded: '✓ מבנה JSON נטען', fileFail: 'חילוץ הקובץ נכשל',
  svgEditable: '⬇ SVG (טקסט)', svgOutlineHint: 'SVG בקווי מתאר — נראה זהה בכל תוכנה, אך הטקסט אינו ניתן לעריכה.', svgEditableHint: 'SVG שבו הטקסט נשאר ניתן לעריכה (לכלי וקטור כמו Illustrator/Inkscape). לטקסט עריך ב-PowerPoint — השתמשו בכפתור PPTX, שמייצא כתיבות טקסט נטיביות.',
  engine: 'מנוע ניתוח', demo: 'דמו (בלי AI)', demoHint: 'מצב דמו: זיהוי לפי מילות מפתח — מהיר אבל שטחי. לניתוח אמיתי בחרו מנוע AI והכניסו מפתח API.',
  apiKey: 'מפתח API', model: 'שם מודל', generate: '✨ צור אינפוגרפיקה', analyzing: 'מנתח...',
  error: 'שגיאה', fallbackDemo: 'עברתי למצב דמו',
  editContent: 'עריכת תוכן', mainTitlePh: 'כותרת ראשית', itemTitlePh: 'כותרת הפריט', itemBodyPh: 'טקסט הסבר (לא חובה)',
  addItem: '+ הוסף פריט', sideRight: 'צד ימין', sideLeft: 'צד שמאל', yearPh: 'שנה',
  sideAPh: 'כותרת צד ימין', sideBPh: 'כותרת צד שמאל',
  template: 'תבנית', recommended: 'מומלץ', change: '🎛 החלף תבנית', close: '✕ סגור',
  theme: 'ערכת צבע', customTheme: 'מותאם אישית', bg: 'רקע',
  style: 'סגנון', clean: 'נקי', rough: 'מצויר ביד', wash: 'צבעי מים',
  emptyTitle: '✍️ כתבו טקסט, הדביקו פסקה או העלו docx',
  emptyHint: 'המערכת תזהה לבד את המבנה — תהליך, השוואה, מחזור, היררכיה ועוד — ותציג את כל הווריאציות לבחירה.',
  pickIcon: 'בחר אייקון', noIcon: '✕ בלי אייקון', searchIcon: 'חיפוש אייקון...',
  docxFail: 'חילוץ docx נכשל', unsupported: 'פורמט לא נתמך — docx בלבד',
  up: 'העלה', down: 'הורד', del: 'מחק', keyMissing: 'הכניסו מפתח API',
};

const en: Dict = {
  builtBy: 'Built by Eliyahu Biton', manual: 'Manual build (no AI)', startManual: '🛠 Start manual build', manualHint: 'Manual mode: opens a blank template — fill in the title and items in the edit panel, no text or key needed.',
  reset: '🔄 Start over', imgSize: 'Ratio', sizeAuto: 'Original',
  exportSettings: '⬇ Save settings to file', importSettings: '⬆ Load settings from file', importOk: 'Settings loaded', importBad: 'Invalid settings file', settingsNote: 'Saves your keys and preferences to a file — for backup or another computer.',
  tagline: 'Text in — infographic out',
  yourText: 'Your text', placeholder: 'Paste or type a paragraph, idea, or any content to turn into an infographic...',
  upload: '📎 Upload file (Word · PDF · Excel · txt · md · json)', outLang: 'Output language', sameAsInput: 'Same as input', uiLang: 'UI language',
  copyPrompt: '📋 Copy AI prompt', copyPromptHint: 'No API key? Click "Copy AI prompt", paste it into a chat (ChatGPT/Claude/Gemini) with your content, then paste the returned JSON into the text box — you get the exact structure.',
  promptCopied: '✓ Prompt copied — paste it into a chat with your content', promptCopyFail: 'Clipboard copy failed', jsonLoaded: '✓ JSON structure loaded', fileFail: 'File extraction failed',
  svgEditable: '⬇ SVG (text)', svgOutlineHint: 'Outlined SVG — looks identical everywhere, but text is not editable.', svgEditableHint: 'SVG keeping editable text (for vector tools like Illustrator/Inkscape). For editable text in PowerPoint use the PPTX button, which exports native text boxes.',
  engine: 'AI engine', demo: 'Demo (no AI)', demoHint: 'Demo mode: keyword-based detection — fast but shallow. For real analysis pick an AI engine and enter your API key.',
  apiKey: 'API key', model: 'Model name', generate: '✨ Create infographic', analyzing: 'Analyzing...',
  error: 'Error', fallbackDemo: 'fell back to demo mode',
  editContent: 'Edit content', mainTitlePh: 'Main title', itemTitlePh: 'Item title', itemBodyPh: 'Description (optional)',
  addItem: '+ Add item', sideRight: 'Right side', sideLeft: 'Left side', yearPh: 'Year',
  sideAPh: 'Right side label', sideBPh: 'Left side label',
  template: 'Template', recommended: 'Recommended', change: '🎛 Change template', close: '✕ Close',
  theme: 'Color theme', customTheme: 'Custom', bg: 'BG',
  style: 'Style', clean: 'Clean', rough: 'Hand-drawn', wash: 'Watercolor',
  emptyTitle: '✍️ Type, paste a paragraph, or upload a docx',
  emptyHint: 'The structure is detected automatically — process, comparison, cycle, hierarchy and more — with all variants to pick from.',
  pickIcon: 'Pick icon', noIcon: '✕ No icon', searchIcon: 'Search icons...',
  docxFail: 'docx extraction failed', unsupported: 'Unsupported format — docx only',
  up: 'Move up', down: 'Move down', del: 'Delete', keyMissing: 'Enter an API key',
};

const ar: Dict = {
  builtBy: 'بُني بواسطة إلياهو بيتون', manual: 'بناء يدوي (بدون AI)', startManual: '🛠 ابدأ البناء اليدوي', manualHint: 'الوضع اليدوي: يفتح قالباً فارغاً — املأ العنوان والعناصر في لوحة التحرير، دون نص أو مفتاح.',
  reset: '🔄 البدء من جديد', imgSize: 'نسبة', sizeAuto: 'أصلي',
  exportSettings: '⬇ حفظ الإعدادات إلى ملف', importSettings: '⬆ تحميل الإعدادات من ملف', importOk: 'تم تحميل الإعدادات', importBad: 'ملف إعدادات غير صالح', settingsNote: 'يحفظ مفاتيحك وتفضيلاتك إلى ملف — للنسخ الاحتياطي أو لجهاز آخر.',
  tagline: 'نص يدخل — إنفوجرافيك يخرج',
  yourText: 'النص الخاص بك', placeholder: 'أدخل هنا نصاً — فقرة أو فكرة أو محتوى لتحويله إلى إنفوجرافيك...',
  upload: '📎 رفع ملف (Word · PDF · Excel · txt · md · json)', outLang: 'لغة الإخراج', sameAsInput: 'مثل لغة الإدخال', uiLang: 'لغة الواجهة',
  copyPrompt: '📋 نسخ موجّه AI', copyPromptHint: 'لا مفتاح API؟ اضغط "نسخ موجّه AI"، الصقه في محادثة (ChatGPT/Claude/Gemini) مع المحتوى، ثم الصق JSON العائد في صندوق النص — تحصل على البنية الدقيقة.',
  promptCopied: '✓ تم نسخ الموجّه — الصقه في محادثة مع المحتوى', promptCopyFail: 'فشل النسخ إلى الحافظة', jsonLoaded: '✓ تم تحميل بنية JSON', fileFail: 'فشل استخراج الملف',
  engine: 'محرك التحليل', demo: 'تجريبي (بدون AI)', demoHint: 'الوضع التجريبي: كشف بالكلمات المفتاحية — سريع لكنه سطحي. للتحليل الحقيقي اختر محرك AI وأدخل مفتاح API.',
  apiKey: 'مفتاح API', model: 'اسم النموذج', generate: '✨ أنشئ إنفوجرافيك', analyzing: 'جارٍ التحليل...',
  error: 'خطأ', fallbackDemo: 'تم التحويل إلى الوضع التجريبي',
  editContent: 'تحرير المحتوى', mainTitlePh: 'العنوان الرئيسي', itemTitlePh: 'عنوان العنصر', itemBodyPh: 'نص توضيحي (اختياري)',
  addItem: '+ أضف عنصراً', sideRight: 'الجانب الأيمن', sideLeft: 'الجانب الأيسر', yearPh: 'سنة',
  sideAPh: 'عنوان الجانب الأيمن', sideBPh: 'عنوان الجانب الأيسر',
  template: 'قالب', recommended: 'موصى به', change: '🎛 تغيير القالب', close: '✕ إغلاق',
  theme: 'نظام الألوان', customTheme: 'مخصص', bg: 'خلفية',
  style: 'نمط', clean: 'نظيف', rough: 'مرسوم يدوياً', wash: 'ألوان مائية',
  emptyTitle: '✍️ اكتب نصاً أو الصق فقرة أو ارفع docx',
  emptyHint: 'يتم اكتشاف البنية تلقائياً — عملية، مقارنة، دورة، تسلسل هرمي والمزيد — مع جميع الخيارات للاختيار.',
  pickIcon: 'اختر أيقونة', noIcon: '✕ بدون أيقونة', searchIcon: 'بحث عن أيقونة...',
  docxFail: 'فشل استخراج docx', unsupported: 'تنسيق غير مدعوم — docx فقط',
  up: 'لأعلى', down: 'لأسفل', del: 'حذف', keyMissing: 'أدخل مفتاح API',
};

const ru: Dict = {
  builtBy: 'Создано Элияху Битоном', manual: 'Ручная сборка (без AI)', startManual: '🛠 Начать ручную сборку', manualHint: 'Ручной режим: открывает пустой шаблон — заполните заголовок и пункты в панели редактирования, без текста и ключа.',
  reset: '🔄 Начать заново', imgSize: 'Формат', sizeAuto: 'Оригинал',
  exportSettings: '⬇ Сохранить настройки в файл', importSettings: '⬆ Загрузить настройки из файла', importOk: 'Настройки загружены', importBad: 'Неверный файл настроек', settingsNote: 'Сохраняет ключи и настройки в файл — для резервной копии или другого компьютера.',
  tagline: 'Текст на входе — инфографика на выходе',
  yourText: 'Ваш текст', placeholder: 'Вставьте или введите абзац, идею или любой текст для инфографики...',
  upload: '📎 Загрузить файл (Word · PDF · Excel · txt · md · json)', outLang: 'Язык результата', sameAsInput: 'Как язык ввода', uiLang: 'Язык интерфейса',
  copyPrompt: '📋 Копировать AI-промпт', copyPromptHint: 'Нет API-ключа? Нажмите «Копировать AI-промпт», вставьте его в чат (ChatGPT/Claude/Gemini) вместе с контентом, затем вставьте полученный JSON в поле текста — получите точную структуру.',
  promptCopied: '✓ Промпт скопирован — вставьте его в чат вместе с контентом', promptCopyFail: 'Не удалось скопировать в буфер', jsonLoaded: '✓ Структура JSON загружена', fileFail: 'Не удалось извлечь файл',
  engine: 'AI-движок', demo: 'Демо (без AI)', demoHint: 'Демо-режим: распознавание по ключевым словам — быстро, но поверхностно. Для настоящего анализа выберите AI-движок и введите API-ключ.',
  apiKey: 'API-ключ', model: 'Название модели', generate: '✨ Создать инфографику', analyzing: 'Анализ...',
  error: 'Ошибка', fallbackDemo: 'переключено в демо-режим',
  editContent: 'Редактирование', mainTitlePh: 'Главный заголовок', itemTitlePh: 'Заголовок пункта', itemBodyPh: 'Описание (необязательно)',
  addItem: '+ Добавить пункт', sideRight: 'Правая сторона', sideLeft: 'Левая сторона', yearPh: 'Год',
  sideAPh: 'Заголовок правой стороны', sideBPh: 'Заголовок левой стороны',
  template: 'Шаблон', recommended: 'Рекомендуется', change: '🎛 Сменить шаблон', close: '✕ Закрыть',
  theme: 'Цветовая тема', customTheme: 'Своя', bg: 'Фон',
  style: 'Стиль', clean: 'Чистый', rough: 'От руки', wash: 'Акварель',
  emptyTitle: '✍️ Введите текст, вставьте абзац или загрузите docx',
  emptyHint: 'Структура определяется автоматически — процесс, сравнение, цикл, иерархия и др. — со всеми вариантами на выбор.',
  pickIcon: 'Выбрать иконку', noIcon: '✕ Без иконки', searchIcon: 'Поиск иконки...',
  docxFail: 'Не удалось извлечь docx', unsupported: 'Неподдерживаемый формат — только docx',
  up: 'Вверх', down: 'Вниз', del: 'Удалить', keyMissing: 'Введите API-ключ',
};

const fr: Dict = {
  builtBy: 'Créé par Eliyahu Biton', manual: 'Construction manuelle (sans IA)', startManual: '🛠 Démarrer la construction manuelle', manualHint: 'Mode manuel : ouvre un modèle vide — remplissez le titre et les éléments dans le panneau d’édition, sans texte ni clé.',
  reset: '🔄 Recommencer', imgSize: 'Format', sizeAuto: 'Original',
  exportSettings: '⬇ Enregistrer les réglages', importSettings: '⬆ Charger les réglages', importOk: 'Réglages chargés', importBad: 'Fichier de réglages invalide', settingsNote: 'Enregistre vos clés et préférences dans un fichier — sauvegarde ou autre ordinateur.',
  tagline: 'Du texte entre — une infographie sort',
  yourText: 'Votre texte', placeholder: 'Collez ou saisissez un paragraphe, une idée ou un contenu à transformer en infographie...',
  upload: '📎 Importer un fichier (Word · PDF · Excel · txt · md · json)', outLang: 'Langue de sortie', sameAsInput: "Comme la langue d'entrée", uiLang: "Langue de l'interface",
  copyPrompt: '📋 Copier le prompt IA', copyPromptHint: 'Pas de clé API ? Cliquez « Copier le prompt IA », collez-le dans un chat (ChatGPT/Claude/Gemini) avec votre contenu, puis collez le JSON renvoyé dans la zone de texte — vous obtenez la structure exacte.',
  promptCopied: '✓ Prompt copié — collez-le dans un chat avec votre contenu', promptCopyFail: 'Échec de la copie dans le presse-papiers', jsonLoaded: '✓ Structure JSON chargée', fileFail: "Échec de l'extraction du fichier",
  engine: 'Moteur IA', demo: 'Démo (sans IA)', demoHint: 'Mode démo : détection par mots-clés — rapide mais superficiel. Pour une vraie analyse, choisissez un moteur IA et saisissez votre clé API.',
  apiKey: 'Clé API', model: 'Nom du modèle', generate: '✨ Créer l’infographie', analyzing: 'Analyse...',
  error: 'Erreur', fallbackDemo: 'passage en mode démo',
  editContent: 'Modifier le contenu', mainTitlePh: 'Titre principal', itemTitlePh: "Titre de l'élément", itemBodyPh: 'Description (facultatif)',
  addItem: '+ Ajouter un élément', sideRight: 'Côté droit', sideLeft: 'Côté gauche', yearPh: 'Année',
  sideAPh: 'Libellé côté droit', sideBPh: 'Libellé côté gauche',
  template: 'Modèle', recommended: 'Recommandé', change: '🎛 Changer de modèle', close: '✕ Fermer',
  theme: 'Thème de couleurs', customTheme: 'Personnalisé', bg: 'Fond',
  style: 'Style', clean: 'Net', rough: 'Dessiné à la main', wash: 'Aquarelle',
  emptyTitle: '✍️ Saisissez du texte, collez un paragraphe ou importez un docx',
  emptyHint: 'La structure est détectée automatiquement — processus, comparaison, cycle, hiérarchie et plus — avec toutes les variantes au choix.',
  pickIcon: 'Choisir une icône', noIcon: '✕ Sans icône', searchIcon: 'Rechercher une icône...',
  docxFail: 'Échec de l’extraction docx', unsupported: 'Format non pris en charge — docx uniquement',
  up: 'Monter', down: 'Descendre', del: 'Supprimer', keyMissing: 'Saisissez une clé API',
};

const es: Dict = {
  builtBy: 'Creado por Eliyahu Biton', manual: 'Construcción manual (sin IA)', startManual: '🛠 Iniciar construcción manual', manualHint: 'Modo manual: abre una plantilla vacía — completa el título y los elementos en el panel de edición, sin texto ni clave.',
  reset: '🔄 Empezar de nuevo', imgSize: 'Formato', sizeAuto: 'Original',
  exportSettings: '⬇ Guardar ajustes en archivo', importSettings: '⬆ Cargar ajustes de archivo', importOk: 'Ajustes cargados', importBad: 'Archivo de ajustes no válido', settingsNote: 'Guarda tus claves y preferencias en un archivo — copia de seguridad u otro equipo.',
  tagline: 'Entra texto — sale una infografía',
  yourText: 'Tu texto', placeholder: 'Pega o escribe un párrafo, idea o contenido para convertirlo en infografía...',
  upload: '📎 Subir archivo (Word · PDF · Excel · txt · md · json)', outLang: 'Idioma de salida', sameAsInput: 'Como el idioma de entrada', uiLang: 'Idioma de la interfaz',
  copyPrompt: '📋 Copiar prompt de IA', copyPromptHint: '¿Sin clave API? Pulsa "Copiar prompt de IA", pégalo en un chat (ChatGPT/Claude/Gemini) con tu contenido y pega el JSON devuelto en el cuadro de texto — obtienes la estructura exacta.',
  promptCopied: '✓ Prompt copiado — pégalo en un chat con tu contenido', promptCopyFail: 'Error al copiar al portapapeles', jsonLoaded: '✓ Estructura JSON cargada', fileFail: 'Error al extraer el archivo',
  engine: 'Motor de IA', demo: 'Demo (sin IA)', demoHint: 'Modo demo: detección por palabras clave — rápido pero superficial. Para un análisis real elige un motor de IA e introduce tu clave API.',
  apiKey: 'Clave API', model: 'Nombre del modelo', generate: '✨ Crear infografía', analyzing: 'Analizando...',
  error: 'Error', fallbackDemo: 'se cambió al modo demo',
  editContent: 'Editar contenido', mainTitlePh: 'Título principal', itemTitlePh: 'Título del elemento', itemBodyPh: 'Descripción (opcional)',
  addItem: '+ Añadir elemento', sideRight: 'Lado derecho', sideLeft: 'Lado izquierdo', yearPh: 'Año',
  sideAPh: 'Etiqueta lado derecho', sideBPh: 'Etiqueta lado izquierdo',
  template: 'Plantilla', recommended: 'Recomendado', change: '🎛 Cambiar plantilla', close: '✕ Cerrar',
  theme: 'Tema de color', customTheme: 'Personalizado', bg: 'Fondo',
  style: 'Estilo', clean: 'Limpio', rough: 'A mano', wash: 'Acuarela',
  emptyTitle: '✍️ Escribe texto, pega un párrafo o sube un docx',
  emptyHint: 'La estructura se detecta automáticamente — proceso, comparación, ciclo, jerarquía y más — con todas las variantes para elegir.',
  pickIcon: 'Elegir icono', noIcon: '✕ Sin icono', searchIcon: 'Buscar icono...',
  docxFail: 'Falló la extracción del docx', unsupported: 'Formato no compatible — solo docx',
  up: 'Subir', down: 'Bajar', del: 'Eliminar', keyMissing: 'Introduce una clave API',
};

const DICTS: Record<UiLang, Dict> = { he, en, ar, ru, fr, es };

/** שמות התבניות בכל שפות הממשק */
export const TYPE_LABELS_I18N: Record<UiLang, Record<VisualType, string>> = {
  he: { list: 'רשימה', flow: 'תהליך', cycle: 'מחזור', pyramid: 'פירמידה', comparison: 'השוואה', timeline: 'ציר זמן', funnel: 'משפך', matrix: 'מטריצה', mindmap: 'מפת חשיבה', target: 'מטרה', steps: 'מדרגות', mountain: 'הרים עולים', snake: 'נחש גריד', sector: 'סקטורים', stairs3d: 'מדרגות 3D', ring: 'טבעת חצים', roadmap: 'מפת דרכים', tree: 'היררכיית עץ', cards: 'כרטיסי רצף', chevron: 'חיצי שברון', vtimeline: 'ציר זמן אנכי' },
  en: { list: 'List', flow: 'Process', cycle: 'Cycle', pyramid: 'Pyramid', comparison: 'Comparison', timeline: 'Timeline', funnel: 'Funnel', matrix: 'Matrix', mindmap: 'Mind map', target: 'Target', steps: 'Steps', mountain: 'Mountains', snake: 'Snake grid', sector: 'Sectors', stairs3d: '3D Stairs', ring: 'Ring arrows', roadmap: 'Roadmap', tree: 'Tree hierarchy', cards: 'Sequence cards', chevron: 'Chevrons', vtimeline: 'Vertical timeline' },
  ar: { list: 'قائمة', flow: 'عملية', cycle: 'دورة', pyramid: 'هرم', comparison: 'مقارنة', timeline: 'خط زمني', funnel: 'قمع', matrix: 'مصفوفة', mindmap: 'خريطة ذهنية', target: 'هدف', steps: 'درجات', mountain: 'جبال صاعدة', snake: 'شبكة ثعبان', sector: 'قطاعات', stairs3d: 'درج ثلاثي الأبعاد', ring: 'حلقة أسهم', roadmap: 'خريطة طريق', tree: 'شجرة هرمية', cards: 'بطاقات متسلسلة', chevron: 'أسهم شيفرون', vtimeline: 'خط زمني عمودي' },
  ru: { list: 'Список', flow: 'Процесс', cycle: 'Цикл', pyramid: 'Пирамида', comparison: 'Сравнение', timeline: 'Хронология', funnel: 'Воронка', matrix: 'Матрица', mindmap: 'Ментальная карта', target: 'Мишень', steps: 'Ступени', mountain: 'Горы роста', snake: 'Змейка', sector: 'Секторы', stairs3d: '3D лестница', ring: 'Кольцо со стрелками', roadmap: 'Дорожная карта', tree: 'Древо иерархии', cards: 'Карточки-серия', chevron: 'Шевроны', vtimeline: 'Вертикальная хронология' },
  fr: { list: 'Liste', flow: 'Processus', cycle: 'Cycle', pyramid: 'Pyramide', comparison: 'Comparaison', timeline: 'Chronologie', funnel: 'Entonnoir', matrix: 'Matrice', mindmap: 'Carte mentale', target: 'Cible', steps: 'Étapes', mountain: 'Montagnes', snake: 'Serpent grille', sector: 'Secteurs', stairs3d: 'Escalier 3D', ring: 'Anneau fléché', roadmap: 'Feuille de route', tree: 'Arbre hiérarchique', cards: 'Cartes séquence', chevron: 'Chevrons', vtimeline: 'Chronologie verticale' },
  es: { list: 'Lista', flow: 'Proceso', cycle: 'Ciclo', pyramid: 'Pirámide', comparison: 'Comparación', timeline: 'Línea de tiempo', funnel: 'Embudo', matrix: 'Matriz', mindmap: 'Mapa mental', target: 'Diana', steps: 'Escalones', mountain: 'Montañas', snake: 'Serpiente cuadrícula', sector: 'Sectores', stairs3d: 'Escalera 3D', ring: 'Anillo de flechas', roadmap: 'Hoja de ruta', tree: 'Árbol jerárquico', cards: 'Tarjetas secuencia', chevron: 'Chevrones', vtimeline: 'Cronología vertical' },
};

/** שמות קטגוריות האייקונים בכל שפה (לפי הסדר ב-icons.tsx) */
export const ICON_CATS_I18N: Record<UiLang, string[]> = {
  he: ['משפט ועסקים', 'כספים', 'אנשים', 'זמן ותהליך', 'תקשורת', 'טכנולוגיה', 'בריאות וחינוך', 'סמלים וכללי'],
  en: ['Law & business', 'Finance', 'People', 'Time & process', 'Communication', 'Technology', 'Health & education', 'Symbols & general'],
  ar: ['قانون وأعمال', 'مال', 'أشخاص', 'وقت وعملية', 'تواصل', 'تقنية', 'صحة وتعليم', 'رموز وعام'],
  ru: ['Право и бизнес', 'Финансы', 'Люди', 'Время и процесс', 'Связь', 'Технологии', 'Здоровье и обучение', 'Символы и общее'],
  fr: ['Droit & affaires', 'Finance', 'Personnes', 'Temps & processus', 'Communication', 'Technologie', 'Santé & éducation', 'Symboles & général'],
  es: ['Derecho y negocios', 'Finanzas', 'Personas', 'Tiempo y proceso', 'Comunicación', 'Tecnología', 'Salud y educación', 'Símbolos y general'],
};

/** שמות ערכות הצבע בכל שפה */
export const THEME_LABELS_I18N: Record<UiLang, Record<string, string>> = {
  he: { tealOrange: 'טורקיז-כתום', corporate: 'כחול תאגידי', midnight: 'כחול עמוק', warm: 'חם ונייטרלי', pastel: 'פסטל', forest: 'ירוק יער', royal: 'סגול מלכותי', sunset: 'שקיעה', contrast: 'ניגודיות גבוהה', mono: 'מונוכרום' },
  en: { tealOrange: 'Teal & Orange', corporate: 'Corporate Blue', midnight: 'Midnight', warm: 'Warm Neutral', pastel: 'Pastel', forest: 'Forest Green', royal: 'Royal Purple', sunset: 'Sunset', contrast: 'High Contrast', mono: 'Monochrome' },
  ar: { tealOrange: 'فيروزي وبرتقالي', corporate: 'أزرق مؤسسي', midnight: 'أزرق داكن', warm: 'دافئ محايد', pastel: 'باستيل', forest: 'أخضر غابات', royal: 'بنفسجي ملكي', sunset: 'غروب', contrast: 'تباين عالٍ', mono: 'أحادي اللون' },
  ru: { tealOrange: 'Бирюза и оранж', corporate: 'Корпоративный синий', midnight: 'Полночь', warm: 'Тёплый нейтральный', pastel: 'Пастель', forest: 'Лесной зелёный', royal: 'Королевский фиолетовый', sunset: 'Закат', contrast: 'Высокий контраст', mono: 'Монохром' },
  fr: { tealOrange: 'Sarcelle & orange', corporate: 'Bleu corporate', midnight: 'Minuit', warm: 'Neutre chaud', pastel: 'Pastel', forest: 'Vert forêt', royal: 'Violet royal', sunset: 'Coucher de soleil', contrast: 'Contraste élevé', mono: 'Monochrome' },
  es: { tealOrange: 'Turquesa y naranja', corporate: 'Azul corporativo', midnight: 'Medianoche', warm: 'Neutro cálido', pastel: 'Pastel', forest: 'Verde bosque', royal: 'Púrpura real', sunset: 'Atardecer', contrast: 'Alto contraste', mono: 'Monocromo' },
};

export interface I18n {
  lang: UiLang;
  dir: 'rtl' | 'ltr';
  t: (key: string) => string;
  typeLabel: (t: VisualType) => string;
  catLabel: (index: number) => string;
  themeLabel: (name: string) => string;
}

export function makeI18n(lang: UiLang): I18n {
  const dict = DICTS[lang] ?? DICTS.he;
  const dir = (UI_LANGS.find((l) => l.code === lang)?.dir ?? 'rtl') as 'rtl' | 'ltr';
  return {
    lang,
    dir,
    t: (key) => dict[key] ?? DICTS.he[key] ?? key,
    typeLabel: (tp) => TYPE_LABELS_I18N[lang]?.[tp] ?? TYPE_LABELS_I18N.he[tp],
    catLabel: (i) => ICON_CATS_I18N[lang]?.[i] ?? ICON_CATS_I18N.he[i],
    themeLabel: (name) => THEME_LABELS_I18N[lang]?.[name] ?? THEME_LABELS_I18N.he[name] ?? name,
  };
}

export const I18nContext = createContext<I18n>(makeI18n('he'));
export const useI18n = () => useContext(I18nContext);
