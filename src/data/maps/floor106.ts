import type { TileMap } from '../types.ts';

// 10x12 map for Floor 106: とけいのしろ
const raw = [
  '##########',
  '#S.......#',
  '#.####.#.#',
  '#.#..E.#.#',
  '#.#.####.#',
  '#........#',
  '#.##.###.#',
  '#.#....#E#',
  '#.#.##.#.#',
  '#....#...#',
  '#.##.#.#B#',
  '####...#D#',
  '##########',
];

export const floor106Map: TileMap = {
  width: 10,
  height: raw.length,
  tiles: raw.map(row =>
    row.split('') as import('../types.ts').TileChar[]
  ),
};
