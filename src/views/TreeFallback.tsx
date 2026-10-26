import { layoutBranches, type LeafSpot } from '../lib/treeLayout';
import type { RootEntry } from '../data/types';
import type { CollectedWord } from '../lib/storage';

function proj(x: number, y: number, z: number) {
  return { x: 210 + x * 48 - z * 16, y: 540 - y * 96 };
}

export function TreeFallback({
  roots,
  words,
  onSelect,
}: {
  roots: RootEntry[];
  words: Record<string, CollectedWord>;
  onSelect: (leaf: LeafSpot) => void;
}) {
  const branches = layoutBranches(roots, words);
  return (
    <div className="fallback">
      <p className="fallback-note">此设备没有可用的 WebGL，改为平面标本图。点一片叶打开卡片。</p>
      <svg viewBox="0 0 420 580" role="img" aria-label="词根之树的平面标本图">
        <ellipse cx="210" cy="548" rx="90" ry="14" fill="#d9cfc0" />
        <path d="M210 540 C206 420 200 280 198 150" fill="none" stroke="#7a5b48" strokeWidth="10" strokeLinecap="round" />
        <path d="M198 150 C196 110 194 86 192 70" fill="none" stroke="#7a5b48" strokeWidth="4" strokeLinecap="round" />
        {branches.map((branch) => {
          const [a, b, c] = branch.points.map((p) => proj(p[0], p[1], p[2]));
          return (
            <g key={branch.rootId}>
              <path
                d={`M${a.x} ${a.y} Q${b.x} ${b.y} ${c.x} ${c.y}`}
                fill="none"
                stroke="#7a5b48"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {branch.leaves.map((leaf) => {
                const p = proj(leaf.x, leaf.y, leaf.z);
                return (
                  <g key={leaf.word} className="svg-leaf" onClick={() => onSelect(leaf)}>
                    <ellipse
                      cx={p.x}
                      cy={p.y}
                      rx={leaf.collected ? 7 : 5}
                      ry={leaf.collected ? 11 : 8}
                      fill={leaf.collected ? branch.color : '#cbb9a4'}
                      opacity={leaf.collected ? 1 : 0.85}
                    />
                    <text x={p.x + 10} y={p.y + 3} fontSize="9">
                      {leaf.word}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
