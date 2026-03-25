import { useRef, useEffect, useCallback } from 'react';
import { Application, Sprite, Texture, Container, AnimatedSprite, Graphics, Text, TextStyle, Rectangle } from 'pixi.js';
import { BUILDINGS } from '../data/buildings.ts';

interface VillageCanvasProps {
  builtIds: string[];
  onTapBuilding: (id: string) => void;
}

/* ====== Asset paths ====== */
const A = '/assets/tiny-swords';
const BUILDING_SPRITES: Record<string, string> = {
  fountain: `${A}/Buildings/Blue Buildings/Monastery.png`,
  shop:     `${A}/Buildings/Yellow Buildings/House1.png`,
  guild:    `${A}/Buildings/Red Buildings/Barracks.png`,
  dojo:     `${A}/Buildings/Purple Buildings/House2.png`,
  library:  `${A}/Buildings/Blue Buildings/House3.png`,
  inn:      `${A}/Buildings/Yellow Buildings/House3.png`,
  tower:    `${A}/Buildings/Blue Buildings/Tower.png`,
  garden:   `${A}/Buildings/Yellow Buildings/Archery.png`,
};

const TREE_PATHS = [
  `${A}/Terrain/Resources/Wood/Trees/Tree1.png`,
  `${A}/Terrain/Resources/Wood/Trees/Tree2.png`,
  `${A}/Terrain/Resources/Wood/Trees/Tree3.png`,
];
const CLOUD_PATHS = [
  `${A}/Terrain/Decorations/Clouds/Clouds_01.png`,
  `${A}/Terrain/Decorations/Clouds/Clouds_02.png`,
  `${A}/Terrain/Decorations/Clouds/Clouds_03.png`,
  `${A}/Terrain/Decorations/Clouds/Clouds_05.png`,
];
const BUSH_PATHS = [
  `${A}/Terrain/Decorations/Bushes/Bushe1.png`,
  `${A}/Terrain/Decorations/Bushes/Bushe2.png`,
];
const PAWN_RUN_PATH = `${A}/Units/Blue Units/Pawn/Pawn_Run.png`;
const SHEEP_IDLE_PATH = `${A}/Terrain/Resources/Meat/Sheep/Sheep_Idle.png`;

/* ====== Layout constants ====== */
const GRID_COLS = 6;
const GRID_ROWS = 6;
const TILE_W = 64;
const TILE_H = 64;
const VILLAGE_W = GRID_COLS * TILE_W;
const VILLAGE_H = GRID_ROWS * TILE_H + 80; // extra for tall buildings

/* ====== Helpers ====== */
function gridToScreen(gx: number, gy: number): { x: number; y: number } {
  return {
    x: gx * TILE_W + TILE_W / 2,
    y: gy * TILE_H + TILE_H / 2 + 40, // offset for sky
  };
}

function screenToGrid(sx: number, sy: number): { gx: number; gy: number } {
  return {
    gx: Math.floor(sx / TILE_W),
    gy: Math.floor((sy - 40) / TILE_H),
  };
}

/** Create AnimatedSprite frames from a horizontal sprite sheet texture */
function createFrames(texture: Texture, frameCount: number, frameW: number, frameH: number): Texture[] {
  const frames: Texture[] = [];
  const base = texture.source;
  for (let i = 0; i < frameCount; i++) {
    const t = new Texture({
      source: base,
      frame: new Rectangle(i * frameW, 0, frameW, frameH),
    });
    frames.push(t);
  }
  return frames;
}

/* ====== NPC state ====== */
interface NPCState {
  sprite: AnimatedSprite;
  targetX: number;
  targetY: number;
  speed: number;
  waitTimer: number;
}

export default function VillageCanvas({ builtIds, onTapBuilding }: VillageCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const builtRef = useRef(builtIds);
  useEffect(() => { builtRef.current = builtIds; }, [builtIds]);

  const onTapRef = useRef(onTapBuilding);
  useEffect(() => { onTapRef.current = onTapBuilding; }, [onTapBuilding]);

  const initApp = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;
    // Destroy old app
    if (appRef.current) {
      appRef.current.destroy(true);
      appRef.current = null;
    }

    const viewW = container.clientWidth;
    const viewH = container.clientHeight;

    const app = new Application();
    await app.init({
      width: viewW,
      height: viewH,
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      antialias: true,
    });
    container.appendChild(app.canvas as HTMLCanvasElement);
    appRef.current = app;

    // Scale to fit
    const scale = Math.min(viewW / VILLAGE_W, viewH / VILLAGE_H);
    const world = new Container();
    world.scale.set(scale);
    world.x = (viewW - VILLAGE_W * scale) / 2;
    world.y = (viewH - VILLAGE_H * scale) / 2;
    app.stage.addChild(world);

    // === SKY ===
    const sky = new Graphics();
    sky.rect(0, 0, VILLAGE_W, VILLAGE_H);
    sky.fill(0x87CEEB);
    world.addChild(sky);

    // === GROUND ===
    const ground = new Graphics();
    for (let gy = 0; gy < GRID_ROWS; gy++) {
      for (let gx = 0; gx < GRID_COLS; gx++) {
        const isPath = gx === 3 || gy === 3;
        const color = isPath
          ? ((gx + gy) % 2 === 0 ? 0xD5C4A1 : 0xC8B88A)
          : ((gx + gy) % 2 === 0 ? 0x7DD87D : 0x6CC76C);
        ground.rect(gx * TILE_W, gy * TILE_H + 40, TILE_W, TILE_H);
        ground.fill(color);
      }
    }
    world.addChild(ground);

    // === CLOUDS (background layer) ===
    const cloudContainer = new Container();
    world.addChild(cloudContainer);
    const cloudSprites: Sprite[] = [];
    for (let i = 0; i < 3; i++) {
      const tex = await Texture.from(CLOUD_PATHS[i % CLOUD_PATHS.length]);
      const c = new Sprite(tex);
      c.scale.set(0.15 + Math.random() * 0.1);
      c.x = Math.random() * VILLAGE_W;
      c.y = 2 + Math.random() * 20;
      c.alpha = 0.5 + Math.random() * 0.3;
      cloudContainer.addChild(c);
      cloudSprites.push(c);
    }

    // === SORTABLE LAYER for buildings, trees, NPCs ===
    const sortLayer = new Container();
    sortLayer.sortableChildren = true;
    world.addChild(sortLayer);

    // === TREES ===
    const treeSpots = [
      { gx: 0, gy: 0 }, { gx: 1, gy: 0 }, { gx: 5, gy: 0 },
      { gx: 5, gy: 2 }, { gx: 0, gy: 5 }, { gx: 5, gy: 5 },
    ];
    for (const spot of treeSpots) {
      const hasBuilding = BUILDINGS.some(b => b.gridX === spot.gx && b.gridY === spot.gy);
      if (hasBuilding) continue;
      const treePath = TREE_PATHS[Math.floor(Math.random() * TREE_PATHS.length)];
      const tex = await Texture.from(treePath);
      // Tree spritesheet: 8 frames, each ~192x256
      const frameW = tex.width / 8;
      const frameH = tex.height;
      const frames = createFrames(tex, 8, frameW, frameH);
      const tree = new AnimatedSprite(frames);
      tree.animationSpeed = 0.08;
      tree.play();
      tree.anchor.set(0.5, 0.85);
      const pos = gridToScreen(spot.gx, spot.gy);
      tree.x = pos.x;
      tree.y = pos.y;
      tree.scale.set(0.35);
      tree.zIndex = pos.y;
      sortLayer.addChild(tree);
    }

    // === BUSHES ===
    const bushSpots = [
      { gx: 2, gy: 0 }, { gx: 4, gy: 0 }, { gx: 0, gy: 2 },
      { gx: 5, gy: 4 }, { gx: 4, gy: 5 },
    ];
    for (const spot of bushSpots) {
      const hasBuilding = BUILDINGS.some(b => b.gridX === spot.gx && b.gridY === spot.gy);
      if (hasBuilding) continue;
      const bushPath = BUSH_PATHS[Math.floor(Math.random() * BUSH_PATHS.length)];
      const tex = await Texture.from(bushPath);
      const bush = new Sprite(tex);
      bush.anchor.set(0.5, 0.7);
      const pos = gridToScreen(spot.gx, spot.gy);
      bush.x = pos.x;
      bush.y = pos.y;
      bush.scale.set(0.25);
      bush.zIndex = pos.y;
      sortLayer.addChild(bush);
    }

    // === BUILDINGS ===
    const buildingSprites: Map<string, Container> = new Map();
    for (const b of BUILDINGS) {
      const pos = gridToScreen(b.gridX, b.gridY);
      const bContainer = new Container();
      bContainer.x = pos.x;
      bContainer.y = pos.y;
      bContainer.zIndex = pos.y + 1;
      bContainer.eventMode = 'static';
      bContainer.cursor = 'pointer';
      const buildingId = b.id;
      bContainer.on('pointertap', () => {
        onTapRef.current(buildingId);
      });

      if (builtIds.includes(b.id)) {
        const spritePath = BUILDING_SPRITES[b.id];
        if (spritePath) {
          const tex = await Texture.from(spritePath);
          const sprite = new Sprite(tex);
          sprite.anchor.set(0.5, 0.85);
          sprite.scale.set(0.45);
          bContainer.addChild(sprite);
        }
        // Name label
        const label = new Text({
          text: b.name,
          style: new TextStyle({
            fontFamily: '"Zen Maru Gothic", sans-serif',
            fontSize: 11,
            fontWeight: 'bold',
            fill: '#ffffff',
            stroke: { color: '#000000', width: 3 },
            align: 'center',
          }),
        });
        label.anchor.set(0.5, 0);
        label.y = 10;
        bContainer.addChild(label);
      } else {
        // Construction site
        const site = new Graphics();
        site.rect(-24, -24, 48, 48);
        site.fill({ color: 0x000000, alpha: 0.05 });
        site.stroke({ color: 0x999999, width: 1.5 });
        bContainer.addChild(site);

        const hammerText = new Text({
          text: '🔨',
          style: new TextStyle({ fontSize: 20 }),
        });
        hammerText.anchor.set(0.5, 0.5);
        hammerText.y = -6;
        bContainer.addChild(hammerText);

        const costLabel = new Text({
          text: `${b.cost}G`,
          style: new TextStyle({
            fontFamily: '"Zen Maru Gothic", sans-serif',
            fontSize: 10,
            fontWeight: 'bold',
            fill: '#F39C12',
            stroke: { color: '#ffffff', width: 2 },
          }),
        });
        costLabel.anchor.set(0.5, 0);
        costLabel.y = 10;
        bContainer.addChild(costLabel);
      }

      sortLayer.addChild(bContainer);
      buildingSprites.set(b.id, bContainer);
    }

    // === NPCS (Pawn with walk animation) ===
    const pawnTex = await Texture.from(PAWN_RUN_PATH);
    const pawnFrameW = pawnTex.width / 6;
    const pawnFrameH = pawnTex.height;
    const pawnFrames = createFrames(pawnTex, 6, pawnFrameW, pawnFrameH);

    const npcs: NPCState[] = [];
    for (let i = 0; i < 5; i++) {
      const npc = new AnimatedSprite(pawnFrames);
      npc.animationSpeed = 0.12;
      npc.play();
      npc.anchor.set(0.5, 0.8);
      npc.scale.set(0.3);
      const startGx = 1 + Math.floor(Math.random() * (GRID_COLS - 2));
      const startGy = 1 + Math.floor(Math.random() * (GRID_ROWS - 2));
      const pos = gridToScreen(startGx, startGy);
      npc.x = pos.x + (Math.random() - 0.5) * 20;
      npc.y = pos.y + (Math.random() - 0.5) * 10;
      npc.zIndex = npc.y;
      sortLayer.addChild(npc);
      npcs.push({
        sprite: npc,
        targetX: npc.x,
        targetY: npc.y,
        speed: 0.4 + Math.random() * 0.3,
        waitTimer: Math.random() * 120,
      });
    }

    // === SHEEP ===
    const sheepTex = await Texture.from(SHEEP_IDLE_PATH);
    const sheepFrameW = sheepTex.width / 6;
    const sheepFrameH = sheepTex.height;
    const sheepFrames = createFrames(sheepTex, 6, sheepFrameW, sheepFrameH);
    for (let i = 0; i < 2; i++) {
      const sheep = new AnimatedSprite(sheepFrames);
      sheep.animationSpeed = 0.06;
      sheep.play();
      sheep.anchor.set(0.5, 0.7);
      sheep.scale.set(0.35);
      const gx = 4 + i;
      const gy = 5;
      const pos = gridToScreen(gx, gy);
      sheep.x = pos.x + (Math.random() - 0.5) * 20;
      sheep.y = pos.y;
      sheep.zIndex = pos.y;
      sortLayer.addChild(sheep);
    }

    // === ANIMATION LOOP ===
    app.ticker.add(() => {
      // Clouds drift
      for (const c of cloudSprites) {
        c.x += 0.15;
        if (c.x > VILLAGE_W + 50) c.x = -c.width;
      }

      // NPC wandering
      for (const npc of npcs) {
        if (npc.waitTimer > 0) {
          npc.waitTimer--;
          continue;
        }
        const dx = npc.targetX - npc.sprite.x;
        const dy = npc.targetY - npc.sprite.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 2) {
          // Pick new target
          npc.waitTimer = 60 + Math.random() * 120;
          const ngx = Math.max(0, Math.min(GRID_COLS - 1, Math.floor(Math.random() * GRID_COLS)));
          const ngy = Math.max(1, Math.min(GRID_ROWS - 1, Math.floor(Math.random() * GRID_ROWS)));
          const tp = gridToScreen(ngx, ngy);
          npc.targetX = tp.x + (Math.random() - 0.5) * 30;
          npc.targetY = tp.y + (Math.random() - 0.5) * 15;
        } else {
          npc.sprite.x += (dx / dist) * npc.speed;
          npc.sprite.y += (dy / dist) * npc.speed;
          npc.sprite.scale.x = dx > 0 ? 0.3 : -0.3; // flip direction
          npc.sprite.zIndex = npc.sprite.y;
        }
      }
    });
  }, [builtIds]);

  useEffect(() => {
    initApp();
    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, [initApp]);

  // Handle click fallback for grid detection
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const app = appRef.current;
    const container = containerRef.current;
    if (!app || !container) return;

    const rect = container.getBoundingClientRect();
    const viewW = container.clientWidth;
    const viewH = container.clientHeight;
    const scale = Math.min(viewW / VILLAGE_W, viewH / VILLAGE_H);
    const offX = (viewW - VILLAGE_W * scale) / 2;
    const offY = (viewH - VILLAGE_H * scale) / 2;

    const mx = (e.clientX - rect.left - offX) / scale;
    const my = (e.clientY - rect.top - offY) / scale;
    const { gx, gy } = screenToGrid(mx, my);

    const building = BUILDINGS.find(b => b.gridX === gx && b.gridY === gy);
    if (building) {
      onTapRef.current(building.id);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: 12 }}
    />
  );
}
