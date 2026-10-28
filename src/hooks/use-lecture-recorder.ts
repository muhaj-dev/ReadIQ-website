// Drives the Record Lecture screen in the browser: mic permission, recording that
// starts on mount (MediaRecorder), pause/resume, an elapsed-seconds timer, and live
// waveform levels from an AnalyserNode. stop() resolves with the recorded Blob.

import { useEffect, useRef, useState } from 'react';

export type RecorderStatus = 'starting' | 'denied' | 'unsupported' | 'recording' | 'paused' | 'stopped';

/** Number of waveform bars the levels array drives. */
export const WAVE_BARS = 28;

// ~32 kbps opus ≈ 4 MB per ~16 minutes — keeps lectures under the transcription limit longer.
const AUDIO_BITS_PER_SECOND = 32_000;

function pickMimeType(): string | undefined {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type));
}

const SILENT = Array.from({ length: WAVE_BARS }, () => 0);

export function useLectureRecorder() {
  const [status, setStatus] = useState<RecorderStatus>('starting');
  const [seconds, setSeconds] = useState(0);
  const [levels, setLevels] = useState<number[]>(SILENT);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);

  // The student already chose "Record Lecture", so recording starts on mount.
  useEffect(() => {
    let cancelled = false;
    if (typeof MediaRecorder === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      queueMicrotask(() => setStatus('unsupported'));
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
      .then((stream) => {
        if (cancelled) return stream.getTracks().forEach((t) => t.stop());
        streamRef.current = stream;

        const mimeType = pickMimeType();
        const recorder = new MediaRecorder(stream, { mimeType, audioBitsPerSecond: AUDIO_BITS_PER_SECOND });
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };
        recorder.start(1000); // timeslice → chunks arrive steadily, nothing lost on stop
        recorderRef.current = recorder;

        // Live waveform: sample the mic's frequency bins into WAVE_BARS levels (~12 fps).
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        ctx.createMediaStreamSource(stream).connect(analyser);
        const bins = new Uint8Array(analyser.frequencyBinCount);
        let last = 0;
        const tick = (now: number) => {
          rafRef.current = requestAnimationFrame(tick);
          if (now - last < 80) return;
          last = now;
          analyser.getByteFrequencyData(bins);
          const step = Math.max(1, Math.floor(bins.length / WAVE_BARS));
          setLevels(Array.from({ length: WAVE_BARS }, (_, i) => (bins[i * step] ?? 0) / 255));
        };
        rafRef.current = requestAnimationFrame(tick);

        setStatus('recording');
      })
      .catch(() => {
        if (!cancelled) setStatus('denied');
      });

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (recorderRef.current && recorderRef.current.state !== 'inactive') recorderRef.current.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      void audioCtxRef.current?.close().catch(() => {});
      recorderRef.current = null;
      streamRef.current = null;
      audioCtxRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (status !== 'recording') return;
    const id = setInterval(() => setSeconds((now) => now + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  /** Pause ↔ resume. */
  const toggle = () => {
    const recorder = recorderRef.current;
    if (!recorder) return;
    if (status === 'recording') {
      recorder.pause();
      setLevels(SILENT);
      setStatus('paused');
    } else if (status === 'paused') {
      recorder.resume();
      setStatus('recording');
    }
  };

  /** Stop recording and release the mic; resolves with the audio (null if nothing captured). */
  const stop = (): Promise<Blob | null> => {
    const recorder = recorderRef.current;
    const release = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      void audioCtxRef.current?.close().catch(() => {});
      audioCtxRef.current = null;
    };
    setStatus('stopped');
    if (!recorder || recorder.state === 'inactive') {
      release();
      return Promise.resolve(null);
    }
    return new Promise((resolve) => {
      recorder.onstop = () => {
        release();
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        chunksRef.current = [];
        resolve(blob.size > 0 ? blob : null);
      };
      recorder.stop();
    });
  };

  return { status, seconds, levels, toggle, stop };
}
