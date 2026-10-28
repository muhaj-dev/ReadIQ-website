// readIQ design tokens for the web.
//
// The app's colours live as CSS variables in src/app/globals.css (light + dark),
// exposed to Tailwind with an `rq-` prefix. Mapping from the mobile app is
// mechanical: `colors.onSurfaceVariant` → `text-rq-on-surface-variant`,
// `withAlpha(colors.outlineVariant, 0.2)` → `border-rq-outline-variant/20`.
//
// Only fixed, theme-independent palettes (picked by the student, or brand art)
// live here as hex — they are data, not theme.

/** Every themeable token name (camelCase, as in the mobile app). */
export type ThemeColor =
  | 'surface'
  | 'surfaceLowest'
  | 'surfaceLow'
  | 'surfaceContainer'
  | 'surfaceContainerHigh'
  | 'surfaceVariant'
  | 'onSurface'
  | 'onSurfaceVariant'
  | 'outline'
  | 'outlineVariant'
  | 'primary'
  | 'primaryDeep'
  | 'primaryContainer'
  | 'onPrimary'
  | 'onPrimaryContainer'
  | 'secondary'
  | 'secondaryContainer'
  | 'secondaryFixed'
  | 'fab'
  | 'error'
  | 'errorContainer'
  | 'onErrorContainer'
  | 'flame'
  | 'methodPaste'
  | 'methodPasteWell'
  | 'methodUpload'
  | 'methodUploadWell'
  | 'methodScan'
  | 'methodScanWell'
  | 'methodRecord'
  | 'methodRecordWell'
  | 'noteGreen'
  | 'noteGreenWell'
  | 'noteAmber'
  | 'noteAmberWell'
  | 'noteRed'
  | 'noteRedWell'
  | 'quizCorrect'
  | 'quizCorrectBg'
  | 'quizCorrectWell'
  | 'quizCorrectInk'
  | 'quizCorrectText'
  | 'quizCheck'
  | 'quizSparkle'
  | 'dueSoon'
  | 'topicGreenBg'
  | 'topicGreenInk'
  | 'topicGreenBorder'
  | 'topicRedBg'
  | 'topicRedInk'
  | 'topicRedBorder'
  | 'topicAmberBg'
  | 'topicAmberInk'
  | 'topicAmberBorder'
  | 'topicBlueBg'
  | 'topicBlueInk'
  | 'topicBlueBorder'
  | 'profileTop'
  | 'profileBottom'
  | 'onPrimarySoft'
  | 'menuGreen'
  | 'menuGreenWell'
  | 'menuBlue'
  | 'menuBlueWell'
  | 'menuOrange'
  | 'menuOrangeWell'
  | 'menuSlate'
  | 'menuSlateWell'
  | 'menuPurple'
  | 'menuPurpleWell';

/** camelCase token → its CSS variable, e.g. 'onSurface' → 'var(--rq-on-surface)'.
 *  For the rare inline style that needs a token picked at runtime from data. */
export function tokenVar(token: ThemeColor): string {
  return `var(--rq-${token.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)})`;
}

/** Brand gradient (blue → purple), theme-independent. */
export const Brand = {
  gradientStart: '#3B4DF5',
  gradientEnd: '#8B33E8',
} as const;

/** Highlighter colour in the rich note editor — fixed, theme-independent. */
export const EditorHighlight = '#FEF08A' as const;

/** Ink for text on the marker-yellow highlight — fixed dark in both themes. */
export const EditorHighlightInk = '#1f2430' as const;

/** Font-colour swatches for the note editor's text-colour picker. */
export const EditorTextColors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'] as const;

/** Reader highlighter swatches; first entry is the default. */
export const ReaderHighlights = ['#FEF08A', '#BBF7D0', '#BFDBFE', '#FBCFE8', '#FED7AA'] as const;

/** Deadline marker colours the student picks per deadline. */
export const DeadlineMarkers = ['#FF5252', '#FF9100', '#FFD600', '#00E676', '#00B0FF', '#651FFF'] as const;
