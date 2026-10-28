export type Origin = 'Latin' | 'Greek';

export interface Morpheme {
  form: string;
  gloss: string;
}

export interface Lexeme {
  word: string;
  gloss: string;
  pos: string;
  parts: Morpheme[];
  example: string;
  exampleZh: string;
  /** Extra surface forms, e.g. British spelling. */
  also?: string[];
}

export interface RootEntry {
  id: string;
  /** Display form of the root, usually the same as id. */
  root: string;
  /** Forms that should open this family when typed, e.g. spect / spec. */
  forms: string[];
  /** Short English phrase for the poster: "to carry". */
  titleEn: string;
  meaningEn: string;
  meaningZh: string;
  origin: Origin;
  /** Dictionary headword, with macrons where they help. */
  lemma: string;
  /** One or two sentences. */
  story: string;
  /** Alt text for the diorama, whether or not the raster has arrived. */
  artAlt: string;
  words: Lexeme[];
}
