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
  pebble: string;
  leaf: string;
  trunk: string;
  wood: string;
  skin: string;
  cloth: string;
}

export function paletteFrom(color: RootColor): KitPalette {
  return {
    plaster: '#F8F3E9',
    plasterShade: '#D8D0C3',
    roof: '#A66855',
    opening: '#20373B',
    sea: '#249CB4',
    seaDeep: '#075062',
    sail: '#DF6C42',
    hull: '#EFEBE2',
    keel: '#1D565F',
    clay: '#A66855',
    sand: '#BEA784',
    stone: '#CCC3B5',
    soil: '#AD806F',
    deck: '#E8E1CD',
    pebble: '#A89D8E',
    leaf: '#417843',
    trunk: '#8A5230',
    wood: '#AF8A63',
    skin: '#F0C8A4',
    cloth: color.deep,
  };
}
