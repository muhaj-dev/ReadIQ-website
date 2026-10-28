'use client';

import { type ReactNode, useEffect, useRef } from 'react';

import { HOSTS, type PodcastTurn } from '@/types/podcast';

import { HostTurn } from './host-turn';

type Props = {
  turns: PodcastTurn[];
  activeIndex: number;
  /** Auto-scroll only while playing, so reading ahead isn't yanked back. */
  follow: boolean;
  onSeek: (index: number) => void;
  /** The episode header, scrolled with the turns. */
  header: ReactNode;
};

/** The conversation; keeps the active turn comfortably in view as playback advances. */
export function PodcastTranscript({ turns, activeIndex, follow, onSeek, header }: Props) {
  const items = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!follow) return;
    items.current[activeIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [activeIndex, follow]);

  return (
    <div>
      {header}
      <div className="grid gap-4">
        {turns.map((turn, i) => (
          <HostTurn
            key={i}
            ref={(el) => {
              items.current[i] = el;
            }}
            speaker={turn.speaker}
            name={HOSTS[turn.speaker]}
            text={turn.text}
            active={i === activeIndex}
            onClick={() => onSeek(i)}
          />
        ))}
      </div>
    </div>
  );
}
