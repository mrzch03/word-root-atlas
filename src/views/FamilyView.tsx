import { useEffect, useState, type CSSProperties } from 'react';
import { specimenNo } from '../data';
import { rootColor } from '../data/rootColors';
import type { Lexeme, RootEntry } from '../data/types';
import { useCollection } from '../lib/collection';
import { splitSurface } from '../lib/journey';
import { CardTitle } from '../components/CardTitle';
import { Picture } from '../components/Picture';
import { originStory, sourceLabel } from '../data/stories';

export function CardStage({ root, ceremony }: { root: RootEntry; ceremony: 'A' | 'B' | null }) {
  const base = import.meta.env.BASE_URL;
  const intro = ceremony === 'A' ? 'stage intro' : ceremony === 'B' ? 'stage sheen' : 'stage';
  return (
    <div className={intro}>
      <div className="plate">
        <Picture eager src={`${base}illustrations/${root.id}.webp`} alt={root.artAlt} />
        <CardTitle root={root.root} meaning={root.titleEn} />
      </div>
    </div>
  );
}

export function FamilyReading({
  root,
  lexeme,
  ceremony,
  fromJourney,
  onPick,
}: {
  root: RootEntry;
  lexeme: Lexeme | null;
  ceremony: 'A' | 'B' | null;
  fromJourney: boolean;
  onPick: (word: string) => void;
}) {
  const bag = useCollection();
  const color = rootColor(root.id);
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pending = ceremony === 'B' && lexeme ? lexeme.word : null;
  const [pendingWord, setPendingWord] = useState(pending);
  const [landed, setLanded] = useState(pending == null);
  if (pending !== pendingWord) {
    setPendingWord(pending);
    setLanded(pending == null);
  }
  const parts = lexeme ? splitSurface(lexeme.word, root) : null;
  const freshWord = pending;
  const held = (word: string) => bag.has(word) && !(freshWord === word && !landed);
  const found = root.words.filter((w) => held(w.word)).length;
  const origin = originStory(root.id);

  useEffect(() => {
    setLanded(ceremony !== 'B');
    if (ceremony !== 'B') return;
    const wait = reduced ? 0 : fromJourney ? 180 : 650;
    const t = window.setTimeout(() => setLanded(true), wait);
    return () => window.clearTimeout(t);
  }, [ceremony, lexeme?.word, reduced, fromJourney]);

  useEffect(() => {
    if (ceremony !== 'B' || fromJourney || reduced || !lexeme) return;
    const input = document.getElementById('word-search');
    const slot = document.querySelector(`[data-slot="${CSS.escape(lexeme.word)}"]`);
    if (!(input instanceof HTMLInputElement) || !(slot instanceof HTMLElement)) return;
    const from = input.getBoundingClientRect();
    const to = slot.getBoundingClientRect();
    const inputCss = getComputedStyle(input);
    const padL = Number.parseFloat(inputCss.paddingLeft) || 0;
    const startSize = Number.parseFloat(inputCss.fontSize) || 18;
    const endSize = 15;
    const scale = endSize / startSize;
    const fly = document.createElement('span');
    fly.className = 'fly';
    fly.dataset.fly = lexeme.word;
    fly.textContent = lexeme.word;
    fly.style.fontSize = `${startSize}px`;
    fly.style.fontFamily = inputCss.fontFamily;
    fly.style.color = color.deep;
    document.body.appendChild(fly);
    const wordWidth = fly.offsetWidth;
    const wordHeight = fly.offsetHeight;
    const sx = from.left + padL;
    const sy = from.top + (from.height - wordHeight) / 2;
    const ex = to.left + (to.width - wordWidth * scale) / 2;
    const ey = to.top + (to.height - wordHeight * scale) / 2;
    const dx = ex - sx;
    const dy = ey - sy;
    const arc = Math.min(28, Math.max(16, Math.abs(dy) * 0.22));
    const over = 0.03;
    fly.animate(
      [
        { transform: `translate(${sx}px, ${sy}px) scale(1)`, offset: 0 },
        {
          transform: `translate(${sx + dx * 0.55}px, ${sy + dy * 0.48 - arc}px) scale(${1 + (scale - 1) * 0.55})`,
          offset: 0.58,
        },
        {
          transform: `translate(${ex + dx * over}px, ${ey + dy * over}px) scale(${scale * 1.03})`,
          offset: 0.86,
        },
        { transform: `translate(${ex}px, ${ey}px) scale(${scale})`, offset: 1 },
      ],
      { duration: 650, easing: 'linear', fill: 'forwards' },
    );
    const done = window.setTimeout(() => fly.remove(), 660);
    return () => {
      window.clearTimeout(done);
      fly.remove();
    };
  }, [ceremony, fromJourney, lexeme, color.deep, reduced]);

  const style = {
    '--accent': color.accent,
    '--deep': color.deep,
    '--wash': color.wash,
  } as CSSProperties;

  return (
    <div className={ceremony === 'A' && !reduced ? 'reading settle' : 'reading'} style={style}>
      <h1 className="word" id="specimen-word">
        {parts ? (
          <>
            {parts.pre}
            <em>{parts.mid}</em>
            {parts.post}
          </>
        ) : (
          root.root
        )}
      </h1>
      <p className="meaning" lang="zh-CN">
        {lexeme ? lexeme.gloss : root.meaningZh}
      </p>
      {lexeme && (
        <p className="parts" aria-label="词素拆分">
          {lexeme.parts.map((p, i) => (
            <span key={p.form + i}>
              {i > 0 && <span className="plus"> + </span>}
              <em>{p.form}</em> {p.gloss}
            </span>
          ))}
        </p>
      )}
      {origin ? (
        <section className="origin" lang="zh-CN">
          <h2>词源故事</h2>
          <p className="essay">{origin.originStory}</p>
          {origin.uncertainty ? <p className="hedge">{origin.uncertainty}</p> : null}
          <ul className="sources">
            {origin.sources.map((url) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noreferrer">
                  {sourceLabel(url)}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="story" lang="zh-CN">
          {root.story}
        </p>
      )}
      {lexeme && (
        <figure className="example">
          <blockquote>{lexeme.example}</blockquote>
          <p lang="zh-CN">{lexeme.exampleZh}</p>
        </figure>
      )}
      <h2 className="pills-label">同根词</h2>
      <div className="pills">
        {root.words.map((word) => {
          const arriving = freshWord === word.word;
          const shown = held(word.word);
          return (
            <button
              key={word.word}
              type="button"
              data-slot={word.word}
              className={shown ? (arriving ? 'pill on land' : 'pill on') : 'pill'}
              aria-current={lexeme?.word === word.word ? 'true' : undefined}
              onClick={() => onPick(word.word)}
            >
              {word.word}
            </button>
          );
        })}
        <span className={ceremony === 'B' && landed ? 'count tick' : 'count'}>
          {found}/{root.words.length}
        </span>
      </div>
      <p className="caption">No. {specimenNo(root.id)}</p>
    </div>
  );
}
