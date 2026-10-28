/* eslint-disable @next/next/no-img-element -- object URLs for IndexedDB blobs can't go through next/image. */
import { useFileUrl } from '@/lib/blob-store';
import { cn } from '@/lib/utils';

type Props = {
  /** Stored `idb:` (or any) uri of the image. */
  uri: string;
  className?: string;
};

/** A stored image rendered from its durable uri, with a calm placeholder while it loads. */
export function AttachmentThumb({ uri, className }: Props) {
  const url = useFileUrl(uri);
  return url ? (
    <img src={url} alt="Attached image" className={cn('object-cover', className)} />
  ) : (
    <div className={cn('animate-pulse bg-rq-surface-container', className)} aria-hidden />
  );
}
