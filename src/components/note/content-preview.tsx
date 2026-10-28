'use client';

import Link from 'next/link';
import { useState } from 'react';

import { useFileUrl } from '@/lib/blob-store';

import { ImageLightbox } from './image-lightbox';

type Props = {
  heading: string;
  excerpt: string;
  /** Inline image from the note (idb:/data: uri); absent for plain text. */
  image?: string | null;
  /** Where clicking the card goes (the reader). */
  href: string;
};

/** Content Preview card on Note Details: heading, excerpt, optional image. */
export function ContentPreview({ heading, excerpt, image, href }: Props) {
  const url = useFileUrl(image ?? null);
  const [open, setOpen] = useState(false);

  return (
    <section>
      <h2 className="mb-3 font-sans text-sm font-semibold text-rq-on-surface">Content Preview</h2>
      <div className="grid gap-4 rounded-card border border-rq-outline-variant bg-rq-surface-lowest p-5 shadow-soft">
        <Link href={href} className="group grid gap-3">
          <h3 className="font-heading text-2xl font-semibold text-rq-on-surface group-hover:text-rq-primary">
            {heading}
          </h3>
          <p className="line-clamp-4 text-sm leading-relaxed text-rq-on-surface-variant lg:line-clamp-6">{excerpt}</p>
        </Link>
        {url ? (
          <button type="button" onClick={() => setOpen(true)} aria-label="View image">
            {/* eslint-disable-next-line @next/next/no-img-element -- local object/data URL */}
            <img src={url} alt="" className="aspect-[4/3] w-full rounded-lg bg-rq-surface-container object-cover" />
          </button>
        ) : null}
      </div>
      <ImageLightbox src={open ? url : null} alt={heading} onClose={() => setOpen(false)} />
    </section>
  );
}
