import type { TileMap } from '../types.ts';

// 10x10 map for Floor 103: ひきざんのかわ
const raw = [
  '##########',
  '#S..#....#',
  '#.#.#.##.#',
  '#.#E..#..#',
  '#.####.#.#',
  '#......#.#',
  '#.##.###.#',
  '#.#..E...#',
  '#.####.#B#',
  '#......#D#',
  '##########',
];

export const floor103Map: TileMap = {
  width: 10,
  height: raw.length,
  tiles: raw.map(row =>
    row.split('') as import('../types.ts').TileChar[]
  ),
};
