import type { TileMap, Position, Direction, TileChar } from '../data/types.ts';

const TILE_SIZE = 48;

export function getTile(map: TileMap, x: number, y: number): TileChar {
  if (y < 0 || y >= map.height || x < 0 || x >= map.width) return '#';
  return map.tiles[y][x];
}

export function isWalkable(tile: TileChar, doorOpen: boolean): boolean {
  if (tile === '#') return false;
  if (tile === 'D' && !doorOpen) return false;
  return true;
}

export function move(
  map: TileMap,
  pos: Position,
  dir: Direction,
  doorOpen: boolean,
): Position {
  const delta: Record<Direction, Position> = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };
  const d = delta[dir];
  const nx = pos.x + d.x;
  const ny = pos.y + d.y;
  const tile = getTile(map, nx, ny);
  if (!isWalkable(tile, doorOpen)) return pos;
  return { x: nx, y: ny };
}

export function findStart(map: TileMap): Position {
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      if (map.tiles[y][x] === 'S') return { x, y };
    }
  }
  return { x: 1, y: 1 };
}

export interface Camera {
  offsetX: number;
  offsetY: number;
}

export function computeCamera(
  playerPos: Position,
  mapWidth: number,
  mapHeight: number,
  viewWidth: number,
  viewHeight: number,
): Camera {
  const mapPxW = mapWidth * TILE_SIZE;
  const mapPxH = mapHeight * TILE_SIZE;

  let offsetX = viewWidth / 2 - (playerPos.x + 0.5) * TILE_SIZE;
  let offsetY = viewHeight / 2 - (playerPos.y + 0.5) * TILE_SIZE;

  // Clamp so we don't show outside the map
  if (mapPxW <= viewWidth) {
    offsetX = (viewWidth - mapPxW) / 2;
  } else {
    offsetX = Math.min(0, Math.max(viewWidth - mapPxW, offsetX));
  }
  if (mapPxH <= viewHeight) {
    offsetY = (viewHeight - mapPxH) / 2;
  } else {
    offsetY = Math.min(0, Math.max(viewHeight - mapPxH, offsetY));
  }

  return { offsetX, offsetY };
}

export function getEnemyKey(x: number, y: number): string {
  return `${x},${y}`;
}

export { TILE_SIZE };
