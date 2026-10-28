import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { RootEntry } from '../data/types';
import { journeyTiming, PHOTO_MS, splitSurface, type JourneyMode } from '../lib/journey';

export function RootJourney({
  word,
  root,
  mode,
  onReveal,
  onDone,
}: {
  word: string;
  root: RootEntry;
  mode: JourneyMode;
  onReveal: () => void;
  onDone: () => void;
}) {
  const revealRef = useRef(onReveal);
  const doneRef = useRef(onDone);
  revealRef.current = onReveal;
  doneRef.current = onDone;
  const [fading, setFading] = useState(false);
  const timing = journeyTiming(mode);
  const parts = splitSurface(word, root);
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      revealRef.current();
      doneRef.current();
    };
    skipRef.current = finish;
    const revealAt = window.setTimeout(() => revealRef.current(), timing.riseAt);
    const fadeAt = window.setTimeout(() => setFading(true), timing.fadeAt);
    const doneAt = window.setTimeout(finish, timing.total);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      settled = true;
      window.clearTimeout(revealAt);
      window.clearTimeout(fadeAt);
      window.clearTimeout(doneAt);
      window.removeEventListener('keydown', onKey);
    };
  }, [timing.riseAt, timing.fadeAt, timing.total]);

  const style = {
    '--peel': `${timing.peel}ms`,
    '--route': `${timing.route}ms`,
    '--dest': `${timing.dest}ms`,
  } as CSSProperties;

  return (
    <div
      className={fading ? `journey ${mode} fading` : `journey ${mode}`}
      style={style}
      role="status"
      onClick={() => skipRef.current()}
    >
      <p className="journey-kicker">词根之旅</p>
      <p className="journey-word">
        <span className="pre">{parts.pre}</span>
        <span className="mid">{parts.mid}</span>
        <span className="post">{parts.post}</span>
      </p>
      <div className="journey-route" aria-hidden="true" />
      <p className="journey-dest">{root.root}</p>
      <p className="journey-gloss">{root.titleEn}</p>
      <button
        type="button"
        className="journey-skip"
        onClick={(e) => {
          e.stopPropagation();
          skipRef.current();
        }}
      >
        跳过
      </button>
      <span className="sr-only">
        {word} 走向词根 {root.root}。点一下或按 Escape 跳过。
      </span>
    </div>
  );
}

export function PhotoWord({
  src,
  word,
  onDone,
  onSkip,
}: {
  src: string;
  word: string;
  onDone: () => void;
  onSkip: () => void;
}) {
  const doneRef = useRef(onDone);
  const skipRef = useRef(onSkip);
  doneRef.current = onDone;
  skipRef.current = onSkip;

  useEffect(() => {
    const t = window.setTimeout(() => doneRef.current(), PHOTO_MS);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') skipRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="photo-morph" role="status" onClick={() => skipRef.current()}>
      <div className="morph-frame">
        <img src={src} alt="" />
        <p className="morph-word" aria-label={word}>
          {[...word].map((ch, i) => (
            <span key={`${ch}-${i}`} style={{ animationDelay: `${0.42 + i * 0.055}s` }}>
              {ch}
            </span>
          ))}
        </p>
        <p className="morph-note">演示 · 还没接上识图，这张照片先看成 {word}</p>
      </div>
      <button
        type="button"
        className="journey-skip"
        onClick={(e) => {
          e.stopPropagation();
          skipRef.current();
        }}
      >
        跳过
      </button>
    </div>
  );
}
