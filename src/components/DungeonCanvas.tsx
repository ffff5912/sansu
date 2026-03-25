import { useRef, useEffect } from 'react';
import type { TileMap, Position, TileChar } from '../data/types.ts';
import { TILE_SIZE, computeCamera, getEnemyKey } from '../lib/gameEngine.ts';

interface DungeonCanvasProps {
  map: TileMap;
  playerPos: Position;
  defeatedEnemies: Set<string>;
  doorOpen: boolean;
}

const COLORS: Record<string, string> = {
  wall: '#b8c4e0',
  wallLine: '#9aa8c8',
  floor: '#e8eeff',
  floorAlt: '#dfe6f6',
  start: '#e8eeff',
  door: '#cda06d',
  doorOpen: '#38d9a9',
  chest: '#ffd700',
  outside: '#c8d4f0',
};

const ENEMY_EMOJI = '🐾';
const BOSS_EMOJI = '👑';
const PLAYER_EMOJI = '🧒';
const CHEST_EMOJI = '🎁';
const DOOR_LOCKED_EMOJI = '🚪';
const DOOR_OPEN_EMOJI = '🚪';

function drawTile(
  ctx: CanvasRenderingContext2D,
  tile: TileChar,
  x: number,
  y: number,
  defeated: boolean,
  doorOpen: boolean,
) {
  const px = x * TILE_SIZE;
  const py = y * TILE_SIZE;

  // Background
  if (tile === '#') {
    ctx.fillStyle = COLORS.wall;
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    // brick pattern
    ctx.strokeStyle = COLORS.wallLine;
    ctx.lineWidth = 1;
    ctx.strokeRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE / 2 - 1);
    ctx.strokeRect(px + TILE_SIZE / 4, py + TILE_SIZE / 2, TILE_SIZE - 2, TILE_SIZE / 2 - 1);
    return;
  }

  // Floor
  const isAlt = (x + y) % 2 === 0;
  ctx.fillStyle = isAlt ? COLORS.floorAlt : COLORS.floor;
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  // Grid line
  ctx.strokeStyle = 'rgba(0,0,0,0.04)';
  ctx.lineWidth = 0.5;
  ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);

  const cx = px + TILE_SIZE / 2;
  const cy = py + TILE_SIZE / 2;

  ctx.font = `${TILE_SIZE * 0.6}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (tile === 'E' && !defeated) {
    ctx.fillText(ENEMY_EMOJI, cx, cy);
  } else if (tile === 'B' && !defeated) {
    ctx.fillText(BOSS_EMOJI, cx, cy);
  } else if (tile === 'D') {
    if (doorOpen) {
      ctx.fillStyle = COLORS.doorOpen;
      ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
      ctx.fillText(DOOR_OPEN_EMOJI, cx, cy);
    } else {
      ctx.fillStyle = COLORS.door;
      ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
      ctx.fillText(DOOR_LOCKED_EMOJI, cx, cy);
    }
  } else if (tile === 'C') {
    ctx.fillText(CHEST_EMOJI, cx, cy);
  }
}

export default function DungeonCanvas({
  map,
  playerPos,
  defeatedEnemies,
  doorOpen,
}: DungeonCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const viewW = container.clientWidth;
    const viewH = container.clientHeight;

    canvas.width = viewW * dpr;
    canvas.height = viewH * dpr;
    canvas.style.width = `${viewW}px`;
    canvas.style.height = `${viewH}px`;

    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Clear
    ctx.fillStyle = COLORS.outside;
    ctx.fillRect(0, 0, viewW, viewH);

    // Camera
    const cam = computeCamera(playerPos, map.width, map.height, viewW, viewH);
    ctx.save();
    ctx.translate(cam.offsetX, cam.offsetY);

    // Draw tiles
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const defeated = defeatedEnemies.has(getEnemyKey(x, y));
        drawTile(ctx, map.tiles[y][x], x, y, defeated, doorOpen);
      }
    }

    // Draw player
    const ppx = playerPos.x * TILE_SIZE + TILE_SIZE / 2;
    const ppy = playerPos.y * TILE_SIZE + TILE_SIZE / 2;
    ctx.font = `${TILE_SIZE * 0.7}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(PLAYER_EMOJI, ppx, ppy);

    ctx.restore();
  }, [map, playerPos, defeatedEnemies, doorOpen]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', overflow: 'hidden' }}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}
