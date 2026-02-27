import type { TileMap } from '../types.ts';

// 12x12 map for Floor 2: わり算のもり (Division Forest)
const raw = [
  '############',
  '#S.........#',
  '#.####.###.#',
  '#.#..E...#.#',
  '#.#.####.#.#',
  '#...#..#...#',
  '#.###.E#.###',
  '#.#........#',
  '#.#.###.##.#',
  '#.....E..#B#',
  '#.######.#D#',
  '############',
];

export const floor2Map: TileMap = {
  width: 12,
  height: raw.length,
  tiles: raw.map(row =>
    row.split('') as import('../types.ts').TileChar[]
  ),
};
