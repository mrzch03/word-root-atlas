import raw from './catalog.json';

export interface OriginRecord {
  id: string;
  originStory: string;
  uncertainty?: string;
  sources: string[];
}

interface CatalogStory {
  id: string;
  originStory: string;
  uncertainty?: string;
  sources?: string[];
}

const byId = new Map(
  ((raw as { roots: CatalogStory[] }).roots).map((story) => [
    story.id,
    {
      id: story.id,
      originStory: story.originStory,
      uncertainty: story.uncertainty,
      sources: story.sources ?? [],
    } satisfies OriginRecord,
  ]),
);

export function originStory(id: string): OriginRecord | undefined {
  return byId.get(id);
}

/** A short label for a source URL: the site, then the headword. */
export function sourceLabel(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    const site = host.startsWith('logeion.')
      ? 'logeion'
      : host.replace(/^en\./, '').replace(/\.(org|com|edu)$/, '');
    const tail = decodeURIComponent(parsed.pathname.split('/').filter(Boolean).pop() ?? '');
    const word = tail.replace(/#.*/, '').replace(/_/g, ' ');
    if (!word || word.length > 42) return site;
    return `${site} · ${word}`;
  } catch {
    return url;
  }
}
