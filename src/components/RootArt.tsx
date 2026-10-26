import { useState } from 'react';
import { specimenNo } from '../data';
import type { RootEntry } from '../data/types';
import { Plinth } from './Plinth';

export function RootArt({ root }: { root: RootEntry }) {
  const [missing, setMissing] = useState(false);
  const src = `${import.meta.env.BASE_URL}illustrations/${root.id}.webp`;
  const title = `${root.root} · ${root.titleEn}`;
  return (
    <div className="plate">
      {missing ? (
        <Plinth palette={root.palette} label={`${root.root} 的陶土基座，${root.meaningZh}`} />
      ) : (
        <img
          src={src}
          alt={root.artAlt}
          onError={() => setMissing(true)}
          decoding="async"
        />
      )}
      <p className="plate-title">{title}</p>
      <p className="plate-no">{specimenNo(root.id)}</p>
    </div>
  );
}
