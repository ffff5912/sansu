import type { TileMap } from '../types.ts';

// 12x12 map for Floor 11: 変わり方のラボ (Relationship Lab)
const raw = [
  '############',
  '#S.........#',
  '#.##.####.##',
  '#.#E.#.....#',
  '#.#..#.###.#',
  '#....#...#.#',
  '####.###.#.#',
  '#......E.#.#',
  '#.####.###.#',
  '#....#.E...#',
  '#.##.####BD#',
  '############',
];

export const floor11Map: TileMap = {
  width: 12,
  height: raw.length,
  tiles: raw.map(row =>
    row.split('') as import('../types.ts').TileChar[]
  ),
};
