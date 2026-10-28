import type { RootEntry } from '../data/types';
import { CardTitle } from './CardTitle';
import { Picture } from './Picture';

/** Illustration, or the cream plate that stands in until one is drawn. The title overlay is the same either way. */
export function RootFace({ root, thumb = false }: { root: RootEntry; thumb?: boolean }) {
  if (!root.illustrated) {
    return (
      <div className="cream-face" role="img" aria-label={`${root.root}，${root.titleEn}。插画还没画。`}>
        <CardTitle root={root.root} meaning={root.titleEn} />
      </div>
    );
  }
  const base = import.meta.env.BASE_URL;
  const src = `${base}${thumb ? 'thumbs' : 'illustrations'}/${root.id}.webp`;
  return (
    <>
      <Picture eager={!thumb} src={src} alt={thumb ? '' : root.artAlt} />
      <CardTitle root={root.root} meaning={root.titleEn} />
    </>
  );
}
