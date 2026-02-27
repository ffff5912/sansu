import type { TileMap } from '../types.ts';

// 12x12 map for Floor 4: 小数のみずうみ (Decimal Lake)
const raw = [
  '############',
  '#S.....#...#',
  '#.####.#.#.#',
  '#....#.#E#.#',
  '####.#.#.#.#',
  '#....#...#.#',
  '#.##.###.#.#',
  '#..#E......#',
  '#.##.####..#',
  '#..........#',
  '#.####E#.BD#',
  '############',
];

export const floor4Map: TileMap = {
  width: 12,
  height: raw.length,
  tiles: raw.map(row =>
    row.split('') as import('../types.ts').TileChar[]
  ),
};
