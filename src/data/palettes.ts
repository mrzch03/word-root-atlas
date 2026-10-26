import type { PaletteName } from './types';

export interface Palette {
  wash: string;
  mid: string;
  deep: string;
  leaf: string;
  soil: string;
}

export const palettes: Record<PaletteName, Palette> = {
  clay: { wash: '#e7d2c4', mid: '#b5694e', deep: '#6e3b32', leaf: '#a15c48', soil: '#8d6a52' },
  moss: { wash: '#d5ddd0', mid: '#5f6b52', deep: '#2f3a2e', leaf: '#738468', soil: '#6d6452' },
  sea: { wash: '#d4e0dc', mid: '#5e7d78', deep: '#2c3d3c', leaf: '#6d8f89', soil: '#6a6458' },
  dusk: { wash: '#ddd8e2', mid: '#5c5a72', deep: '#2e3144', leaf: '#6e6c86', soil: '#6a625c' },
  ochre: { wash: '#efe2c6', mid: '#b5894a', deep: '#5c4324', leaf: '#c4a36a', soil: '#8a7048' },
  ink: { wash: '#e4e0d8', mid: '#4e4a44', deep: '#242220', leaf: '#6b6560', soil: '#5c534a' },
  plum: { wash: '#eadfdc', mid: '#8d5d62', deep: '#4a3036', leaf: '#a9787c', soil: '#7a655c' },
  slate: { wash: '#dce2e4', mid: '#5d6b73', deep: '#2c3840', leaf: '#7d8c94', soil: '#6a645c' },
};
