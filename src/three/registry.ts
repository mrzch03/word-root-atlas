/**
 * Procedural miniatures are parked. The card is the illustration.
 * A later pass can load baked GLB assets without turning this back on.
 */
export const PROCEDURAL_SCENES = false;

/** Roots that have a real geometry scene. The other cards stay photographs. */
export function hasScene(id: string): boolean {
  if (!PROCEDURAL_SCENES) return false;
  return id === 'port';
}
