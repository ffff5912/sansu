import { useRef, useEffect } from 'react';
import { BUILDINGS } from '../data/buildings.ts';

interface VillageCanvasProps {
  builtIds: string[];
  onTapBuilding: (id: string) => void;
}

// Village grid: 5 columns x 5 rows, each cell = 80px
const CELL = 80;
const COLS = 5;
const ROWS = 5;
const W = COLS * CELL;
const H = ROWS * CELL;

interface NPC {
  x: number;
  y: number;
  dx: number;
  dy: number;
  emoji: string;
  speed: number;
}

const NPC_EMOJIS = ['🧒', '👧', '🧑', '👩', '🐕', '🐈'];

function createNPCs(count: number): NPC[] {
  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.3 + Math.random() * 0.4;
    return {
      x: 40 + Math.random() * (W - 80),
      y: 40 + Math.random() * (H - 80),
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      emoji: NPC_EMOJIS[Math.floor(Math.random() * NPC_EMOJIS.length)],
      speed,
    };
  });
}

function drawVillage(
  ctx: CanvasRenderingContext2D,
  builtIds: string[],
  npcs: NPC[],
  dpr: number,
  viewW: number,
  viewH: number,
) {
  const scaleX = viewW / W;
  const scaleY = viewH / H;
  const scale = Math.min(scaleX, scaleY);
  const offX = (viewW - W * scale) / 2;
  const offY = (viewH - H * scale) / 2;

  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * offX, dpr * offY);

  // Sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#87CEEB');
  sky.addColorStop(0.4, '#B0E0F8');
  sky.addColorStop(1, '#7CCD7C');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Grass tiles
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const px = x * CELL;
      const py = y * CELL;
      const isLight = (x + y) % 2 === 0;
      ctx.fillStyle = isLight ? '#8FD88F' : '#7CCF7C';
      ctx.fillRect(px, py, CELL, CELL);
    }
  }

  // Paths (cross pattern through center)
  ctx.fillStyle = '#D4C4A0';
  // Horizontal path
  ctx.fillRect(0, 2 * CELL + 28, W, 24);
  // Vertical path
  ctx.fillRect(2 * CELL + 28, 0, 24, H);

  // Path stones
  ctx.fillStyle = '#C4B48A';
  for (let i = 0; i < W; i += 20) {
    ctx.fillRect(i + 2, 2 * CELL + 30, 8, 8);
  }
  for (let i = 0; i < H; i += 20) {
    ctx.fillRect(2 * CELL + 30, i + 2, 8, 8);
  }

  // Trees decorating empty spots
  const treeSpots = [
    { x: 1, y: 0 }, { x: 3, y: 0 },
    { x: 1, y: 2 }, { x: 3, y: 2 },
  ];
  for (const spot of treeSpots) {
    const hasBuilding = BUILDINGS.some(b => b.gridX === spot.x && b.gridY === spot.y && builtIds.includes(b.id));
    if (!hasBuilding) {
      const tx = spot.x * CELL + CELL / 2;
      const ty = spot.y * CELL + CELL / 2;
      ctx.font = `${CELL * 0.5}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🌳', tx, ty);
    }
  }

  // Buildings
  for (const building of BUILDINGS) {
    const bx = building.gridX * CELL;
    const by = building.gridY * CELL;
    const cx = bx + CELL / 2;
    const cy = by + CELL / 2;

    if (builtIds.includes(building.id)) {
      // Built: draw building
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.beginPath();
      ctx.ellipse(cx, by + CELL - 8, CELL * 0.35, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Building emoji
      ctx.font = `${CELL * 0.55}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(building.emoji, cx, cy - 4);

      // Name label
      ctx.font = `bold ${9}px "Zen Maru Gothic", sans-serif`;
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.strokeText(building.name, cx, by + CELL - 16);
      ctx.fillText(building.name, cx, by + CELL - 16);
    } else {
      // Not built: show construction site
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(bx + 10, by + 10, CELL - 20, CELL - 20);
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(bx + 10, by + 10, CELL - 20, CELL - 20);
      ctx.setLineDash([]);

      ctx.font = `${CELL * 0.35}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🔨', cx, cy - 4);

      ctx.font = `bold ${8}px "Zen Maru Gothic", sans-serif`;
      ctx.fillStyle = '#888';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(`${building.cost}G`, cx, by + CELL - 16);
    }
  }

  // NPCs
  for (const npc of npcs) {
    ctx.font = `${20}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(npc.emoji, npc.x, npc.y);
  }
}

export default function VillageCanvas({ builtIds, onTapBuilding }: VillageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const npcsRef = useRef<NPC[]>(createNPCs(5));
  const animRef = useRef<number>(0);

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
    const npcs = npcsRef.current;

    const animate = () => {
      // Update NPCs
      for (const npc of npcs) {
        npc.x += npc.dx;
        npc.y += npc.dy;
        // Bounce off edges
        if (npc.x < 10 || npc.x > W - 10) { npc.dx *= -1; npc.x = Math.max(10, Math.min(W - 10, npc.x)); }
        if (npc.y < 10 || npc.y > H - 10) { npc.dy *= -1; npc.y = Math.max(10, Math.min(H - 10, npc.y)); }
        // Random direction change
        if (Math.random() < 0.005) {
          const angle = Math.random() * Math.PI * 2;
          npc.dx = Math.cos(angle) * npc.speed;
          npc.dy = Math.sin(angle) * npc.speed;
        }
      }

      // Clear & draw
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawVillage(ctx, builtIds, npcs, dpr, viewW, viewH);

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [builtIds]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = canvas.getBoundingClientRect();
    const viewW = container.clientWidth;
    const viewH = container.clientHeight;
    const scaleX = viewW / W;
    const scaleY = viewH / H;
    const scale = Math.min(scaleX, scaleY);
    const offX = (viewW - W * scale) / 2;
    const offY = (viewH - H * scale) / 2;

    const mx = (e.clientX - rect.left - offX) / scale;
    const my = (e.clientY - rect.top - offY) / scale;

    const gridX = Math.floor(mx / CELL);
    const gridY = Math.floor(my / CELL);

    const building = BUILDINGS.find(b => b.gridX === gridX && b.gridY === gridY);
    if (building) {
      onTapBuilding(building.id);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: 12 }}
    >
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        style={{ display: 'block', cursor: 'pointer' }}
      />
    </div>
  );
}
