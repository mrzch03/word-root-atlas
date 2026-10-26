import { Component, lazy, Suspense, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { roots } from '../data';
import { Specimen } from '../components/Specimen';
import { useCollection } from '../lib/collection';
import { layoutBranches, type LeafSpot } from '../lib/treeLayout';
import { TreeFallback } from './TreeFallback';

const TreeScene = lazy(() => import('./TreeScene'));

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function TreeView() {
  const bag = useCollection();
  const webgl = useMemo(() => hasWebGL(), []);
  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );
  const branches = useMemo(() => layoutBranches(roots, bag.words), [bag.words]);
  const [hover, setHover] = useState<{ leaf: LeafSpot; x: number; y: number } | null>(null);
  const [active, setActive] = useState<LeafSpot | null>(null);

  useEffect(() => {
    document.title = '词根之树 · 词根图鉴';
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  function openLeaf(leaf: LeafSpot) {
    bag.collect(leaf.word, leaf.rootId);
    setActive(leaf);
  }

  const activeRoot = active ? roots.find((r) => r.id === active.rootId) : null;
  const activeLexeme = activeRoot?.words.find((w) => w.word === active?.word) ?? null;
  const empty = bag.count === 0;

  const fallback = <TreeFallback roots={roots} words={bag.words} onSelect={openLeaf} />;

  return (
    <div className="tree-page">
      <div className="tree-stage" aria-describedby="tree-help">
        <p id="tree-help" className="sr-only">
          拖动画面旋转词根之树。点一片叶，或用旁边的列表，打开卡片。颜色淡的叶还没有收集。
        </p>
        {webgl ? (
          <SceneBoundary fallback={fallback}>
            <Suspense fallback={<p className="stage-wait">树正在成形…</p>}>
              <TreeScene
                reduced={reduced}
                hovered={hover?.leaf.word ?? null}
                onSelect={openLeaf}
                onHover={(leaf, x, y) => {
                  if (!leaf || x == null || y == null) setHover(null);
                  else setHover({ leaf, x, y });
                }}
              />
            </Suspense>
          </SceneBoundary>
        ) : (
          fallback
        )}
        <div className="tree-caption">
          <p>{empty ? '一株幼苗' : `${bag.rootCount} 条枝 · ${bag.count} 片叶`}</p>
          <p>{webgl ? '拖动旋转' : '平面标本'}</p>
        </div>
        {empty && (
          <div className="tree-empty">
            <h1>树还是一株幼苗</h1>
            <p>每收下一条词，它就长出一片叶。同一个词根的词，会聚在同一根枝上。</p>
            <Link className="text-btn" to="/?word=benevolent">
              去发现 benevolent
            </Link>
          </div>
        )}
        {hover && (
          <div className="tip" style={{ left: hover.x + 14, top: hover.y + 14 }} role="status">
            <strong>{hover.leaf.word}</strong>
            <span>{hover.leaf.gloss}</span>
            <span className="tip-state">{hover.leaf.collected ? '已收集' : '未发现 · 点开收下'}</span>
          </div>
        )}
      </div>
      <aside className="tree-index" aria-label="叶片目录">
        <h2>叶片</h2>
        {branches.length === 0 && <p className="hint">收下第一个词之后，目录会出现在这里。</p>}
        {branches.map((branch) => (
          <section key={branch.rootId}>
            <h3>
              {branch.rootLabel}
              <span>{branch.meaningZh}</span>
            </h3>
            <ul>
              {branch.leaves.map((leaf) => (
                <li key={leaf.word}>
                  <button
                    type="button"
                    className={leaf.collected ? 'on' : 'ghost'}
                    onClick={() => openLeaf(leaf)}
                  >
                    {leaf.word}
                    <span>{leaf.gloss}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </aside>
      {active && activeRoot && (
        <div className="sheet-back" onClick={() => setActive(null)}>
          <div
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={active.word}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="sheet-close" onClick={() => setActive(null)} autoFocus>
              关闭
            </button>
            <Specimen
              stacked
              root={activeRoot}
              lexeme={activeLexeme}
              fresh={false}
              onPick={(word) => {
                const leaf = branches.flatMap((b) => b.leaves).find((l) => l.word === word);
                if (leaf) openLeaf(leaf);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
