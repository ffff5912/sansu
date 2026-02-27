import type { TileMap } from '../types.ts';

// 12x12 map for Floor 7: 分数のどうくつ (Fraction Cave)
const raw = [
  '############',
  '#S.#.......#',
  '#.##.####.##',
  '#........E.#',
  '#.####.###.#',
  '#.#..#.....#',
  '#.#.E#.###.#',
  '#.#..#...#.#',
  '#.##.###.#.#',
  '#........#.#',
  '#.###E.#.BD#',
  '############',
];

export const floor7Map: TileMap = {
  width: 12,
  height: raw.length,
  tiles: raw.map(row =>
    row.split('') as import('../types.ts').TileChar[]
  ),
};
