'use client';

import { useState } from 'react';

import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { ACCEPT_EXTRACTABLE, pickFiles } from '@/lib/files';
import { cn } from '@/lib/utils';

type Props = {
  onFiles: (files: File[]) => void;
  /** Friendly validation line (e.g. wrong file type). */
  error?: string;
};

/** Big drag-and-drop zone + "Choose file" button for the Upload flow (PDF / .docx). */
export function UploadDropzone({ onFiles, error }: Props) {
  const [dragging, setDragging] = useState(false);

  const choose = async () => onFiles(await pickFiles({ accept: ACCEPT_EXTRACTABLE, multiple: true }));

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Choose a PDF or Word document"
        onClick={choose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            void choose();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          onFiles(Array.from(e.dataTransfer.files));
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center rounded-card border-2 border-dashed px-6 py-14 text-center transition lg:py-20',
          dragging
            ? 'border-rq-method-upload bg-rq-method-upload-well'
            : 'border-rq-outline-variant/70 bg-rq-surface-lowest hover:border-rq-method-upload/60',
        )}
      >
        <span className="flex size-16 items-center justify-center rounded-pill bg-rq-method-upload-well text-rq-method-upload">
          <AppIcon name="picture-as-pdf" size={32} />
        </span>
        <h2 className="mt-5 font-heading text-xl font-bold text-rq-on-surface">
          {dragging ? 'Drop to upload' : 'Drop your PDF or Word file here'}
        </h2>
        <p className="mt-1.5 max-w-sm text-[15px] text-rq-on-surface-variant">
          We&apos;ll read the text so you can ask questions and generate quizzes from it.
        </p>
        <Button type="button" className="pointer-events-none mt-6 h-11 rounded-btn px-6 text-[15px] font-semibold">
          <AppIcon name="file-upload" size={18} />
          Choose file
        </Button>
        <p className="mt-3 text-xs text-rq-outline">PDF or .docx · PDFs up to about 3 MB</p>
      </div>
      {error ? (
        <p role="alert" className="mt-3 text-center text-sm text-rq-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
