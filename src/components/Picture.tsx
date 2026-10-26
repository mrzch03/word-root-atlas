import { useEffect, useRef, useState } from 'react';

/** Illustration with a cream blur that sharpens once the file is in. */
export function Picture({ src, alt, eager = false }: { src: string; alt: string; eager?: boolean }) {
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    setReady(false);
    const img = ref.current;
    if (img?.complete && img.naturalWidth > 0) setReady(true);
  }, [src]);
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      className={ready ? 'sharp' : 'blurup'}
      onLoad={() => setReady(true)}
    />
  );
}
