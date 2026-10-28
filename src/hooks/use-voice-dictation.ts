// Voice-to-text for the Ask composer: tap to record (MediaRecorder) → stop →
// transcribe via Groq Whisper (lib/transcription). The recognised text is handed
// back to the caller to drop into the input for review — never auto-sent.

import { useEffect, useRef, useState } from 'react';

import { transcribeAudio } from '@/lib/transcription';

export type DictationStatus = 'idle' | 'recording' | 'transcribing';

type Options = {
  /** Called with the transcript once recording stops and Whisper returns. */
  onResult: (text: string) => void;
  /** Called with a friendly message when the mic is denied or transcription fails. */
  onError?: (message: string) => void;
};

const MIC_DENIED = 'Microphone access is off. Allow it in your browser to dictate.';
const NO_MIC = "This browser can't record audio — type your question instead.";
const NO_SPEECH = "I couldn't catch that — try again or type your question.";

/** The first container this browser can record (Whisper reads webm/ogg/mp4). */
function pickMimeType(): string | undefined {
  const options = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
  return options.find((t) => MediaRecorder.isTypeSupported?.(t));
}

/** Tap-to-dictate state machine: start() records, stop() transcribes, cancel() discards. */
export function useVoiceDictation({ onResult, onError }: Options) {
  const [status, setStatus] = useState<DictationStatus>('idle');
  const [seconds, setSeconds] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const discardRef = useRef(false);
  // Latest callbacks without re-binding the recorder handlers.
  const cbs = useRef({ onResult, onError });
  useEffect(() => {
    cbs.current = { onResult, onError };
  });

  useEffect(() => {
    if (status !== 'recording') return;
    const id = setInterval(() => setSeconds((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  const releaseMic = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  // Never leave the mic light on if the screen unmounts mid-recording.
  useEffect(
    () => () => {
      discardRef.current = true;
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
      releaseMic();
    },
    [],
  );

  const finish = async (blob: Blob) => {
    if (blob.size === 0) {
      cbs.current.onError?.(NO_SPEECH);
      setStatus('idle');
      return;
    }
    try {
      const text = (await transcribeAudio(blob)).trim();
      if (text) cbs.current.onResult(text);
      else cbs.current.onError?.(NO_SPEECH);
    } catch (err) {
      cbs.current.onError?.(err instanceof Error ? err.message : NO_SPEECH);
    } finally {
      setStatus('idle');
    }
  };

  /** Begin capturing; the browser asks for mic permission on first use. */
  const start = async () => {
    if (status !== 'idle') return;
    if (typeof MediaRecorder === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      cbs.current.onError?.(NO_MIC);
      return;
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      cbs.current.onError?.(MIC_DENIED);
      return;
    }
    try {
      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];
      discardRef.current = false;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        releaseMic();
        recorderRef.current = null;
        if (discardRef.current) return;
        void finish(new Blob(chunksRef.current, { type: recorder.mimeType || mimeType || 'audio/webm' }));
      };
      recorder.start();
      setSeconds(0);
      setStatus('recording');
    } catch {
      stream.getTracks().forEach((t) => t.stop());
      cbs.current.onError?.(NO_MIC);
    }
  };

  /** Stop and transcribe; hands the text to onResult (or onError on failure). */
  const stop = () => {
    const recorder = recorderRef.current;
    if (status !== 'recording' || !recorder) return;
    setStatus('transcribing');
    recorder.stop();
  };

  /** Stop without transcribing (the × button). */
  const cancel = () => {
    if (status !== 'recording') return;
    discardRef.current = true;
    recorderRef.current?.stop();
    releaseMic();
    setStatus('idle');
  };

  return { status, seconds, start, stop, cancel };
}
