export type Vec3 = [number, number, number];

interface BasePiece {
  id: string;
  /** Bottom-centre of the piece, in scene units. */
  at: Vec3;
  yaw?: number;
  /** Seconds after the plinth before this piece begins to arrive. */
  delay: number;
}

export interface BasinCut {
  /** Width of the harbour mouth. */
  w: number;
  /** How far the harbour cuts back from the +Z face. */
  d: number;
  /** Centre of the mouth, along X. */
  x?: number;
}

export interface PlinthPiece extends BasePiece {
  kind: 'plinth';
  w: number;
  h: number;
  d: number;
  /** Harbour bitten out of the +Z face. The lowest stratum stays solid, as the floor. */
  basin?: BasinCut;
}

export interface WaterPiece extends BasePiece {
  kind: 'water';
  w: number;
  h: number;
  d: number;
}

export interface BuildingPiece extends BasePiece {
  kind: 'building';
  w: number;
  h: number;
  d: number;
  arches?: number;
  windows?: number;
  roof?: 'flat' | 'tile';
  parapet?: boolean;
  steps?: number;
}

export interface BoatPiece extends BasePiece {
  kind: 'boat';
  scale?: number;
}

export interface AmphoraPiece extends BasePiece {
  kind: 'amphora';
  scale?: number;
}

export interface PalmPiece extends BasePiece {
  kind: 'palm';
  scale?: number;
}

export interface RockPiece extends BasePiece {
  kind: 'rock';
  scale?: number;
}

export interface FigurePiece extends BasePiece {
  kind: 'figure';
}

export interface DockPiece extends BasePiece {
  kind: 'dock';
  length: number;
  width?: number;
}

export type ScenePiece =
  | PlinthPiece
  | WaterPiece
  | BuildingPiece
  | BoatPiece
  | AmphoraPiece
  | PalmPiece
  | RockPiece
  | FigurePiece
  | DockPiece;

export interface DioramaScene {
  id: string;
  /** Where the camera looks, so the miniature sits in the middle of the card. */
  look: Vec3;
  pieces: ScenePiece[];
}
