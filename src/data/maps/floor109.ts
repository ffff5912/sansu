import type { TileMap } from '../types.ts';

const raw = [
  '##########',
  '#S...E...#',
  '#.##.###.#',
  '#....E.#.#',
  '#.#.##...#',
  '#.#....#.#',
  '#...##.#.#',
  '#.#E.....#',
  '#.###.##B#',
  '####....D#',
  '####..####',
  '##########',
];

export const floor109Map: TileMap = {
  width: 10,
  height: raw.length,
  tiles: raw.map(row => row.split('') as import('../types.ts').TileChar[]),
};
