import { useRef, useEffect } from 'react';
import { BUILDINGS } from '../data/buildings.ts';

interface VillageCanvasProps {
  builtIds: string[];
  onTapBuilding: (id: string) => void;
}

/* ====== Isometric constants ====== */
const TW = 72;           // tile width
const TH = 36;           // tile height (half of width for 2:1 iso)
const COLS = 6;
const ROWS = 6;
const WORLD_W = (COLS + ROWS) * TW / 2;
const WORLD_H = (COLS + ROWS) * TH / 2 + 120; // extra space for tall buildings

/** Convert grid coords to isometric screen coords (center of tile) */
function isoXY(gx: number, gy: number): { x: number; y: number } {
  return {
    x: (gx - gy) * TW / 2 + WORLD_W / 2,
    y: (gx + gy) * TH / 2 + 40,
  };
}

/** Reverse: screen → grid (approximate, for click detection) */
function screenToGrid(sx: number, sy: number): { gx: number; gy: number } {
  const adjX = sx - WORLD_W / 2;
  const adjY = sy - 40;
  const gx = (adjX / (TW / 2) + adjY / (TH / 2)) / 2;
  const gy = (adjY / (TH / 2) - adjX / (TW / 2)) / 2;
  return { gx: Math.round(gx), gy: Math.round(gy) };
}

/* ====== Particles ====== */
interface Particle {
  x: number; y: number;
  dx: number; dy: number;
  life: number; maxLife: number;
  size: number;
  color: string;
  type: 'smoke' | 'splash' | 'sparkle' | 'leaf';
}

/* ====== NPC ====== */
interface NPC {
  gx: number; gy: number;      // current grid target
  sx: number; sy: number;      // screen position
  targetSx: number; targetSy: number;
  speed: number;
  color: string;
  frame: number;
  dir: number; // 0=right, 1=left
}

const NPC_COLORS = ['#FF7675', '#74B9FF', '#A29BFE', '#FDCB6E', '#55EFC4', '#E17055'];

function createNPCs(count: number): NPC[] {
  return Array.from({ length: count }, (_, i) => {
    const gx = 1 + Math.floor(Math.random() * (COLS - 2));
    const gy = 1 + Math.floor(Math.random() * (ROWS - 2));
    const pos = isoXY(gx, gy);
    return {
      gx, gy, sx: pos.x, sy: pos.y,
      targetSx: pos.x, targetSy: pos.y,
      speed: 0.4 + Math.random() * 0.3,
      color: NPC_COLORS[i % NPC_COLORS.length],
      frame: Math.random() * 100,
      dir: Math.random() > 0.5 ? 0 : 1,
    };
  });
}

/* ====== Cloud ====== */
interface Cloud { x: number; y: number; w: number; speed: number; opacity: number; }

function createClouds(): Cloud[] {
  return Array.from({ length: 4 }, () => ({
    x: Math.random() * WORLD_W,
    y: 5 + Math.random() * 30,
    w: 40 + Math.random() * 60,
    speed: 0.1 + Math.random() * 0.15,
    opacity: 0.3 + Math.random() * 0.3,
  }));
}

/* ====== Drawing helpers ====== */
function drawIsoDiamond(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - h / 2);
  ctx.lineTo(cx + w / 2, cy);
  ctx.lineTo(cx, cy + h / 2);
  ctx.lineTo(cx - w / 2, cy);
  ctx.closePath();
}

function drawIsoBox(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, depth: number, topColor: string, leftColor: string, rightColor: string) {
  // Top face
  ctx.fillStyle = topColor;
  drawIsoDiamond(ctx, cx, cy - depth, w, h);
  ctx.fill();
  // Left face
  ctx.fillStyle = leftColor;
  ctx.beginPath();
  ctx.moveTo(cx - w / 2, cy - depth);
  ctx.lineTo(cx, cy + h / 2 - depth);
  ctx.lineTo(cx, cy + h / 2);
  ctx.lineTo(cx - w / 2, cy);
  ctx.closePath();
  ctx.fill();
  // Right face
  ctx.fillStyle = rightColor;
  ctx.beginPath();
  ctx.moveTo(cx + w / 2, cy - depth);
  ctx.lineTo(cx, cy + h / 2 - depth);
  ctx.lineTo(cx, cy + h / 2);
  ctx.lineTo(cx + w / 2, cy);
  ctx.closePath();
  ctx.fill();
}

function drawRoof(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, peakH: number, color: string, shadeColor: string) {
  // Left slope
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - peakH);
  ctx.lineTo(cx - w / 2, cy);
  ctx.lineTo(cx, cy + h / 2);
  ctx.closePath();
  ctx.fill();
  // Right slope
  ctx.fillStyle = shadeColor;
  ctx.beginPath();
  ctx.moveTo(cx, cy - peakH);
  ctx.lineTo(cx + w / 2, cy);
  ctx.lineTo(cx, cy + h / 2);
  ctx.closePath();
  ctx.fill();
}

function drawTree(ctx: CanvasRenderingContext2D, cx: number, cy: number, t: number) {
  // Trunk
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(cx - 2, cy - 18, 4, 14);
  // Foliage (3 layered circles with sway)
  const sway = Math.sin(t * 0.02 + cx) * 1.5;
  const colors = ['#27AE60', '#2ECC71', '#58D68D'];
  for (let i = 2; i >= 0; i--) {
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.arc(cx + sway, cy - 22 - i * 6, 10 - i, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ====== Per-building renderers ====== */
function drawFountain(ctx: CanvasRenderingContext2D, cx: number, cy: number, t: number) {
  // Base pool
  ctx.fillStyle = '#85C1E9';
  drawIsoDiamond(ctx, cx, cy + 4, 48, 24);
  ctx.fill();
  ctx.strokeStyle = '#AEB6BF';
  ctx.lineWidth = 2;
  drawIsoDiamond(ctx, cx, cy + 4, 48, 24);
  ctx.stroke();
  // Center pillar
  drawIsoBox(ctx, cx, cy - 2, 12, 6, 16, '#D5DBDB', '#BDC3C7', '#ABB2B9');
  // Water spout (animated)
  const spoutH = 6 + Math.sin(t * 0.08) * 3;
  ctx.fillStyle = 'rgba(133,193,233,0.7)';
  ctx.beginPath();
  ctx.moveTo(cx - 1, cy - 18);
  ctx.quadraticCurveTo(cx, cy - 18 - spoutH, cx + 1, cy - 18);
  ctx.quadraticCurveTo(cx + 6, cy - 10, cx + 3, cy - 4);
  ctx.quadraticCurveTo(cx, cy - 6, cx - 3, cy - 4);
  ctx.quadraticCurveTo(cx - 6, cy - 10, cx - 1, cy - 18);
  ctx.fill();
}

function drawShop(ctx: CanvasRenderingContext2D, cx: number, cy: number, t: number) {
  // Body
  drawIsoBox(ctx, cx, cy, 50, 25, 28, '#F9E79F', '#F4D03F', '#D4AC0D');
  // Roof
  drawRoof(ctx, cx, cy - 28, 56, 28, 14, '#E74C3C', '#C0392B');
  // Door
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(cx - 4, cy - 10, 8, 12);
  // Sign
  ctx.fillStyle = '#FFF';
  ctx.fillRect(cx - 10, cy - 24, 20, 8);
  ctx.fillStyle = '#E74C3C';
  ctx.font = 'bold 6px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SHOP', cx, cy - 20);
  // Awning animation
  const aw = Math.sin(t * 0.03) * 0.5;
  ctx.fillStyle = 'rgba(231,76,60,0.3)';
  ctx.beginPath();
  ctx.moveTo(cx - 26, cy - 26);
  ctx.lineTo(cx + 26, cy - 26);
  ctx.lineTo(cx + 22, cy - 20 + aw);
  ctx.lineTo(cx - 22, cy - 20 + aw);
  ctx.closePath();
  ctx.fill();
}

function drawGuild(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  // Sturdy stone building
  drawIsoBox(ctx, cx, cy, 52, 26, 32, '#ABB2B9', '#808B96', '#6C757D');
  // Crenellations
  for (let i = -2; i <= 2; i++) {
    ctx.fillStyle = '#808B96';
    ctx.fillRect(cx + i * 8 - 3, cy - 36, 6, 4);
  }
  // Door (arch)
  ctx.fillStyle = '#2C3E50';
  ctx.beginPath();
  ctx.arc(cx, cy - 6, 6, Math.PI, 0);
  ctx.lineTo(cx + 6, cy + 2);
  ctx.lineTo(cx - 6, cy + 2);
  ctx.closePath();
  ctx.fill();
  // Sword emblem
  ctx.fillStyle = '#F1C40F';
  ctx.font = '10px serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚔', cx, cy - 22);
}

function drawDojo(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  // Japanese-style building
  drawIsoBox(ctx, cx, cy, 48, 24, 24, '#FDEBD0', '#EDBB99', '#D5A67E');
  // Curved roof
  ctx.fillStyle = '#1A5276';
  ctx.beginPath();
  ctx.moveTo(cx - 30, cy - 22);
  ctx.quadraticCurveTo(cx, cy - 42, cx + 30, cy - 22);
  ctx.lineTo(cx + 26, cy - 24);
  ctx.quadraticCurveTo(cx, cy - 40, cx - 26, cy - 24);
  ctx.closePath();
  ctx.fill();
  // Door
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(cx - 5, cy - 8, 10, 12);
  ctx.strokeStyle = '#6B3410';
  ctx.lineWidth = 0.5;
  ctx.strokeRect(cx - 5, cy - 8, 5, 12);
}

function drawLibrary(ctx: CanvasRenderingContext2D, cx: number, cy: number, t: number) {
  // Tall stone building
  drawIsoBox(ctx, cx, cy, 46, 23, 34, '#D5D8DC', '#AEB6BF', '#95A5A6');
  // Pointed roof
  drawRoof(ctx, cx, cy - 34, 52, 26, 20, '#6C3483', '#512E5F');
  // Window (glowing)
  const glow = 0.5 + Math.sin(t * 0.04) * 0.3;
  ctx.fillStyle = `rgba(249,231,159,${glow})`;
  ctx.beginPath();
  ctx.arc(cx, cy - 20, 5, 0, Math.PI * 2);
  ctx.fill();
  // Book emblem
  ctx.font = '9px serif';
  ctx.textAlign = 'center';
  ctx.fillText('📖', cx, cy - 6);
}

function drawInn(ctx: CanvasRenderingContext2D, cx: number, cy: number, t: number) {
  // Cozy building
  drawIsoBox(ctx, cx, cy, 50, 25, 26, '#FAD7A0', '#F0B27A', '#DC7633');
  drawRoof(ctx, cx, cy - 26, 56, 28, 12, '#A04000', '#873600');
  // Chimney
  ctx.fillStyle = '#7B7D7D';
  ctx.fillRect(cx + 12, cy - 42, 6, 10);
  // Smoke particles (drawn via particle system, hint here)
  const smokeY = cy - 44 - Math.sin(t * 0.05) * 2;
  ctx.fillStyle = 'rgba(200,200,200,0.4)';
  ctx.beginPath();
  ctx.arc(cx + 15, smokeY, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 13, smokeY - 5, 2.5, 0, Math.PI * 2);
  ctx.fill();
  // Door
  ctx.fillStyle = '#6E2C00';
  ctx.fillRect(cx - 4, cy - 8, 8, 12);
  // Windows
  ctx.fillStyle = '#F9E79F';
  ctx.fillRect(cx - 16, cy - 16, 6, 6);
  ctx.fillRect(cx + 10, cy - 16, 6, 6);
}

function drawTower(ctx: CanvasRenderingContext2D, cx: number, cy: number, t: number) {
  // Tall tower
  drawIsoBox(ctx, cx, cy, 30, 15, 50, '#D5DBDB', '#ABB2B9', '#909497');
  // Wider top section
  drawIsoBox(ctx, cx, cy - 46, 36, 18, 8, '#BDC3C7', '#95A5A6', '#808B96');
  // Cone roof
  ctx.fillStyle = '#2471A3';
  ctx.beginPath();
  ctx.moveTo(cx, cy - 70);
  ctx.lineTo(cx - 18, cy - 54);
  ctx.lineTo(cx, cy - 45);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#1A5276';
  ctx.beginPath();
  ctx.moveTo(cx, cy - 70);
  ctx.lineTo(cx + 18, cy - 54);
  ctx.lineTo(cx, cy - 45);
  ctx.closePath();
  ctx.fill();
  // Flag
  const flagWave = Math.sin(t * 0.06) * 3;
  ctx.fillStyle = '#E74C3C';
  ctx.beginPath();
  ctx.moveTo(cx, cy - 70);
  ctx.lineTo(cx + 10 + flagWave, cy - 68);
  ctx.lineTo(cx + 8 + flagWave, cy - 64);
  ctx.lineTo(cx, cy - 66);
  ctx.closePath();
  ctx.fill();
  // Windows
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = '#F9E79F';
    ctx.beginPath();
    ctx.arc(cx, cy - 10 - i * 14, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawGarden(ctx: CanvasRenderingContext2D, cx: number, cy: number, t: number) {
  // Fence
  ctx.strokeStyle = '#D5A67E';
  ctx.lineWidth = 1.5;
  drawIsoDiamond(ctx, cx, cy + 2, 50, 25);
  ctx.stroke();
  // Flowers
  const flowers = [
    { ox: -10, oy: -4, c: '#E74C3C' }, { ox: 8, oy: -6, c: '#F39C12' },
    { ox: -6, oy: 4, c: '#9B59B6' }, { ox: 12, oy: 2, c: '#3498DB' },
    { ox: 0, oy: -8, c: '#E91E63' }, { ox: -14, oy: 0, c: '#FF9800' },
    { ox: 6, oy: 6, c: '#2ECC71' },
  ];
  for (const f of flowers) {
    const sway = Math.sin(t * 0.03 + f.ox) * 1;
    // Stem
    ctx.strokeStyle = '#27AE60';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx + f.ox, cy + f.oy + 4);
    ctx.lineTo(cx + f.ox + sway, cy + f.oy - 4);
    ctx.stroke();
    // Petals
    ctx.fillStyle = f.c;
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2 + t * 0.01;
      ctx.beginPath();
      ctx.arc(cx + f.ox + sway + Math.cos(a) * 3, cy + f.oy - 4 + Math.sin(a) * 2, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    // Center
    ctx.fillStyle = '#F1C40F';
    ctx.beginPath();
    ctx.arc(cx + f.ox + sway, cy + f.oy - 4, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawConstructionSite(ctx: CanvasRenderingContext2D, cx: number, cy: number, cost: number, t: number) {
  // Dashed diamond outline
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  drawIsoDiamond(ctx, cx, cy, 44, 22);
  ctx.stroke();
  ctx.setLineDash([]);
  // Animated hammer
  const hammerAngle = Math.sin(t * 0.06) * 0.3;
  ctx.save();
  ctx.translate(cx, cy - 10);
  ctx.rotate(hammerAngle);
  ctx.font = '16px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🔨', 0, 0);
  ctx.restore();
  // Cost label
  ctx.font = 'bold 9px "Zen Maru Gothic", sans-serif';
  ctx.fillStyle = '#F39C12';
  ctx.strokeStyle = 'rgba(255,255,255,0.8)';
  ctx.lineWidth = 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.strokeText(`${cost}G`, cx, cy + 8);
  ctx.fillText(`${cost}G`, cx, cy + 8);
}

/* ====== NPC drawing ====== */
function drawNPC(ctx: CanvasRenderingContext2D, npc: NPC, t: number) {
  const bounce = Math.sin(t * 0.1 + npc.frame) * 1.5;
  const x = npc.sx;
  const y = npc.sy + bounce;
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath();
  ctx.ellipse(x, npc.sy + 6, 5, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  // Body
  ctx.fillStyle = npc.color;
  ctx.beginPath();
  ctx.arc(x, y - 2, 4, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.fillStyle = '#FDEBD0';
  ctx.beginPath();
  ctx.arc(x, y - 8, 3.5, 0, Math.PI * 2);
  ctx.fill();
  // Eyes
  ctx.fillStyle = '#2C3E50';
  const eyeOff = npc.dir === 0 ? 1 : -1;
  ctx.fillRect(x + eyeOff - 0.5, y - 9, 1, 1);
  ctx.fillRect(x + eyeOff + 2, y - 9, 1, 1);
}

/* ====== Main draw ====== */
function drawScene(
  ctx: CanvasRenderingContext2D,
  builtIds: string[],
  npcs: NPC[],
  clouds: Cloud[],
  particles: Particle[],
  dpr: number,
  viewW: number,
  viewH: number,
  t: number,
) {
  const scaleX = viewW / WORLD_W;
  const scaleY = viewH / WORLD_H;
  const scale = Math.min(scaleX, scaleY);
  const offX = (viewW - WORLD_W * scale) / 2;
  const offY = (viewH - WORLD_H * scale) / 2;

  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * offX, dpr * offY);

  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, WORLD_H);
  sky.addColorStop(0, '#87CEEB');
  sky.addColorStop(0.5, '#AED6F1');
  sky.addColorStop(1, '#85C1E9');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);

  // Clouds
  for (const c of clouds) {
    ctx.fillStyle = `rgba(255,255,255,${c.opacity})`;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.w * 0.3, 0, Math.PI * 2);
    ctx.arc(c.x + c.w * 0.25, c.y - 3, c.w * 0.25, 0, Math.PI * 2);
    ctx.arc(c.x + c.w * 0.5, c.y, c.w * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ground tiles (isometric)
  for (let gy = 0; gy < ROWS; gy++) {
    for (let gx = 0; gx < COLS; gx++) {
      const { x, y } = isoXY(gx, gy);
      const isPath = (gx === 3) || (gy === 3);
      if (isPath) {
        ctx.fillStyle = (gx + gy) % 2 === 0 ? '#D5C4A1' : '#C8B88A';
      } else {
        ctx.fillStyle = (gx + gy) % 2 === 0 ? '#7DD87D' : '#6CC76C';
      }
      drawIsoDiamond(ctx, x, y, TW, TH);
      ctx.fill();
      // Subtle border
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.lineWidth = 0.5;
      drawIsoDiamond(ctx, x, y, TW, TH);
      ctx.stroke();
    }
  }

  // Collect drawable items for depth sorting (back to front)
  type Drawable = { sortY: number; draw: () => void };
  const drawables: Drawable[] = [];

  // Trees in empty spots
  const treeSpots = [
    { gx: 0, gy: 0 }, { gx: 1, gy: 0 }, { gx: 5, gy: 0 },
    { gx: 0, gy: 5 }, { gx: 5, gy: 5 }, { gx: 5, gy: 2 },
    { gx: 0, gy: 2 }, { gx: 2, gy: 5 },
  ];
  for (const spot of treeSpots) {
    const hasBuilding = BUILDINGS.some(b => b.gridX === spot.gx && b.gridY === spot.gy);
    if (!hasBuilding) {
      const pos = isoXY(spot.gx, spot.gy);
      drawables.push({
        sortY: pos.y,
        draw: () => drawTree(ctx, pos.x, pos.y, t),
      });
    }
  }

  // Buildings
  for (const b of BUILDINGS) {
    const pos = isoXY(b.gridX, b.gridY);
    const built = builtIds.includes(b.id);
    drawables.push({
      sortY: pos.y,
      draw: () => {
        if (!built) {
          drawConstructionSite(ctx, pos.x, pos.y, b.cost, t);
          return;
        }
        // Draw building shadow
        ctx.fillStyle = 'rgba(0,0,0,0.08)';
        ctx.beginPath();
        ctx.ellipse(pos.x + 4, pos.y + 8, 22, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        switch (b.id) {
          case 'fountain': drawFountain(ctx, pos.x, pos.y, t); break;
          case 'shop': drawShop(ctx, pos.x, pos.y, t); break;
          case 'guild': drawGuild(ctx, pos.x, pos.y); break;
          case 'dojo': drawDojo(ctx, pos.x, pos.y); break;
          case 'library': drawLibrary(ctx, pos.x, pos.y, t); break;
          case 'inn': drawInn(ctx, pos.x, pos.y, t); break;
          case 'tower': drawTower(ctx, pos.x, pos.y, t); break;
          case 'garden': drawGarden(ctx, pos.x, pos.y, t); break;
        }

        // Name label
        ctx.font = 'bold 8px "Zen Maru Gothic", sans-serif';
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = 'rgba(0,0,0,0.6)';
        ctx.lineWidth = 2.5;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.strokeText(b.name, pos.x, pos.y + 12);
        ctx.fillText(b.name, pos.x, pos.y + 12);
      },
    });
  }

  // NPCs
  for (const npc of npcs) {
    drawables.push({
      sortY: npc.sy,
      draw: () => drawNPC(ctx, npc, t),
    });
  }

  // Sort by Y (back to front)
  drawables.sort((a, b) => a.sortY - b.sortY);
  for (const d of drawables) d.draw();

  // Particles on top
  for (const p of particles) {
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    if (p.type === 'sparkle') {
      ctx.fillStyle = '#F1C40F';
      const s = p.size * (1 + (1 - alpha) * 0.5);
      ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

/* ====== Component ====== */
export default function VillageCanvas({ builtIds, onTapBuilding }: VillageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const npcsRef = useRef<NPC[]>(createNPCs(6));
  const cloudsRef = useRef<Cloud[]>(createClouds());
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const frameRef = useRef(0);

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
    const clouds = cloudsRef.current;
    const particles = particlesRef.current;

    const animate = () => {
      frameRef.current++;
      const t = frameRef.current;

      // Update clouds
      for (const c of clouds) {
        c.x += c.speed;
        if (c.x > WORLD_W + 40) c.x = -c.w;
      }

      // Update NPCs — wander between grid points
      for (const npc of npcs) {
        const dx = npc.targetSx - npc.sx;
        const dy = npc.targetSy - npc.sy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1) {
          // Pick new target
          if (Math.random() < 0.02) {
            const ngx = Math.max(0, Math.min(COLS - 1, npc.gx + Math.floor(Math.random() * 3) - 1));
            const ngy = Math.max(0, Math.min(ROWS - 1, npc.gy + Math.floor(Math.random() * 3) - 1));
            npc.gx = ngx;
            npc.gy = ngy;
            const target = isoXY(ngx, ngy);
            npc.targetSx = target.x + (Math.random() - 0.5) * 20;
            npc.targetSy = target.y + (Math.random() - 0.5) * 10;
            npc.dir = npc.targetSx > npc.sx ? 0 : 1;
          }
        } else {
          npc.sx += (dx / dist) * npc.speed;
          npc.sy += (dy / dist) * npc.speed;
        }
        npc.frame = t;
      }

      // Spawn particles for fountain
      if (builtIds.includes('fountain') && t % 4 === 0) {
        const fpos = isoXY(2, 2);
        particles.push({
          x: fpos.x + (Math.random() - 0.5) * 6,
          y: fpos.y - 18,
          dx: (Math.random() - 0.5) * 0.5,
          dy: -0.5 - Math.random() * 0.5,
          life: 30, maxLife: 30,
          size: 1.5 + Math.random(),
          color: 'rgba(133,193,233,0.6)',
          type: 'splash',
        });
      }

      // Spawn smoke for inn
      if (builtIds.includes('inn') && t % 10 === 0) {
        const ipos = isoXY(1, 4);
        particles.push({
          x: ipos.x + 15, y: ipos.y - 44,
          dx: (Math.random() - 0.5) * 0.2,
          dy: -0.3 - Math.random() * 0.2,
          life: 60, maxLife: 60,
          size: 2 + Math.random() * 2,
          color: 'rgba(200,200,200,0.4)',
          type: 'smoke',
        });
      }

      // Spawn sparkles for garden
      if (builtIds.includes('garden') && t % 8 === 0) {
        const gpos = isoXY(3, 4);
        particles.push({
          x: gpos.x + (Math.random() - 0.5) * 30,
          y: gpos.y + (Math.random() - 0.5) * 10 - 6,
          dx: (Math.random() - 0.5) * 0.3,
          dy: -0.2 - Math.random() * 0.3,
          life: 40, maxLife: 40,
          size: 1.5,
          color: '#F1C40F',
          type: 'sparkle',
        });
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.dx;
        p.y += p.dy;
        p.life--;
        if (p.life <= 0) particles.splice(i, 1);
      }

      // Draw
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawScene(ctx, builtIds, npcs, clouds, particles, dpr, viewW, viewH, t);

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [builtIds]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = canvas.getBoundingClientRect();
    const viewW = container.clientWidth;
    const viewH = container.clientHeight;
    const scaleX = viewW / WORLD_W;
    const scaleY = viewH / WORLD_H;
    const scale = Math.min(scaleX, scaleY);
    const offX = (viewW - WORLD_W * scale) / 2;
    const offY = (viewH - WORLD_H * scale) / 2;

    const mx = (e.clientX - rect.left - offX) / scale;
    const my = (e.clientY - rect.top - offY) / scale;

    const { gx, gy } = screenToGrid(mx, my);
    const building = BUILDINGS.find(b => b.gridX === gx && b.gridY === gy);
    if (building) {
      onTapBuilding(building.id);
    }
  };

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: 12 }}>
      <canvas ref={canvasRef} onClick={handleClick} style={{ display: 'block', cursor: 'pointer' }} />
    </div>
  );
}
