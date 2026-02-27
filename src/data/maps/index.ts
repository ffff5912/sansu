import type { TileMap } from '../types.ts';
import { floor1Map } from './floor1.ts';
import { floor2Map } from './floor2.ts';
import { floor3Map } from './floor3.ts';
import { floor4Map } from './floor4.ts';
import { floor5Map } from './floor5.ts';
import { floor6Map } from './floor6.ts';
import { floor7Map } from './floor7.ts';
import { floor8Map } from './floor8.ts';
import { floor9Map } from './floor9.ts';
import { floor10Map } from './floor10.ts';
import { floor11Map } from './floor11.ts';
import { floor12Map } from './floor12.ts';

const maps: Record<number, TileMap> = {
  1: floor1Map,
  2: floor2Map,
  3: floor3Map,
  4: floor4Map,
  5: floor5Map,
  6: floor6Map,
  7: floor7Map,
  8: floor8Map,
  9: floor9Map,
  10: floor10Map,
  11: floor11Map,
  12: floor12Map,
};

export function getMap(floorId: number): TileMap | undefined {
  return maps[floorId];
}
