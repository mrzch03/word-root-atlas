import { Component, lazy, Suspense, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { specimenNo } from '../data';
import { rootColor } from '../data/rootColors';
import type { Lexeme, RootEntry } from '../data/types';
import { useCollection } from '../lib/collection';
import { Picture } from '../components/Picture';
import { hasScene } from '../three/registry';

const DioramaCard = lazy(() => import('../components/DioramaCard'));

class QuietBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function splitWord(word: string, root: RootEntry) {
  const forms = [root.root, ...root.forms].map((s) => s.toLowerCase()).sort((a, b) => b.length - a.length);
  const lower = word.toLowerCase();
  for (const form of forms) {
    const at = lower.indexOf(form);
    if (at >= 0 && form.length >= 2) {
      return {
        pre: word.slice(0, at),
        mid: word.slice(at, at + form.length),
        post: word.slice(at + form.length),
      };
    }
  }
  return { pre: word, mid: '', post: '' };
}

export function FamilyView({
  root,
  lexeme,
  ceremony,
  onPick,
}: {
  root: RootEntry;
  lexeme: Lexeme | null;
  ceremony: 'A' | 'B' | null;
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
  const [webgl, setWebgl] = useState(false);
  const base = import.meta.env.BASE_URL;
  const parts = lexeme ? splitWord(lexeme.word, root) : null;
  const freshWord = pending;
  const held = (word: string) => bag.has(word) && !(freshWord === word && !landed);
  const found = root.words.filter((w) => held(w.word)).length;

  useEffect(() => {
    setLanded(ceremony !== 'B');
    if (ceremony !== 'B') return;
    const t = window.setTimeout(() => setLanded(true), reduced ? 0 : 650);
    return () => window.clearTimeout(t);
  }, [ceremony, lexeme?.word, reduced]);

  useEffect(() => {
    if (ceremony !== 'B' || reduced || !lexeme) return;
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
  }, [ceremony, lexeme, color.deep, reduced]);

  const style = {
    '--accent': color.accent,
    '--deep': color.deep,
    '--wash': color.wash,
    '--spark': color.spark,
    '--sky-top': color.skyTop,
    '--sky-bottom': color.skyBottom,
  } as CSSProperties;

  return (
    <section className={ceremony === 'A' ? 'family intro-a' : ceremony === 'B' ? 'family intro-b' : 'family'} style={style}>
      <div className="constellation">
        <div className={ceremony === 'A' ? 'slot intro' : 'slot'}>
          <div className={webgl ? 'plate ready' : ceremony === 'A' ? 'plate intro' : 'plate'}>
            <Picture src={`${base}illustrations/${root.id}.webp`} alt={root.artAlt} />
            {!reduced && hasScene(root.id) && (
              <QuietBoundary fallback={null}>
                <Suspense fallback={null}>
                  <DioramaCard rootId={root.id} intro={ceremony === 'A'} />
                </Suspense>
              </QuietBoundary>
            )}
          </div>
        </div>
        <p className="ring-count">
          <span className={ceremony === 'B' && landed ? 'count tick' : 'count'}>
            {found}/{root.words.length}
          </span>
        </p>
        {root.words.map((word, i) => {
          const arriving = freshWord === word.word;
          const shown = held(word.word);
          const n = root.words.length;
          const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
          return (
            <button
              key={word.word}
              type="button"
              data-slot={word.word}
              className={shown ? (arriving ? 'tag on land' : 'tag on') : 'tag'}
              data-state={shown ? 'filled' : 'empty'}
              aria-current={lexeme?.word === word.word ? 'true' : undefined}
              style={{ left: `${50 + Math.cos(angle) * 42}%`, top: `${50 + Math.sin(angle) * 46}%` }}
              onClick={() => onPick(word.word)}
            >
              {word.word}
            </button>
          );
        })}
      </div>
      <div className={ceremony === 'A' && !reduced ? 'reading settle' : 'reading'}>
        <p className="eyebrow">{root.origin === 'Latin' ? '拉丁语词根' : '希腊语词根'}</p>
        <p className={ceremony === 'A' && !reduced ? 'root-kicker settle' : 'root-kicker'}>
          {root.root} · {root.titleEn}
        </p>
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
        <p className="story" lang="zh-CN">
          {root.story}
        </p>
        {lexeme && (
          <figure className="example">
            <blockquote>{lexeme.example}</blockquote>
            <p lang="zh-CN">{lexeme.exampleZh}</p>
          </figure>
        )}
        {lexeme && (
          <p className="belongs">
            <span className="pip-row" aria-hidden="true">
              {root.words.map((w) => (
                <i key={w.word} className={held(w.word) ? 'on' : ''} />
              ))}
            </span>
            <span className={ceremony === 'B' && landed ? 'count tick' : 'count'}>
              {found}/{root.words.length}
            </span>
            <span className="belongs-line">
              属于词根 <em>{root.root}</em> · {root.meaningZh}
            </span>
          </p>
        )}
        <p className="caption">No. {specimenNo(root.id)}</p>
      </div>
      <WebglWatch onReady={() => setWebgl(true)} />
    </section>
  );
}

function WebglWatch({ onReady }: { onReady: () => void }) {
  const saved = useRef(onReady);
  saved.current = onReady;
  useEffect(() => {
    const ready = () => {
      const node = document.querySelector('.diorama');
      return node instanceof HTMLElement && node.dataset.ready === 'true';
    };
    if (ready()) {
      saved.current();
      return;
    }
    const obs = new MutationObserver(() => {
      if (ready()) {
        saved.current();
        obs.disconnect();
      }
    });
    const host = document.getElementById('result') ?? document.body;
    obs.observe(host, { subtree: true, attributes: true, childList: true });
    return () => obs.disconnect();
  }, []);
  return null;
}
