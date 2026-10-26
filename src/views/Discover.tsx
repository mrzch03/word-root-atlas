import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { atlas } from '../data';
import { Specimen } from '../components/Specimen';
import { useCollection } from '../lib/collection';
import { EXAMPLE_WORDS, lookup } from '../lib/match';

export function Discover() {
  const [params, setParams] = useSearchParams();
  const query = params.get('word') ?? '';
  const [draft, setDraft] = useState(query);
  const bag = useCollection();
  const { collect } = bag;

  useEffect(() => {
    setDraft(query);
  }, [query]);

  useEffect(() => {
    document.title = query ? `${query} · 词根图鉴` : '词根图鉴';
  }, [query]);

  useEffect(() => {
    const input = document.getElementById('word-search');
    if (input instanceof HTMLInputElement && window.matchMedia('(pointer: fine)').matches && !query) {
      input.focus();
    }
  }, [query]);

  useEffect(() => {
    if (!query) return;
    const found = lookup(query);
    if (found.kind === 'word') collect(found.hit.word, found.hit.root.id);
  }, [query, collect]);

  const result = query ? lookup(query) : null;

  useEffect(() => {
    if (!query || !window.matchMedia('(max-width: 860px)').matches) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('result')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }, [query]);

  function submit(value: string) {
    const next = value.trim();
    if (!next) return;
    setParams(next ? { word: next } : {});
  }

  return (
    <div className="discover">
      <form
        className={result ? 'search compact' : 'search'}
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submit(draft);
        }}
      >
        <label htmlFor="word-search">
          <span className="kicker">发现</span>
          <span className="search-title">输入一个英文单词</span>
        </label>
        <div className="search-row">
          <input
            id="word-search"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="例如 transport"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="search"
            aria-describedby="search-hint"
          />
          <button type="submit">查看</button>
        </div>
        <p id="search-hint" className="sr-only">
          按回车查看。大小写不限。
        </p>
        <div className="examples">
          <span>例如</span>
          {EXAMPLE_WORDS.map((word) => (
            <button key={word} type="button" onClick={() => submit(word)}>
              {word}
            </button>
          ))}
        </div>
      </form>

      <div className="result" id="result" aria-live="polite">
        {result?.kind === 'word' && (
          <Specimen
            key={result.hit.word}
            root={result.hit.root}
            lexeme={result.hit.lexeme}
            fresh={isFresh(bag.words[result.hit.word.toLowerCase()]?.at)}
            onPick={(word) => submit(word)}
          />
        )}
        {result?.kind === 'root' && (
          <Specimen root={result.root} lexeme={null} onPick={(word) => submit(word)} />
        )}
        {result?.kind === 'miss' && <Miss query={query} suggestions={result.suggestions} onPick={(w) => submit(w)} />}
        {!result && bag.count > 0 && <Recent />}
      </div>
      </div>
  );
}

function isFresh(at?: number) {
  return typeof at === 'number' && Date.now() - at < 15000;
}

function Miss({
  query,
  suggestions,
  onPick,
}: {
  query: string;
  suggestions: { word: string; lexeme: { gloss: string }; root: { root: string; meaningZh: string } }[];
  onPick: (word: string) => void;
}) {
  return (
    <section className="empty rise">
      <p className="kicker">未收录</p>
      <h2>图鉴里还没有「{query}」</h2>
      <p>它可能只是还没被收进这本离线词库。可以从相近的词开始，或点一个例子。</p>
      {suggestions.length > 0 && (
        <ul className="suggest">
          {suggestions.map((s) => (
            <li key={s.word}>
              <button type="button" onClick={() => onPick(s.word)}>
                <strong>{s.word}</strong>
                <span>
                  {s.lexeme.gloss} · {s.root.root} {s.root.meaningZh}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Recent() {
  const bag = useCollection();
  const recent = Object.values(bag.words)
    .sort((a, b) => b.at - a.at)
    .slice(0, 4);
  if (recent.length === 0) return null;
  return (
    <section className="recent">
      <h2>最近收下</h2>
      <ul>
        {recent.map((item) => {
          const root = atlas.byId.get(item.rootId);
          return (
            <li key={item.word}>
              <Link to={`/?word=${encodeURIComponent(item.word)}`}>
                {item.word}
                <span>{root?.meaningZh}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
