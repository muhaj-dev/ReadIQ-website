'use client';

import { type Editor, useEditorState } from '@tiptap/react';
import { useState } from 'react';

import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { EditorHighlight } from '@/constants/theme';
import { cn } from '@/lib/utils';

import { EditorColorRow } from './editor-color-row';
import { LinkDialog } from './link-dialog';

type Props = {
  editor: Editor;
  /** Opens the image picker and inserts the chosen image inline. */
  onInsertImage: () => void;
};

/** One toolbar entry: an icon action, an "H1/H2/H3" text action, or a divider. */
type Tool =
  | { kind: 'icon'; icon: AppIconName; label: string; active?: boolean; disabled?: boolean; run: () => void }
  | { kind: 'text'; text: string; label: string; active: boolean; run: () => void }
  | { kind: 'divider' };

/** Formatting bar above the rich editor — scrolls sideways on phones, wraps on desktop. */
export function RichToolbar({ editor, onInsertImage }: Props) {
  const [showColors, setShowColors] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);

  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      strike: e.isActive('strike'),
      highlight: e.isActive('highlight'),
      color: e.getAttributes('textStyle').color as string | undefined,
      link: e.isActive('link'),
      href: e.getAttributes('link').href as string | undefined,
      h1: e.isActive('heading', { level: 1 }),
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      bullet: e.isActive('bulletList'),
      ordered: e.isActive('orderedList'),
      task: e.isActive('taskList'),
      quote: e.isActive('blockquote'),
      code: e.isActive('code'),
    }),
  });

  const chain = () => editor.chain().focus();
  const tools: Tool[] = [
    { kind: 'icon', icon: 'undo', label: 'Undo', disabled: !s.canUndo, run: () => chain().undo().run() },
    { kind: 'icon', icon: 'redo', label: 'Redo', disabled: !s.canRedo, run: () => chain().redo().run() },
    { kind: 'divider' },
    { kind: 'icon', icon: 'format-bold', label: 'Bold', active: s.bold, run: () => chain().toggleBold().run() },
    { kind: 'icon', icon: 'format-italic', label: 'Italic', active: s.italic, run: () => chain().toggleItalic().run() },
    { kind: 'icon', icon: 'format-underlined', label: 'Underline', active: s.underline, run: () => chain().toggleUnderline().run() },
    { kind: 'icon', icon: 'format-strikethrough', label: 'Strikethrough', active: s.strike, run: () => chain().toggleStrike().run() },
    { kind: 'icon', icon: 'highlight', label: 'Highlight', active: s.highlight, run: () => chain().toggleHighlight({ color: EditorHighlight }).run() },
    { kind: 'icon', icon: 'format-color-text', label: 'Text colour', active: showColors || !!s.color, run: () => setShowColors((now) => !now) },
    { kind: 'icon', icon: 'link', label: 'Link', active: s.link, run: () => setLinkOpen(true) },
    { kind: 'divider' },
    { kind: 'text', text: 'H1', label: 'Heading 1', active: s.h1, run: () => chain().toggleHeading({ level: 1 }).run() },
    { kind: 'text', text: 'H2', label: 'Heading 2', active: s.h2, run: () => chain().toggleHeading({ level: 2 }).run() },
    { kind: 'text', text: 'H3', label: 'Heading 3', active: s.h3, run: () => chain().toggleHeading({ level: 3 }).run() },
    { kind: 'divider' },
    { kind: 'icon', icon: 'format-list-bulleted', label: 'Bullet list', active: s.bullet, run: () => chain().toggleBulletList().run() },
    { kind: 'icon', icon: 'format-list-numbered', label: 'Numbered list', active: s.ordered, run: () => chain().toggleOrderedList().run() },
    { kind: 'icon', icon: 'checklist', label: 'Checklist', active: s.task, run: () => chain().toggleTaskList().run() },
    { kind: 'divider' },
    { kind: 'icon', icon: 'format-quote', label: 'Quote', active: s.quote, run: () => chain().toggleBlockquote().run() },
    { kind: 'icon', icon: 'code', label: 'Code', active: s.code, run: () => chain().toggleCode().run() },
    { kind: 'divider' },
    { kind: 'icon', icon: 'image', label: 'Insert image', run: onInsertImage },
  ];

  const saveLink = (url: string) => {
    if (editor.state.selection.empty && !s.link) {
      // Nothing selected: insert the URL itself as linked text.
      chain().insertContent({ type: 'text', text: url, marks: [{ type: 'link', attrs: { href: url } }] }).run();
    } else {
      chain().extendMarkRange('link').setLink({ href: url }).run();
    }
    setLinkOpen(false);
  };

  return (
    <div className="border-b border-rq-outline-variant/40">
      <div role="toolbar" aria-label="Formatting" className="flex items-center gap-0.5 overflow-x-auto px-2 py-1.5 lg:flex-wrap">
        {tools.map((tool, i) =>
          tool.kind === 'divider' ? (
            <span key={`d${i}`} className="mx-1 h-5 w-px shrink-0 bg-rq-outline-variant/50" />
          ) : (
            <ToolButton key={tool.label} tool={tool} />
          ),
        )}
      </div>

      {showColors ? (
        <EditorColorRow
          activeColor={s.color}
          onSelect={(color) => chain().setColor(color).run()}
          onClear={() => chain().unsetColor().run()}
        />
      ) : null}

      <LinkDialog
        open={linkOpen}
        initialUrl={s.href}
        onSubmit={saveLink}
        onRemove={() => {
          chain().extendMarkRange('link').unsetLink().run();
          setLinkOpen(false);
        }}
        onClose={() => setLinkOpen(false)}
      />
    </div>
  );
}

/** A single formatting control — icon or text label; tints when active. */
function ToolButton({ tool }: { tool: Exclude<Tool, { kind: 'divider' }> }) {
  const active = !!tool.active;
  const disabled = tool.kind === 'icon' && !!tool.disabled;

  return (
    <button
      type="button"
      title={tool.label}
      aria-label={tool.label}
      aria-pressed={active}
      disabled={disabled}
      // Keep the editor's selection while clicking toolbar buttons.
      onMouseDown={(e) => e.preventDefault()}
      onClick={tool.run}
      className={cn(
        'flex h-9 min-w-9 shrink-0 items-center justify-center rounded-btn px-2 transition disabled:opacity-35',
        active
          ? 'bg-rq-secondary/14 text-rq-secondary'
          : 'text-rq-on-surface-variant hover:bg-rq-surface-low',
      )}
    >
      {tool.kind === 'text' ? <span className="text-sm font-semibold">{tool.text}</span> : <AppIcon name={tool.icon} size={20} />}
    </button>
  );
}
