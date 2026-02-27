import type { TileMap } from '../types.ts';

// 12x12 map for Floor 10: そろばんのやま (Abacus Mountain)
const raw = [
  '############',
  '#S.#.....E.#',
  '#.##.####..#',
  '#..........#',
  '#.####.###.#',
  '#.#......#.#',
  '#.#.####.#.#',
  '#E.....#...#',
  '##.###.###.#',
  '#........#.#',
  '#.####E..BD#',
  '############',
];

export const floor10Map: TileMap = {
  width: 12,
  height: raw.length,
  tiles: raw.map(row =>
    row.split('') as import('../types.ts').TileChar[]
  ),
};
