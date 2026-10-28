// Ask composer state: the draft text, attached images, voice dictation, the webcam
// dialog, and the transient notice line. Keeps the Ask page thin (pages compose, hooks think).

import { useCallback, useState } from 'react';

import { useVoiceDictation } from '@/hooks/use-voice-dictation';
import { deleteBlob, putBlob } from '@/lib/blob-store';
import { ACCEPT_IMAGES, pickFiles } from '@/lib/files';
import type { ChatAttachment } from '@/types/chat';

/** How many images may ride along with one question. */
const MAX_ATTACHMENTS = 4;

function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Phones/tablets get the native camera via <input capture>; desktops get the webcam dialog. */
function prefersNativeCamera(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
}

type SubmitFn = (question: string, attachments: ChatAttachment[]) => void;

export function useAskComposer(onSubmit: SubmitFn) {
  const [draft, setDraft] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [webcamOpen, setWebcamOpen] = useState(false);

  /** Persist picked/captured images as `idb:` blobs and attach them (up to the cap). */
  const addImages = useCallback(
    async (files: Blob[]) => {
      const images = files.filter((f) => f.type.startsWith('image/'));
      if (files.length && !images.length) {
        setNotice('That file isn’t an image. Pick a photo or screenshot.');
        return;
      }
      const room = MAX_ATTACHMENTS - attachments.length;
      if (room <= 0) {
        setNotice(`You can attach up to ${MAX_ATTACHMENTS} images per question.`);
        return;
      }
      try {
        const added: ChatAttachment[] = [];
        for (const file of images.slice(0, room)) {
          added.push({ id: createId(), uri: await putBlob(file, 'photo.jpg') });
        }
        setAttachments((now) => [...now, ...added].slice(0, MAX_ATTACHMENTS));
        if (images.length > room) setNotice(`Only ${MAX_ATTACHMENTS} images fit on one question.`);
      } catch {
        setNotice('Couldn’t keep that image on this device. Try again.');
      }
    },
    [attachments.length],
  );

  // Dictation appends to whatever's already typed, then leaves it for review.
  const voice = useVoiceDictation({
    onResult: (text) => setDraft((d) => (d.trim() ? `${d.trim()} ${text}` : text)),
    onError: (message) => setNotice(message),
  });

  const addFromLibrary = useCallback(async () => {
    void addImages(await pickFiles({ accept: ACCEPT_IMAGES, multiple: true }));
  }, [addImages]);

  const addFromCamera = useCallback(async () => {
    const canStream = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
    if (prefersNativeCamera() || !canStream) {
      void addImages(await pickFiles({ accept: ACCEPT_IMAGES, capture: 'environment' }));
      return;
    }
    setWebcamOpen(true);
  }, [addImages]);

  const removeAttachment = useCallback((id: string) => {
    setAttachments((now) => {
      const gone = now.find((a) => a.id === id);
      if (gone) void deleteBlob(gone.uri);
      return now.filter((a) => a.id !== id);
    });
  }, []);

  const canSend = (draft.trim().length > 0 || attachments.length > 0) && voice.status === 'idle';

  const submit = useCallback(() => {
    const question = draft.trim();
    if (!question && attachments.length === 0) return;
    onSubmit(question, attachments);
    setDraft('');
    setAttachments([]);
    setNotice(null);
  }, [draft, attachments, onSubmit]);

  return {
    draft,
    setDraft,
    attachments,
    removeAttachment,
    addFromLibrary,
    addFromCamera,
    /** Webcam dialog (desktop "Take photo"). */
    webcam: {
      open: webcamOpen,
      close: () => setWebcamOpen(false),
      onCapture: (blob: Blob) => void addImages([blob]),
      /** Camera unavailable/denied → close and point to "Upload image" (a picker can't
       *  open here: the browser needs a fresh click for that). */
      onFallback: (message: string) => {
        setWebcamOpen(false);
        setNotice(message);
      },
    },
    voice,
    notice,
    clearNotice: () => setNotice(null),
    submit,
    canSend,
  };
}
