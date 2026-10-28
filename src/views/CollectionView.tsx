import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type TransitionEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { roots, rootsByHue, sharesOrigin } from '../data';
import { rootColor } from '../data/rootColors';
import type { RootEntry } from '../data/types';
import { useCollection } from '../lib/collection';
import type { CollectedWord } from '../lib/storage';
import { RootFace } from '../components/RootFace';

type Sort = 'hue' | 'latin' | 'greek' | 'recent';

const SORTS: { id: Sort; label: string }[] = [
  { id: 'hue', label: '光谱' },
  { id: 'latin', label: '拉丁' },
  { id: 'greek', label: '希腊' },
  { id: 'recent', label: '最近' },
];

export function CollectionView() {
  const bag = useCollection();
  const navigate = useNavigate();
  const [sort, setSort] = useState<Sort>('hue');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );
  const [arrive, setArrive] = useState(!reduced);
  const deckRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const countRef = useRef(0);
  const leaving = useRef(false);
  const leavingDelta = useRef(0);
  const pending = useRef<number | null>(null);
  const fallback = useRef<number | null>(null);
  const suppress = useRef(false);
  const drag = useRef({ active: false, x: 0, t: 0, id: -1 });

  const ordered = useMemo(() => collectOrdered(sort, bag.words), [sort, bag.words]);
  const hueCollected = useMemo(
    () => rootsByHue().filter((root) => Object.values(bag.words).some((item) => item.rootId === root.id)),
    [bag.words],
  );
  const cards = useMemo(() => ordered.map((root) => decorate(root, bag.words)), [ordered, bag.words]);
  indexRef.current = index;
  countRef.current = cards.length;
  const safeIndex = cards.length === 0 ? 0 : Math.min(index, cards.length - 1);
  const front = cards[safeIndex];

  useEffect(() => {
    document.title = '图鉴 · 词根图鉴';
  }, []);

  useEffect(() => {
    if (!arrive) return;
    const t = window.setTimeout(() => setArrive(false), 760);
    return () => window.clearTimeout(t);
  }, [arrive]);

  useEffect(() => {
    setIndex(0);
    const el = deckRef.current;
    if (!el) return;
    el.dataset.dragging = 'true';
    el.style.setProperty('--drag', '0px');
    const id = requestAnimationFrame(() => {
      if (deckRef.current) deckRef.current.dataset.dragging = 'false';
    });
    return () => cancelAnimationFrame(id);
  }, [sort]);

  useLayoutEffect(() => {
    if (pending.current == null) return;
    pending.current = null;
    const el = deckRef.current;
    if (!el) return;
    el.dataset.dragging = 'true';
    el.style.setProperty('--drag', '0px');
    const id = requestAnimationFrame(() => {
      if (deckRef.current) deckRef.current.dataset.dragging = 'false';
    });
    return () => cancelAnimationFrame(id);
  }, [index]);

  function clearFallback() {
    if (fallback.current != null) window.clearTimeout(fallback.current);
    fallback.current = null;
  }

  function commit(delta: number) {
    pending.current = delta;
    setIndex((i) => {
      const n = countRef.current;
      if (n <= 0) return 0;
      return Math.max(0, Math.min(n - 1, i + delta));
    });
  }

  function startFly(delta: number) {
    const el = deckRef.current;
    const i = indexRef.current;
    const n = countRef.current;
    if (!el || leaving.current) return;
    if (i + delta < 0 || i + delta >= n) {
      el.dataset.dragging = 'false';
      requestAnimationFrame(() => {
        deckRef.current?.style.setProperty('--drag', '0px');
      });
      return;
    }
    if (reduced) {
      setIndex(i + delta);
      el.dataset.dragging = 'true';
      el.style.setProperty('--drag', '0px');
      requestAnimationFrame(() => {
        if (deckRef.current) deckRef.current.dataset.dragging = 'false';
      });
      return;
    }
    leaving.current = true;
    leavingDelta.current = delta;
    const dist = (delta > 0 ? -1 : 1) * Math.max(420, window.innerWidth * 0.72);
    el.dataset.dragging = 'false';
    requestAnimationFrame(() => {
      if (!deckRef.current || !leaving.current) return;
      deckRef.current.style.setProperty('--drag', `${dist}px`);
    });
    clearFallback();
    fallback.current = window.setTimeout(() => {
      if (!leaving.current) return;
      leaving.current = false;
      commit(delta);
    }, 560);
  }

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.button !== 0 || leaving.current) return;
    setArrive(false);
    drag.current = { active: true, x: e.clientX, t: performance.now(), id: e.pointerId };
    suppress.current = false;
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!drag.current.active || e.pointerId !== drag.current.id) return;
    let dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 8) {
      suppress.current = true;
      if (!e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.setPointerCapture(e.pointerId);
    }
    const i = indexRef.current;
    const n = countRef.current;
    if ((i <= 0 && dx > 0) || (i >= n - 1 && dx < 0)) dx *= 0.28;
    const el = deckRef.current;
    if (!el) return;
    el.dataset.dragging = 'true';
    el.style.setProperty('--drag', `${dx}px`);
  }

  function onPointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    if (!drag.current.active || e.pointerId !== drag.current.id) return;
    const dt = Math.max(1, performance.now() - drag.current.t);
    drag.current.active = false;
    const el = deckRef.current;
    if (!el) return;
    const dx = Number.parseFloat(el.style.getPropertyValue('--drag')) || 0;
    const v = dx / dt;
    const i = indexRef.current;
    const n = countRef.current;
    if (suppress.current && i < n - 1 && (dx < -72 || v < -0.55)) {
      startFly(1);
      return;
    }
    if (suppress.current && i > 0 && (dx > 72 || v > 0.55)) {
      startFly(-1);
      return;
    }
    el.dataset.dragging = 'false';
    requestAnimationFrame(() => {
      deckRef.current?.style.setProperty('--drag', '0px');
    });
  }

  function onTransitionEnd(e: TransitionEvent<HTMLDivElement>) {
    if (!leaving.current || e.propertyName !== 'transform') return;
    const place = (e.target as HTMLElement).getAttribute?.('data-place');
    if (place !== '0') return;
    leaving.current = false;
    clearFallback();
    commit(leavingDelta.current);
  }

  function guard(e: { preventDefault: () => void }) {
    if (!suppress.current) return;
    e.preventDefault();
    suppress.current = false;
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      startFly(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      startFly(-1);
    } else if (e.key === 'Enter' && front) {
      e.preventDefault();
      navigate(`/?word=${encodeURIComponent(front.word)}`);
    }
  }

  const places: number[] = [];
  if (front && safeIndex > 0) places.push(-1);
  if (front) places.push(0);
  if (front && safeIndex < cards.length - 1) places.push(1);
  if (front && safeIndex < cards.length - 2) places.push(2);

  return (
    <div className="collection">
      <header className="deck-head">
        <div>
          <h1>图鉴</h1>
          <p className="count-line">
            已发现 {bag.rootCount} / {roots.length}
          </p>
        </div>
        {bag.rootCount > 0 && (
          <div className="deck-tools">
            <button
              type="button"
              className="filter-btn"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((open) => !open)}
            >
              筛选{sort === 'hue' ? '' : ` · ${SORTS.find((item) => item.id === sort)?.label ?? ''}`}
            </button>
            {filtersOpen && (
              <div className="segment" role="tablist" aria-label="排序">
                {SORTS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={sort === item.id}
                    className={sort === item.id ? 'active' : ''}
                    onClick={() => setSort(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      {bag.rootCount === 0 ? (
        <div className="deck-stage">
          <div className="album-empty">
            <h2>图鉴还是空白的</h2>
            <p>去发现里试一个词。第一张卡片会落在这里。</p>
            <Link className="chip" to="/?word=transport&play=1">
              试试 transport
            </Link>
          </div>
        </div>
      ) : (
        <>
          {hueCollected.length > 0 && (
            <div className="spectrum" aria-hidden="true">
              {hueCollected.map((root) => (
                <i
                  key={root.id}
                  className={front && root.id === front.root.id ? 'on here' : 'on'}
                  style={{ background: rootColor(root.id).accent }}
                />
              ))}
            </div>
          )}
          {cards.length === 0 ? (
            <div className="deck-stage">
              <div className="album-empty">
                <h2>这一页还没有卡片</h2>
                <p>换一个筛选，或者回到发现。</p>
              </div>
            </div>
          ) : (
            front && (
              <>
                <div className="deck-stage">
                  <div
                    className={arrive ? 'deck arrive' : 'deck'}
                    data-single={cards.length < 2 ? 'true' : 'false'}
                    data-dragging="false"
                    ref={deckRef}
                    tabIndex={0}
                    role="group"
                    aria-roledescription="可滑动的卡片"
                    aria-label={`第 ${safeIndex + 1} 张，共 ${cards.length} 张，${front.root.root}，${front.word}。左右方向键翻看，回车打开。`}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                    onTransitionEnd={onTransitionEnd}
                    onKeyDown={onKeyDown}
                  >
                    {places.map((place) => {
                      const card = cards[safeIndex + place];
                      if (!card) return null;
                      const color = rootColor(card.root.id);
                      const style = { '--deep': color.deep, '--accent': color.accent } as CSSProperties;
                      const label = `${card.root.root}，${card.root.titleEn}，${card.word}`;
                      return (
                        <article key={card.root.id} className="deck-card" data-place={place} style={style}>
                          {place === 0 ? (
                            <Link
                              className="deck-face"
                              to={`/?word=${encodeURIComponent(card.word)}`}
                              aria-label={label}
                              onClick={guard}
                            >
                              <RootFace root={card.root} />
                            </Link>
                          ) : (
                            <button
                              type="button"
                              className="deck-face"
                              tabIndex={-1}
                              aria-label={place < 0 ? `上一张 ${card.root.root}` : `下一张 ${card.root.root}`}
                              onClick={(e) => {
                                if (suppress.current) {
                                  e.preventDefault();
                                  suppress.current = false;
                                  return;
                                }
                                startFly(place > 0 ? 1 : -1);
                              }}
                            >
                              <RootFace root={card.root} thumb />
                            </button>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </div>
                <p className="deck-caption" aria-live="polite">
                  <span className="deck-word">{front.word}</span>
                  <span className="deck-meta">
                    {front.owned}/{front.total} 词
                  </span>
                </p>
                {cards.length > 1 && (
                  <p className="deck-hint">
                    {safeIndex + 1} / {cards.length} · 左右滑动
                  </p>
                )}
              </>
            )
          )}
        </>
      )}
    </div>
  );
}

function collectOrdered(sort: Sort, words: Record<string, CollectedWord>) {
  const owned = new Set(Object.values(words).map((item) => item.rootId));
  const hue = rootsByHue().filter((root) => owned.has(root.id));
  if (sort === 'latin') return hue.filter((root) => sharesOrigin(root, 'Latin'));
  if (sort === 'greek') return hue.filter((root) => sharesOrigin(root, 'Greek'));
  if (sort === 'recent') {
    const latest = new Map<string, number>();
    for (const item of Object.values(words)) {
      const prev = latest.get(item.rootId) ?? 0;
      if (item.at > prev) latest.set(item.rootId, item.at);
    }
    return [...hue].sort((a, b) => (latest.get(b.id) ?? 0) - (latest.get(a.id) ?? 0));
  }
  return hue;
}

function decorate(root: RootEntry, words: Record<string, CollectedWord>) {
  let word = root.words[0]?.word ?? root.root;
  let at = -1;
  let owned = 0;
  for (const lexeme of root.words) {
    const item = words[lexeme.word.toLowerCase()];
    if (!item) continue;
    owned += 1;
    if (item.at >= at) {
      at = item.at;
      word = lexeme.word;
    }
  }
  return { root, word, owned, total: root.words.length };
}
