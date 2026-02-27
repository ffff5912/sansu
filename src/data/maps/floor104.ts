import type { TileMap } from '../types.ts';

// 10x10 map for Floor 104: くりあがりのおか
const raw = [
  '##########',
  '#S.......#',
  '#.##.##..#',
  '#..#..#E.#',
  '#.##.###.#',
  '#....#...#',
  '#.##.#.#E#',
  '#.#....#.#',
  '#.#.##.#.#',
  '#......#B#',
  '##.###.#D#',
  '##.....###',
  '##########',
];

export const floor104Map: TileMap = {
  width: 10,
  height: raw.length,
  tiles: raw.map(row =>
    row.split('') as import('../types.ts').TileChar[]
  ),
};
