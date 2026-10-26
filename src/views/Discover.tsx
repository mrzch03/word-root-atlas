import { useEffect, useState, type CSSProperties } from 'react';
import { useSearchParams } from 'react-router-dom';
import { rootColor } from '../data/rootColors';
import { FamilyView } from './FamilyView';
import { useCollection } from '../lib/collection';
import { loadCollection } from '../lib/storage';
import { EXAMPLE_WORDS, lookup } from '../lib/match';
import { playRoot } from '../lib/sound';

const HINTS = ['transport', 'biology', 'spectator'];

export function Discover() {
  const [params, setParams] = useSearchParams();
  const query = params.get('word') ?? '';
  const [draft, setDraft] = useState(query);
  const { collect } = useCollection();
  const [ceremony, setCeremony] = useState<'A' | 'B' | null>(null);

  useEffect(() => {
    setDraft(query);
  }, [query]);

  useEffect(() => {
    document.title = query ? `${query} · 词根图鉴` : '词根图鉴';
  }, [query]);

  useEffect(() => {
    const input = document.getElementById('word-search');
    if (input instanceof HTMLInputElement && !query && window.matchMedia('(pointer: fine)').matches) {
      input.focus();
    }
  }, [query]);

  useEffect(() => {
    if (!query) {
      setCeremony(null);
      return;
    }
    const found = lookup(query);
    if (found.kind !== 'word') {
      setCeremony(null);
      return;
    }
    const word = found.hit.word;
    const rootId = found.hit.root.id;
    const prior = loadCollection();
    const hadWord = !!prior[word.toLowerCase()];
    const hadRoot = Object.values(prior).some((item) => item.rootId === rootId);
    const stampKey = `wra-new:${word.toLowerCase()}`;
    if (!hadWord) {
      const kind = hadRoot ? 'B' : 'A';
      const already = sessionStorage.getItem(stampKey);
      sessionStorage.setItem(stampKey, `${kind}:${Date.now()}`);
      collect(word, rootId);
      setCeremony(kind);
      if (kind === 'A' && !already) playRoot(rootId);
      return;
    }
    const raw = sessionStorage.getItem(stampKey);
    if (raw) {
      const [kind, t] = raw.split(':');
      if ((kind === 'A' || kind === 'B') && Date.now() - Number(t) < 2500) {
        setCeremony(kind);
        return;
      }
    }
    setCeremony(null);
  }, [query, collect]);

  const result = query ? lookup(query) : null;

  function submit(value: string) {
    const next = value.trim();
    if (!next) return;
    setParams({ word: next });
  }

  const shownRoot = result?.kind === 'word' ? result.hit.root : result?.kind === 'root' ? result.root : null;
  const sky = shownRoot ? rootColor(shownRoot.id) : null;

  return (
    <div
      className={sky ? 'discover washed' : 'discover'}
      style={sky ? ({ '--sky-top': sky.skyTop, '--sky-bottom': sky.skyBottom } as CSSProperties) : undefined}
    >
      <form
        className={result ? 'search compact' : 'search hero'}
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submit(draft);
        }}
      >
        <label className="sr-only" htmlFor="word-search">
          输入一个英文单词
        </label>
        <input
          id="word-search"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="type any English word…"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
          aria-describedby="search-hint"
        />
        {!result && (
          <p id="search-hint" className="hint-row">
            试试
            {HINTS.map((word) => (
              <button key={word} type="button" onClick={() => submit(word)}>
                {word}
              </button>
            ))}
          </p>
        )}
        <p id="search-hint-sr" className="sr-only">
          按回车查看。试试 {EXAMPLE_WORDS.join('、')}。
        </p>
      </form>

      <div id="result">
        {result?.kind === 'word' && (
          <FamilyView
            key={result.hit.word}
            root={result.hit.root}
            lexeme={result.hit.lexeme}
            ceremony={ceremony}
            onPick={submit}
          />
        )}
        {result?.kind === 'root' && (
          <FamilyView root={result.root} lexeme={null} ceremony={null} onPick={submit} />
        )}
        {result?.kind === 'miss' && <Miss query={query} suggestions={result.suggestions} onPick={submit} />}
      </div>
    </div>
  );
}

function Miss({
  query,
  suggestions,
  onPick,
}: {
  query: string;
  suggestions: { word: string; lexeme: { gloss: string }; root: { root: string } }[];
  onPick: (word: string) => void;
}) {
  return (
    <section className="miss">
      <h1>这个词的词根还没收进图鉴</h1>
      <p>「{query}」不在这本离线词库里。</p>
      {suggestions.length > 0 && (
        <ul>
          {suggestions.slice(0, 3).map((s) => (
            <li key={s.word}>
              <button type="button" onClick={() => onPick(s.word)}>
                <strong>{s.word}</strong>
                <span>
                  {s.lexeme.gloss} · {s.root.root}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
