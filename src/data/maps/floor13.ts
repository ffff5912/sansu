import type { TileMap } from '../types.ts';

const raw = [
  '############',
  '#S.........#',
  '#.###.####.#',
  '#.#E.....#.#',
  '#.#.####.#.#',
  '#........#.#',
  '#.####.#E..#',
  '#....#.#.#.#',
  '#.##.#...#.#',
  '#.##.###.#B#',
  '#........#D#',
  '############',
];

export const floor13Map: TileMap = {
  width: 12,
  height: raw.length,
  tiles: raw.map(row => row.split('') as import('../types.ts').TileChar[]),
};
