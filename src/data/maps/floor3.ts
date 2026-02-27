import type { TileMap } from '../types.ts';

// 12x12 map for Floor 3: 角度のとう (Angle Tower)
const raw = [
  '############',
  '#S...#.....#',
  '###.##.###.#',
  '#.......#E.#',
  '#.###.###..#',
  '#E..#......#',
  '#.#.#.####.#',
  '#.#........#',
  '#.####.##.##',
  '#......#.E.#',
  '#.####.#.BD#',
  '############',
];

export const floor3Map: TileMap = {
  width: 12,
  height: raw.length,
  tiles: raw.map(row =>
    row.split('') as import('../types.ts').TileChar[]
  ),
};
