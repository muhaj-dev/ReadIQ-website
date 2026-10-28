type Props = {
  title: string;
  onTitleChange: (value: string) => void;
  note: string;
  onNoteChange: (value: string) => void;
};

/** Onboarding First Note editor: optional save-name field above the paste box. */
export function FirstNoteFields({ title, onTitleChange, note, onNoteChange }: Props) {
  return (
    <div className="flex flex-1 flex-col gap-3">
      <div>
        <label htmlFor="first-note-title" className="mb-1.5 block text-[13px] font-semibold text-rq-on-surface-variant">
          Save name
        </label>
        <input
          id="first-note-title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Name this note (optional)"
          className="w-full rounded-inner border border-rq-outline-variant/60 bg-rq-surface-lowest px-4 py-3 text-base font-medium text-rq-on-surface outline-none placeholder:text-rq-outline focus:border-rq-secondary-container"
        />
      </div>

      <textarea
        aria-label="Your note"
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        placeholder="Paste your notes here..."
        className="min-h-[180px] w-full flex-1 resize-none rounded-inner border border-rq-outline-variant/60 bg-rq-surface-lowest p-4 text-base leading-6 text-rq-on-surface shadow-soft outline-none placeholder:text-rq-outline focus:border-rq-secondary-container lg:min-h-[220px]"
      />
    </div>
  );
}
