import type { RootColor } from '../../data/rootColors';

/** Content colours for a miniature. UI chrome stays cream; these are the object. */
export interface KitPalette {
  plaster: string;
  plasterShade: string;
  roof: string;
  opening: string;
  sea: string;
  seaDeep: string;
  sail: string;
  hull: string;
  keel: string;
  clay: string;
  sand: string;
  stone: string;
  soil: string;
  deck: string;
  leaf: string;
  trunk: string;
  wood: string;
  skin: string;
  cloth: string;
}

export function paletteFrom(color: RootColor): KitPalette {
  return {
    plaster: '#FBF7F1',
    plasterShade: '#E8E0D2',
    roof: '#E15B34',
    opening: '#2A5560',
    sea: '#14B7D6',
    seaDeep: '#075E78',
    sail: '#FF4E12',
    hull: '#F7F3EA',
    keel: '#1A7590',
    clay: '#D45332',
    sand: '#E6B84A',
    stone: '#D4C6B0',
    soil: '#D14E2C',
    deck: '#E9C56A',
    leaf: '#1EAE52',
    trunk: '#8A5230',
    wood: '#C99555',
    skin: '#F0C8A4',
    cloth: color.deep,
  };
}
