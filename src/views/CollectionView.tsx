import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RootArt } from '../components/RootArt';
import { collectedRootsInOrder, useCollection } from '../lib/collection';

export function CollectionView() {
  const bag = useCollection();
  const groups = collectedRootsInOrder(bag.words);

  useEffect(() => {
    document.title = '图鉴 · 词根图鉴';
  }, []);

  if (bag.count === 0) {
    return (
      <section className="empty page-empty">
        <p className="kicker">图鉴</p>
        <h1>还没有卡片</h1>
        <p>查到的词会按词根排在这里。同一条根上的词，是同一枝的叶子。</p>
        <Link className="text-btn" to="/?word=transport">
          从 transport 开始
        </Link>
      </section>
    );
  }

  return (
    <div className="collection">
      <header className="page-head">
        <p className="kicker">图鉴</p>
        <h1>
          {bag.count} 张卡片 · {bag.rootCount} 条词根
        </h1>
      </header>
      {groups.map((root) => {
        const owned = root.words.filter((w) => bag.has(w.word));
        const left = root.words.length - owned.length;
        return (
          <section key={root.id} className="family" aria-labelledby={`fam-${root.id}`}>
            <header>
              <h2 id={`fam-${root.id}`}>{root.root}</h2>
              <p>
                {root.meaningZh}
                {left > 0 ? ` · 还有 ${left} 个同根词未发现` : ' · 这一枝已集齐'}
              </p>
            </header>
            <ul className="atlas-grid">
              {owned.map((word) => (
                <li key={word.word}>
                  <Link className="mini" to={`/?word=${encodeURIComponent(word.word)}`}>
                    <RootArt root={root} />
                    <span className="mini-word">{word.word}</span>
                    <span className="mini-gloss">{word.gloss}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
