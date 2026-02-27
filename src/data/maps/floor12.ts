import type { TileMap } from '../types.ts';

// 12x12 map for Floor 12: 立体のてんくう (3D Shape Sky)
const raw = [
  '############',
  '#S...#.E...#',
  '#.##.#.###.#',
  '#..#.......#',
  '#.##.####.##',
  '#..........#',
  '#.####.###.#',
  '#.#..E...#.#',
  '#.#.####.#.#',
  '#..........#',
  '#.####E#.BD#',
  '############',
];

export const floor12Map: TileMap = {
  width: 12,
  height: raw.length,
  tiles: raw.map(row =>
    row.split('') as import('../types.ts').TileChar[]
  ),
};
