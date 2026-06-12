import type { ComponentType } from 'react';
import {
  // משפט ועסקים
  Scale, Gavel, FileText, FileCheck, FileSignature, Files, FolderOpen,
  ClipboardList, ClipboardCheck, Briefcase, Building2, Landmark, Stamp,
  ScrollText, BookOpen, Shield, ShieldCheck, BadgeCheck, Handshake,
  // כספים
  Coins, Banknote, Wallet, CreditCard, PiggyBank, DollarSign, Percent,
  TrendingUp, TrendingDown, BarChart3, PieChart, LineChart, Calculator,
  Receipt, ShoppingCart, Package, Gem,
  // אנשים
  User, Users, UserPlus, UserCheck, UserCog, Baby, PersonStanding,
  HeartHandshake, Smile, Frown, Eye, Crown, Footprints, Accessibility,
  // זמן ותהליך
  Clock, Timer, Hourglass, Calendar, CalendarCheck, CalendarClock, History,
  RefreshCw, Repeat, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Route,
  Map, MapPin, Navigation, Milestone, Flag,
  // תקשורת
  Mail, MailOpen, Send, Phone, PhoneCall, MessageCircle, MessagesSquare,
  Megaphone, Bell, BellRing, Share2, Rss, Globe, Languages, Mic, Video,
  Camera, Image,
  // טכנולוגיה
  Cpu, Server, Database, HardDrive, Cloud, UploadCloud, DownloadCloud,
  Wifi, Smartphone, Laptop, Monitor, Code, Terminal, Bug, Settings, Wrench,
  Hammer, Bot, Zap, Plug, Lock, Unlock, Key, Fingerprint, QrCode,
  // בריאות וחינוך
  Stethoscope, HeartPulse, Activity, Pill, Syringe, Thermometer, Ambulance,
  Dna, Microscope, FlaskConical, TestTube, Leaf, Sprout, GraduationCap,
  School, BookMarked, Pencil, PenTool, Ruler, Brain,
  // סמלים וכללי
  Lightbulb, Target, Award, Trophy, Medal, Star, Sparkles, Rocket, Flame,
  Sun, Moon, Umbrella, AlertTriangle, AlertCircle, Info, HelpCircle,
  CheckCircle2, XCircle, Ban, ThumbsUp, ThumbsDown, Puzzle, Compass, Anchor,
  Gift, Bookmark, Tag, Search, Filter, Layers, Box, Truck, Plane, Car, Home,
  Mountain, Paperclip, Link, Recycle, Heart, ListChecks,
} from 'lucide-react';

/**
 * מאגר האייקונים: ~150 אייקוני lucide בקטגוריות, עם תוויות עברית.
 * 40 שמות הליבה נשמרים כפי שהיו — תאימות לפרומפט של Gemini ולמסמכים שמורים.
 */

export const CATEGORIES = [
  'משפט ועסקים',
  'כספים',
  'אנשים',
  'זמן ותהליך',
  'תקשורת',
  'טכנולוגיה',
  'בריאות וחינוך',
  'סמלים וכללי',
] as const;

type Cat = (typeof CATEGORIES)[number];

interface IconEntry {
  C: ComponentType<Record<string, unknown>>;
  he: string;
  cat: Cat;
}

export const ICONS: Record<string, IconEntry> = {
  /* ---------- משפט ועסקים ---------- */
  scale: { C: Scale, he: 'מאזניים', cat: 'משפט ועסקים' },
  gavel: { C: Gavel, he: 'פטיש שופט', cat: 'משפט ועסקים' },
  file: { C: FileText, he: 'מסמך', cat: 'משפט ועסקים' },
  'file-check': { C: FileCheck, he: 'מסמך מאושר', cat: 'משפט ועסקים' },
  signature: { C: FileSignature, he: 'חתימה', cat: 'משפט ועסקים' },
  files: { C: Files, he: 'מסמכים', cat: 'משפט ועסקים' },
  folder: { C: FolderOpen, he: 'תיקייה', cat: 'משפט ועסקים' },
  checklist: { C: ListChecks, he: "צ'קליסט", cat: 'משפט ועסקים' },
  clipboard: { C: ClipboardList, he: 'רשימת משימות', cat: 'משפט ועסקים' },
  'clipboard-check': { C: ClipboardCheck, he: 'משימות הושלמו', cat: 'משפט ועסקים' },
  briefcase: { C: Briefcase, he: 'תיק עבודה', cat: 'משפט ועסקים' },
  building: { C: Building2, he: 'בניין', cat: 'משפט ועסקים' },
  landmark: { C: Landmark, he: 'מוסד ציבורי', cat: 'משפט ועסקים' },
  stamp: { C: Stamp, he: 'חותמת', cat: 'משפט ועסקים' },
  scroll: { C: ScrollText, he: 'מגילה / חוק', cat: 'משפט ועסקים' },
  book: { C: BookOpen, he: 'ספר', cat: 'משפט ועסקים' },
  shield: { C: Shield, he: 'מגן', cat: 'משפט ועסקים' },
  'shield-check': { C: ShieldCheck, he: 'הגנה מאושרת', cat: 'משפט ועסקים' },
  badge: { C: BadgeCheck, he: 'תו תקן', cat: 'משפט ועסקים' },
  handshake: { C: Handshake, he: 'לחיצת יד', cat: 'משפט ועסקים' },

  /* ---------- כספים ---------- */
  money: { C: Coins, he: 'כסף', cat: 'כספים' },
  banknote: { C: Banknote, he: 'שטר', cat: 'כספים' },
  wallet: { C: Wallet, he: 'ארנק', cat: 'כספים' },
  'credit-card': { C: CreditCard, he: 'כרטיס אשראי', cat: 'כספים' },
  piggy: { C: PiggyBank, he: 'חיסכון', cat: 'כספים' },
  dollar: { C: DollarSign, he: 'דולר', cat: 'כספים' },
  percent: { C: Percent, he: 'אחוזים', cat: 'כספים' },
  growth: { C: TrendingUp, he: 'צמיחה', cat: 'כספים' },
  decline: { C: TrendingDown, he: 'ירידה', cat: 'כספים' },
  'chart-bar': { C: BarChart3, he: 'גרף עמודות', cat: 'כספים' },
  'chart-pie': { C: PieChart, he: 'גרף עוגה', cat: 'כספים' },
  'chart-line': { C: LineChart, he: 'גרף קו', cat: 'כספים' },
  calculator: { C: Calculator, he: 'מחשבון', cat: 'כספים' },
  receipt: { C: Receipt, he: 'קבלה', cat: 'כספים' },
  cart: { C: ShoppingCart, he: 'עגלת קניות', cat: 'כספים' },
  package: { C: Package, he: 'חבילה', cat: 'כספים' },
  gem: { C: Gem, he: 'יהלום', cat: 'כספים' },

  /* ---------- אנשים ---------- */
  person: { C: User, he: 'אדם', cat: 'אנשים' },
  team: { C: Users, he: 'צוות', cat: 'אנשים' },
  'user-plus': { C: UserPlus, he: 'גיוס / הוספה', cat: 'אנשים' },
  'user-check': { C: UserCheck, he: 'אדם מאושר', cat: 'אנשים' },
  'user-cog': { C: UserCog, he: 'ניהול אנשים', cat: 'אנשים' },
  baby: { C: Baby, he: 'תינוק', cat: 'אנשים' },
  standing: { C: PersonStanding, he: 'דמות', cat: 'אנשים' },
  'heart-handshake': { C: HeartHandshake, he: 'שיתוף פעולה', cat: 'אנשים' },
  smile: { C: Smile, he: 'חיוך', cat: 'אנשים' },
  frown: { C: Frown, he: 'עצב', cat: 'אנשים' },
  eye: { C: Eye, he: 'עין', cat: 'אנשים' },
  crown: { C: Crown, he: 'כתר', cat: 'אנשים' },
  footprints: { C: Footprints, he: 'עקבות', cat: 'אנשים' },
  accessibility: { C: Accessibility, he: 'נגישות', cat: 'אנשים' },

  /* ---------- זמן ותהליך ---------- */
  clock: { C: Clock, he: 'שעון', cat: 'זמן ותהליך' },
  timer: { C: Timer, he: 'טיימר', cat: 'זמן ותהליך' },
  hourglass: { C: Hourglass, he: 'שעון חול', cat: 'זמן ותהליך' },
  calendar: { C: Calendar, he: 'לוח שנה', cat: 'זמן ותהליך' },
  'calendar-check': { C: CalendarCheck, he: 'מועד אושר', cat: 'זמן ותהליך' },
  'calendar-clock': { C: CalendarClock, he: 'דדליין', cat: 'זמן ותהליך' },
  history: { C: History, he: 'היסטוריה', cat: 'זמן ותהליך' },
  refresh: { C: RefreshCw, he: 'רענון / מחזור', cat: 'זמן ותהליך' },
  repeat: { C: Repeat, he: 'חזרה', cat: 'זמן ותהליך' },
  'arrow-right': { C: ArrowRight, he: 'חץ ימינה', cat: 'זמן ותהליך' },
  'arrow-left': { C: ArrowLeft, he: 'חץ שמאלה', cat: 'זמן ותהליך' },
  'arrow-up': { C: ArrowUp, he: 'חץ למעלה', cat: 'זמן ותהליך' },
  'arrow-down': { C: ArrowDown, he: 'חץ למטה', cat: 'זמן ותהליך' },
  route: { C: Route, he: 'מסלול', cat: 'זמן ותהליך' },
  map: { C: Map, he: 'מפה', cat: 'זמן ותהליך' },
  pin: { C: MapPin, he: 'נקודת ציון', cat: 'זמן ותהליך' },
  navigation: { C: Navigation, he: 'ניווט', cat: 'זמן ותהליך' },
  milestone: { C: Milestone, he: 'אבן דרך', cat: 'זמן ותהליך' },
  flag: { C: Flag, he: 'דגל', cat: 'זמן ותהליך' },

  /* ---------- תקשורת ---------- */
  mail: { C: Mail, he: 'מייל', cat: 'תקשורת' },
  'mail-open': { C: MailOpen, he: 'מייל פתוח', cat: 'תקשורת' },
  send: { C: Send, he: 'שליחה', cat: 'תקשורת' },
  phone: { C: Phone, he: 'טלפון', cat: 'תקשורת' },
  'phone-call': { C: PhoneCall, he: 'שיחת טלפון', cat: 'תקשורת' },
  chat: { C: MessageCircle, he: 'שיחה', cat: 'תקשורת' },
  chats: { C: MessagesSquare, he: 'דיון', cat: 'תקשורת' },
  megaphone: { C: Megaphone, he: 'מגפון', cat: 'תקשורת' },
  bell: { C: Bell, he: 'התראה', cat: 'תקשורת' },
  'bell-ring': { C: BellRing, he: 'התראה פעילה', cat: 'תקשורת' },
  share: { C: Share2, he: 'שיתוף', cat: 'תקשורת' },
  rss: { C: Rss, he: 'פיד', cat: 'תקשורת' },
  globe: { C: Globe, he: 'גלובוס', cat: 'תקשורת' },
  languages: { C: Languages, he: 'שפות', cat: 'תקשורת' },
  mic: { C: Mic, he: 'מיקרופון', cat: 'תקשורת' },
  video: { C: Video, he: 'וידאו', cat: 'תקשורת' },
  camera: { C: Camera, he: 'מצלמה', cat: 'תקשורת' },
  image: { C: Image, he: 'תמונה', cat: 'תקשורת' },

  /* ---------- טכנולוגיה ---------- */
  cpu: { C: Cpu, he: 'מעבד', cat: 'טכנולוגיה' },
  server: { C: Server, he: 'שרת', cat: 'טכנולוגיה' },
  database: { C: Database, he: 'מסד נתונים', cat: 'טכנולוגיה' },
  storage: { C: HardDrive, he: 'אחסון', cat: 'טכנולוגיה' },
  cloud: { C: Cloud, he: 'ענן', cat: 'טכנולוגיה' },
  upload: { C: UploadCloud, he: 'העלאה', cat: 'טכנולוגיה' },
  download: { C: DownloadCloud, he: 'הורדה', cat: 'טכנולוגיה' },
  wifi: { C: Wifi, he: 'רשת', cat: 'טכנולוגיה' },
  smartphone: { C: Smartphone, he: 'סמארטפון', cat: 'טכנולוגיה' },
  laptop: { C: Laptop, he: 'מחשב נייד', cat: 'טכנולוגיה' },
  monitor: { C: Monitor, he: 'מסך', cat: 'טכנולוגיה' },
  code: { C: Code, he: 'קוד', cat: 'טכנולוגיה' },
  terminal: { C: Terminal, he: 'טרמינל', cat: 'טכנולוגיה' },
  bug: { C: Bug, he: 'באג', cat: 'טכנולוגיה' },
  settings: { C: Settings, he: 'הגדרות', cat: 'טכנולוגיה' },
  wrench: { C: Wrench, he: 'מפתח ברגים', cat: 'טכנולוגיה' },
  hammer: { C: Hammer, he: 'פטיש', cat: 'טכנולוגיה' },
  bot: { C: Bot, he: 'רובוט / AI', cat: 'טכנולוגיה' },
  energy: { C: Zap, he: 'אנרגיה', cat: 'טכנולוגיה' },
  plug: { C: Plug, he: 'חיבור', cat: 'טכנולוגיה' },
  lock: { C: Lock, he: 'מנעול', cat: 'טכנולוגיה' },
  unlock: { C: Unlock, he: 'פתוח', cat: 'טכנולוגיה' },
  key: { C: Key, he: 'מפתח', cat: 'טכנולוגיה' },
  fingerprint: { C: Fingerprint, he: 'טביעת אצבע', cat: 'טכנולוגיה' },
  qr: { C: QrCode, he: 'ברקוד', cat: 'טכנולוגיה' },

  /* ---------- בריאות וחינוך ---------- */
  medical: { C: Stethoscope, he: 'רפואה', cat: 'בריאות וחינוך' },
  'heart-pulse': { C: HeartPulse, he: 'דופק', cat: 'בריאות וחינוך' },
  activity: { C: Activity, he: 'פעילות', cat: 'בריאות וחינוך' },
  pill: { C: Pill, he: 'תרופה', cat: 'בריאות וחינוך' },
  syringe: { C: Syringe, he: 'מזרק', cat: 'בריאות וחינוך' },
  thermometer: { C: Thermometer, he: 'מדחום', cat: 'בריאות וחינוך' },
  ambulance: { C: Ambulance, he: 'אמבולנס', cat: 'בריאות וחינוך' },
  dna: { C: Dna, he: 'DNA', cat: 'בריאות וחינוך' },
  microscope: { C: Microscope, he: 'מיקרוסקופ', cat: 'בריאות וחינוך' },
  flask: { C: FlaskConical, he: 'מעבדה', cat: 'בריאות וחינוך' },
  'test-tube': { C: TestTube, he: 'מבחנה', cat: 'בריאות וחינוך' },
  leaf: { C: Leaf, he: 'עלה', cat: 'בריאות וחינוך' },
  sprout: { C: Sprout, he: 'נבט', cat: 'בריאות וחינוך' },
  education: { C: GraduationCap, he: 'השכלה', cat: 'בריאות וחינוך' },
  school: { C: School, he: 'בית ספר', cat: 'בריאות וחינוך' },
  'book-marked': { C: BookMarked, he: 'ספר מסומן', cat: 'בריאות וחינוך' },
  pencil: { C: Pencil, he: 'עיפרון', cat: 'בריאות וחינוך' },
  pen: { C: PenTool, he: 'עט עיצוב', cat: 'בריאות וחינוך' },
  ruler: { C: Ruler, he: 'סרגל', cat: 'בריאות וחינוך' },
  brain: { C: Brain, he: 'מוח', cat: 'בריאות וחינוך' },

  /* ---------- סמלים וכללי ---------- */
  idea: { C: Lightbulb, he: 'רעיון', cat: 'סמלים וכללי' },
  target: { C: Target, he: 'מטרה', cat: 'סמלים וכללי' },
  award: { C: Award, he: 'פרס', cat: 'סמלים וכללי' },
  trophy: { C: Trophy, he: 'גביע', cat: 'סמלים וכללי' },
  medal: { C: Medal, he: 'מדליה', cat: 'סמלים וכללי' },
  star: { C: Star, he: 'כוכב', cat: 'סמלים וכללי' },
  sparkles: { C: Sparkles, he: 'נצנוץ', cat: 'סמלים וכללי' },
  rocket: { C: Rocket, he: 'טיל', cat: 'סמלים וכללי' },
  flame: { C: Flame, he: 'להבה', cat: 'סמלים וכללי' },
  sun: { C: Sun, he: 'שמש', cat: 'סמלים וכללי' },
  moon: { C: Moon, he: 'ירח', cat: 'סמלים וכללי' },
  umbrella: { C: Umbrella, he: 'מטרייה', cat: 'סמלים וכללי' },
  warning: { C: AlertTriangle, he: 'אזהרה', cat: 'סמלים וכללי' },
  alert: { C: AlertCircle, he: 'התראה', cat: 'סמלים וכללי' },
  info: { C: Info, he: 'מידע', cat: 'סמלים וכללי' },
  question: { C: HelpCircle, he: 'שאלה', cat: 'סמלים וכללי' },
  success: { C: CheckCircle2, he: 'הצלחה', cat: 'סמלים וכללי' },
  fail: { C: XCircle, he: 'כישלון', cat: 'סמלים וכללי' },
  ban: { C: Ban, he: 'איסור', cat: 'סמלים וכללי' },
  'thumbs-up': { C: ThumbsUp, he: 'בעד', cat: 'סמלים וכללי' },
  'thumbs-down': { C: ThumbsDown, he: 'נגד', cat: 'סמלים וכללי' },
  puzzle: { C: Puzzle, he: 'פאזל', cat: 'סמלים וכללי' },
  compass: { C: Compass, he: 'מצפן', cat: 'סמלים וכללי' },
  anchor: { C: Anchor, he: 'עוגן', cat: 'סמלים וכללי' },
  gift: { C: Gift, he: 'מתנה', cat: 'סמלים וכללי' },
  bookmark: { C: Bookmark, he: 'סימנייה', cat: 'סמלים וכללי' },
  tag: { C: Tag, he: 'תגית', cat: 'סמלים וכללי' },
  search: { C: Search, he: 'חיפוש', cat: 'סמלים וכללי' },
  filter: { C: Filter, he: 'סינון', cat: 'סמלים וכללי' },
  layers: { C: Layers, he: 'שכבות', cat: 'סמלים וכללי' },
  box: { C: Box, he: 'קופסה', cat: 'סמלים וכללי' },
  truck: { C: Truck, he: 'משלוח', cat: 'סמלים וכללי' },
  plane: { C: Plane, he: 'מטוס', cat: 'סמלים וכללי' },
  car: { C: Car, he: 'רכב', cat: 'סמלים וכללי' },
  home: { C: Home, he: 'בית', cat: 'סמלים וכללי' },
  mountain: { C: Mountain, he: 'הר', cat: 'סמלים וכללי' },
  paperclip: { C: Paperclip, he: 'מהדק', cat: 'סמלים וכללי' },
  link: { C: Link, he: 'קישור', cat: 'סמלים וכללי' },
  recycle: { C: Recycle, he: 'מיחזור', cat: 'סמלים וכללי' },
  heart: { C: Heart, he: 'לב', cat: 'סמלים וכללי' },
};

export const ICON_NAMES = Object.keys(ICONS);

/** אייקון ממורכז סביב (cx,cy) בתוך SVG */
export function ItemIcon({
  name,
  cx,
  cy,
  size,
  color,
}: {
  name?: string;
  cx: number;
  cy: number;
  size: number;
  color: string;
}) {
  if (!name || !ICONS[name]) return null;
  const C = ICONS[name].C;
  return <C x={cx - size / 2} y={cy - size / 2} width={size} height={size} color={color} strokeWidth={2.2} />;
}

export function hasIcon(name?: string): boolean {
  return !!name && !!ICONS[name];
}
