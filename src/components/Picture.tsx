import { useState } from 'react';

/** Lazy illustration with a cream blur that sharpens once the file is in. */
export function Picture({ src, alt }: { src: string; alt: string }) {
  const [ready, setReady] = useState(false);
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={ready ? 'sharp' : 'blurup'}
      onLoad={() => setReady(true)}
    />
  );
}
