import type { TileMap } from '../types.ts';
import { floor1Map } from './floor1.ts';

const maps: Record<number, TileMap> = {
  1: floor1Map,
};

export function getMap(floorId: number): TileMap | undefined {
  return maps[floorId];
}
