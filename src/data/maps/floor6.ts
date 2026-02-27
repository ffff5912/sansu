import type { TileMap } from '../types.ts';

// 12x12 map for Floor 6: 面積のへいげん (Area Plains)
const raw = [
  '############',
  '#S...#...E.#',
  '#.##.#.###.#',
  '#..#.....#.#',
  '#.##.###.#.#',
  '#........#.#',
  '####.###.#.#',
  '#E.....#...#',
  '#.####.###.#',
  '#..#.......#',
  '#.##.###EBD#',
  '############',
];

export const floor6Map: TileMap = {
  width: 12,
  height: raw.length,
  tiles: raw.map(row =>
    row.split('') as import('../types.ts').TileChar[]
  ),
};
