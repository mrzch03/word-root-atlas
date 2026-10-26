import { palettes } from '../data/palettes';
import type { PaletteName } from '../data/types';

function project(x: number, y: number, z: number): [number, number] {
  const ox = 176;
  const oy = 318;
  const s = 1.05;
  return [ox + (x - z) * 0.866 * s, oy + (x + z) * 0.5 * s - y * s];
}

function face(pts: [number, number, number][]) {
  return (
    pts
      .map((p, i) => {
        const [x, y] = project(p[0], p[1], p[2]);
        return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ') + ' Z'
  );
}

/** Matte isometric plinth used until a root's diorama raster arrives. */
export function Plinth({ palette, label }: { palette: PaletteName; label: string }) {
  const ink = palettes[palette];
  const w = 62;
  const d = 58;
  const bands = [0, 8, 16, 26];
  const bandFill = [ink.deep, ink.soil, ink.mid];
  return (
    <svg className="plinth" viewBox="0 0 300 400" role="img" aria-label={label}>
      <ellipse cx="168" cy="318" rx="78" ry="18" fill="#cfc3b2" opacity="0.45" />
      {bandFill.map((color, i) => {
        const y0 = bands[i];
        const y1 = bands[i + 1];
        return (
          <g key={color}>
            <path
              d={face([
                [-w, y0, d],
                [w, y0, d],
                [w, y1, d],
                [-w, y1, d],
              ])}
              fill={color}
              opacity={0.92}
            />
            <path
              d={face([
                [w, y0, d],
                [w, y0, -d],
                [w, y1, -d],
                [w, y1, d],
              ])}
              fill={color}
              opacity={0.72}
            />
          </g>
        );
      })}
      <path
        d={face([
          [-w, 34, -d],
          [w, 34, -d],
          [w, 34, d],
          [-w, 34, d],
        ])}
        fill="#f4efe4"
      />
      <path d={face([[-16, 26, -14], [-2, 26, -14], [-2, 26, 2], [-16, 26, 2]])} fill={ink.wash} />
      <path d={face([[-16, 26, 2], [-2, 26, 2], [-2, 48, 2], [-16, 48, 2]])} fill={ink.mid} />
      <path d={face([[-2, 26, 2], [-2, 26, -14], [-2, 48, -14], [-2, 48, 2]])} fill={ink.deep} opacity="0.9" />
      <path d={face([[-16, 48, -14], [-2, 48, -14], [-2, 48, 2], [-16, 48, 2]])} fill="#f6f1e6" />
      <ellipse cx={project(-9, 48, -6)[0]} cy={project(-9, 48, -6)[1] - 10} rx="7" ry="4" fill={ink.mid} />
      <ellipse cx={project(-9, 48, -6)[0]} cy={project(-9, 48, -6)[1] - 16} rx="5" ry="7" fill={ink.deep} />
    </svg>
  );
}
