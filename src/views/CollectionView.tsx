import { useEffect, useMemo, useState, type CSSProperties, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { roots, rootsByHue } from '../data';
import { rootColor } from '../data/rootColors';
import type { RootEntry } from '../data/types';
import { useCollection } from '../lib/collection';
import { CardTitle } from '../components/CardTitle';
import { Picture } from '../components/Picture';

type Sort = 'hue' | 'latin' | 'greek' | 'recent';

export function CollectionView() {
  const bag = useCollection();
  const [sort, setSort] = useState<Sort>('hue');
  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useEffect(() => {
    document.title = '图鉴 · 词根图鉴';
  }, []);

  useEffect(() => {
    if (reduced) return;
    const el = document.querySelector('.collection');
    if (!(el instanceof HTMLElement)) return;
    const onOri = (e: DeviceOrientationEvent) => {
      const x = Math.max(-4, Math.min(4, ((e.beta ?? 40) - 40) / 14));
      const y = Math.max(-4, Math.min(4, (e.gamma ?? 0) / 14));
      el.style.setProperty('--dev-x', `${(-x).toFixed(2)}deg`);
      el.style.setProperty('--dev-y', `${y.toFixed(2)}deg`);
    };
    window.addEventListener('deviceorientation', onOri);
    return () => window.removeEventListener('deviceorientation', onOri);
  }, [reduced]);

  const ordered = useMemo(() => orderRoots(sort, bag.words), [sort, bag.words]);
  const hueOrder = useMemo(() => rootsByHue(), []);

  return (
    <div className="collection">
      <header className="page-head">
        <div>
          <h1>图鉴</h1>
          <p className="count-line">
            {bag.rootCount} / {roots.length}
          </p>
        </div>
        <div className="segment" role="tablist" aria-label="排序">
          {(
            [
              ['hue', '光谱'],
              ['latin', '拉丁'],
              ['greek', '希腊'],
              ['recent', '最近'],
            ] as const
          ).map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={sort === id} className={sort === id ? 'active' : ''} onClick={() => setSort(id)}>
              {label}
            </button>
          ))}
        </div>
      </header>
      <div className="spectrum" aria-hidden="true">
        {hueOrder.map((root) => {
          const on = root.words.some((w) => bag.has(w.word));
          const color = rootColor(root.id);
          return <i key={root.id} className={on ? 'on' : ''} style={on ? { background: color.accent } : undefined} />;
        })}
      </div>
      <ul className="album">
        {ordered.map((root) => (
          <li key={root.id}>
            <AlbumCard root={root} reduced={reduced} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function orderRoots(sort: Sort, words: ReturnType<typeof useCollection>['words']) {
  if (sort === 'latin') return roots.filter((r) => r.origin === 'Latin');
  if (sort === 'greek') return roots.filter((r) => r.origin === 'Greek');
  if (sort === 'recent') {
    const latest = new Map<string, number>();
    for (const item of Object.values(words)) {
      const prev = latest.get(item.rootId) ?? 0;
      if (item.at > prev) latest.set(item.rootId, item.at);
    }
    return rootsByHue()
      .filter((r) => latest.has(r.id))
      .sort((a, b) => (latest.get(b.id) ?? 0) - (latest.get(a.id) ?? 0));
  }
  return rootsByHue();
}

function AlbumCard({ root, reduced }: { root: RootEntry; reduced: boolean }) {
  const bag = useCollection();
  const color = rootColor(root.id);
  const owned = root.words.filter((w) => bag.has(w.word));
  const complete = owned.length === root.words.length;
  const style = {
    '--accent': color.accent,
    '--deep': color.deep,
    '--wash': color.wash,
    '--spark': color.spark,
  } as CSSProperties;
  const latest = owned.reduce<(typeof owned)[number] | null>((best, word) => {
    if (!best) return word;
    const at = bag.words[word.word.toLowerCase()]?.at ?? 0;
    const bestAt = bag.words[best.word.toLowerCase()]?.at ?? 0;
    return at >= bestAt ? word : best;
  }, null);

  function move(e: PointerEvent<HTMLElement>) {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty('--rx', `${(-py * 6).toFixed(2)}deg`);
    e.currentTarget.style.setProperty('--ry', `${(px * 6).toFixed(2)}deg`);
    e.currentTarget.style.setProperty('--sheen', `${(50 + px * 80).toFixed(1)}%`);
  }
  function leave(e: PointerEvent<HTMLElement>) {
    e.currentTarget.style.removeProperty('--rx');
    e.currentTarget.style.removeProperty('--ry');
    e.currentTarget.style.removeProperty('--sheen');
  }

  if (!latest) {
    return (
      <div className="tilt-card blank" style={style}>
        <div className="thumb ghost">
          <span>{root.root}</span>
        </div>
      </div>
    );
  }

  return (
    <Link
      className={complete ? 'tilt-card complete' : 'tilt-card'}
      style={style}
      to={`/?word=${encodeURIComponent(latest.word)}`}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      <div className="thumb">
        <Picture src={`${import.meta.env.BASE_URL}thumbs/${root.id}.webp`} alt={root.artAlt} />
        <CardTitle root={root.root} meaning={root.titleEn} />
        <span className="sheen" />
      </div>
      <span className="album-word">{latest.word}</span>
      <span className="album-count">
        {owned.length}/{root.words.length} 词
      </span>
    </Link>
  );
}
