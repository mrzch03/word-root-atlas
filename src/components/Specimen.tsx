import { Link } from 'react-router-dom';
import { originZh } from '../data';
import type { Lexeme, RootEntry } from '../data/types';
import { useCollection } from '../lib/collection';
import { RootArt } from './RootArt';

export function Specimen({
  root,
  lexeme,
  fresh,
  stacked,
  onPick,
}: {
  root: RootEntry;
  lexeme: Lexeme | null;
  fresh?: boolean;
  stacked?: boolean;
  onPick: (word: string) => void;
}) {
  const bag = useCollection();
  const found = root.words.filter((w) => bag.has(w.word)).length;
  return (
    <article className={stacked ? 'specimen stack rise' : 'specimen rise'} aria-labelledby="specimen-word">
      <RootArt root={root} />
      <div className="specimen-body">
        <p className="meta">
          <span>
            {originZh(root.origin)} · {root.lemma}
          </span>
          <span>
            {root.meaningZh} · {root.meaningEn}
          </span>
        </p>
        {lexeme ? (
          <>
            <h2 id="specimen-word" className="word">
              {lexeme.word}
            </h2>
            <p className="gloss">
              <span className="pos">{lexeme.pos}</span>
              {lexeme.gloss}
            </p>
            <p className="parts" aria-label="词素拆分">
              {lexeme.parts.map((p, i) => (
                <span key={p.form + i} className="part">
                  {i > 0 && <span className="plus">+</span>}
                  <span className="part-form">{p.form}</span>
                  <span className="part-gloss">{p.gloss}</span>
                </span>
              ))}
            </p>
          </>
        ) : (
          <h2 id="specimen-word" className="word word-root">
            {root.root}
          </h2>
        )}
        <p className="story">{root.story}</p>
        {lexeme && (
          <figure className="example">
            <figcaption>例句</figcaption>
            <blockquote>{lexeme.example}</blockquote>
            <p>{lexeme.exampleZh}</p>
          </figure>
        )}
        <div className="siblings">
          <div className="siblings-head">
            <h3>同根</h3>
            <p>
              {found} / {root.words.length} 已收集
            </p>
          </div>
          <ul>
            {root.words.map((word) => {
              const on = bag.has(word.word);
              const current = lexeme?.word === word.word;
              return (
                <li key={word.word}>
                  <button
                    type="button"
                    className={on ? 'sib on' : 'sib ghost'}
                    aria-pressed={on}
                    aria-current={current ? 'true' : undefined}
                    onClick={() => onPick(word.word)}
                  >
                    <LeafMark filled={on} />
                    <span className="sib-word">{word.word}</span>
                    <span className="sib-gloss">{word.gloss}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        {lexeme && (
          <p className="next-step">
            {fresh ? '新叶已经长上这一枝。' : '它已经在图鉴里。'}
            <Link to="/tree">去看词根之树</Link>
          </p>
        )}
        {!lexeme && <p className="next-step">这是词根本身。点一个同根词，收下那张卡片。</p>}
      </div>
    </article>
  );
}

function LeafMark({ filled }: { filled: boolean }) {
  return (
    <svg className="leaf-mark" viewBox="0 0 16 20" aria-hidden="true">
      <path
        d="M8 18 C8 18 2 12 2 7.5 C2 4 4.6 2 8 2 C11.4 2 14 4 14 7.5 C14 12 8 18 8 18 Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}
