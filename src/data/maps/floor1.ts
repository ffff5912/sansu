import type { TileMap } from '../types.ts';

// 12x10 map for Floor 1: 大きな数のどうくつ
// # = wall, . = floor, S = start, D = door, E = enemy, B = boss, C = chest
const raw = [
  '############',
  '#S...#.....#',
  '#.##.#.###.#',
  '#.#E.....#.#',
  '#.####.#.#.#',
  '#......#E#.#',
  '#.##.###.#.#',
  '#..#.E.....#',
  '#.##.###.#B#',
  '######.#.#D#',
  '######...###',
  '############',
];

export const floor1Map: TileMap = {
  width: 12,
  height: raw.length,
  tiles: raw.map(row =>
    row.split('') as import('../types.ts').TileChar[]
  ),
};
