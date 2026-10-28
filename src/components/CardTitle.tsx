/** Poster title, set in type because the illustration no longer bakes it in. */
export function CardTitle({ root, meaning }: { root: string; meaning: string }) {
  return (
    <div className="card-title">
      <p className="root-name">{root}</p>
      <p className="root-gloss">{meaning}</p>
    </div>
  );
}
