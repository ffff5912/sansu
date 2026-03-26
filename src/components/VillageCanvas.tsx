import { useRef, useEffect, useCallback } from 'react';
import { Application, Assets, Sprite, Texture, Container, AnimatedSprite, Graphics, Text, TextStyle, Rectangle, BlurFilter, ColorMatrixFilter } from 'pixi.js';
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
const TILEMAP_PATH = `${A}/Terrain/Tileset/Tilemap_color1.png`;
const TOOL_HAMMER_PATH = `${A}/Terrain/Resources/Tools/Tool_01.png`;
const GOLD_ICON_PATH = `${A}/UI Elements/UI Elements/Icons/Icon_03.png`;
const SHADOW_PATH = `${A}/Terrain/Tileset/Shadow.png`;

/* ====== Expanded Layout (scrollable) ====== */
const GRID_COLS = 14;
const GRID_ROWS = 14;
const TILE_W = 56;
const TILE_H = 56;
const MAP_W = GRID_COLS * TILE_W;
const MAP_H = GRID_ROWS * TILE_H;

function gridToScreen(gx: number, gy: number) {
  return { x: gx * TILE_W + TILE_W / 2, y: gy * TILE_H + TILE_H / 2 };
}

function tileTexture(tilemapTex: Texture, col: number, row: number): Texture {
  return new Texture({
    source: tilemapTex.source,
    frame: new Rectangle(col * 64, row * 64, 64, 64),
  });
}

function createFrames(texture: Texture, count: number, fw: number, fh: number): Texture[] {
  return Array.from({ length: count }, (_, i) =>
    new Texture({ source: texture.source, frame: new Rectangle(i * fw, 0, fw, fh) })
  );
}

interface NPCState {
  sprite: AnimatedSprite;
  targetX: number; targetY: number;
  speed: number; waitTimer: number;
}

export default function VillageCanvas({ builtIds, onTapBuilding }: VillageCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const onTapRef = useRef(onTapBuilding);
  useEffect(() => { onTapRef.current = onTapBuilding; }, [onTapBuilding]);

  const initApp = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    if (appRef.current) { appRef.current.destroy(true); appRef.current = null; }

    const viewW = el.clientWidth;
    const viewH = el.clientHeight;
    if (viewW === 0 || viewH === 0) return;

    const app = new Application();
    await app.init({
      width: viewW, height: viewH,
      backgroundAlpha: 1, backgroundColor: 0x5DAA5D,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true, antialias: true,
    });
    el.appendChild(app.canvas as HTMLCanvasElement);
    appRef.current = app;

    // Preload
    const allPaths = [
      ...Object.values(BUILDING_SPRITES), ...TREE_PATHS, ...CLOUD_PATHS,
      ...BUSH_PATHS, PAWN_RUN_PATH, SHEEP_IDLE_PATH, TILEMAP_PATH,
      TOOL_HAMMER_PATH, GOLD_ICON_PATH, SHADOW_PATH,
    ];
    await Assets.load(allPaths);

    /* ====== WORLD (draggable) ====== */
    const world = new Container();
    // Center world initially on the village center
    world.x = viewW / 2 - MAP_W / 2;
    world.y = viewH / 2 - MAP_H / 2;
    app.stage.addChild(world);

    /* ====== DRAG TO SCROLL ====== */
    let dragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let worldStartX = 0;
    let worldStartY = 0;
    let dragMoved = false;

    const clampWorld = () => {
      const minX = viewW - MAP_W;
      const minY = viewH - MAP_H;
      world.x = Math.min(0, Math.max(minX, world.x));
      world.y = Math.min(0, Math.max(minY, world.y));
    };

    const canvas = app.canvas as HTMLCanvasElement;
    canvas.addEventListener('pointerdown', (e) => {
      dragging = true;
      dragMoved = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      worldStartX = world.x;
      worldStartY = world.y;
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragMoved = true;
      world.x = worldStartX + dx;
      world.y = worldStartY + dy;
      clampWorld();
    });
    const endDrag = () => { dragging = false; };
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointerleave', endDrag);

    /* ====== GROUND ====== */
    const tilemapTex = Texture.from(TILEMAP_PATH);
    const grassTile = tileTexture(tilemapTex, 1, 1);
    const grassTile2 = tileTexture(tilemapTex, 2, 1);
    const pathTile = tileTexture(tilemapTex, 1, 0);

    const groundLayer = new Container();
    world.addChild(groundLayer);
    for (let gy = 0; gy < GRID_ROWS; gy++) {
      for (let gx = 0; gx < GRID_COLS; gx++) {
        const isPath = gx === 7 || gy === 7;
        const tex = isPath ? pathTile : ((gx + gy) % 2 === 0 ? grassTile : grassTile2);
        const tile = new Sprite(tex);
        tile.x = gx * TILE_W;
        tile.y = gy * TILE_H;
        tile.width = TILE_W;
        tile.height = TILE_H;
        groundLayer.addChild(tile);
      }
    }

    /* ====== CLOUDS ====== */
    const cloudContainer = new Container();
    const cloudBlur = new BlurFilter({ strength: 1.5, quality: 2 });
    cloudContainer.filters = [cloudBlur];
    world.addChild(cloudContainer);
    const cloudSprites: Sprite[] = [];
    for (let i = 0; i < 6; i++) {
      const tex = Texture.from(CLOUD_PATHS[i % CLOUD_PATHS.length]);
      const c = new Sprite(tex);
      c.scale.set(0.12 + Math.random() * 0.08);
      c.x = Math.random() * MAP_W;
      c.y = Math.random() * MAP_H * 0.3;
      c.alpha = 0.3 + Math.random() * 0.2;
      cloudContainer.addChild(c);
      cloudSprites.push(c);
    }

    /* ====== SORTABLE LAYER ====== */
    const sortLayer = new Container();
    sortLayer.sortableChildren = true;
    world.addChild(sortLayer);
    const shadowTex = Texture.from(SHADOW_PATH);

    // === TREES (scatter around edges and empty areas) ===
    const treeSpots = [
      { gx: 0, gy: 0 }, { gx: 2, gy: 0 }, { gx: 5, gy: 0 }, { gx: 8, gy: 0 }, { gx: 11, gy: 0 }, { gx: 13, gy: 0 },
      { gx: 0, gy: 3 }, { gx: 13, gy: 3 },
      { gx: 0, gy: 6 }, { gx: 13, gy: 6 },
      { gx: 0, gy: 10 }, { gx: 6, gy: 10 }, { gx: 8, gy: 10 }, { gx: 13, gy: 10 },
      { gx: 0, gy: 13 }, { gx: 3, gy: 13 }, { gx: 10, gy: 13 }, { gx: 13, gy: 13 },
    ];
    for (const spot of treeSpots) {
      if (BUILDINGS.some(b => b.gridX === spot.gx && b.gridY === spot.gy)) continue;
      const treePath = TREE_PATHS[Math.floor(Math.random() * TREE_PATHS.length)];
      const tex = Texture.from(treePath);
      const frames = createFrames(tex, 8, tex.width / 8, tex.height);
      const tree = new AnimatedSprite(frames);
      tree.animationSpeed = 0.06; tree.play();
      tree.anchor.set(0.5, 0.85);
      const pos = gridToScreen(spot.gx, spot.gy);
      tree.x = pos.x; tree.y = pos.y;
      tree.scale.set(0.3); tree.zIndex = pos.y;
      sortLayer.addChild(tree);
    }

    // === BUSHES ===
    const bushSpots = [
      { gx: 1, gy: 1 }, { gx: 4, gy: 0 }, { gx: 12, gy: 1 },
      { gx: 3, gy: 5 }, { gx: 10, gy: 5 },
      { gx: 2, gy: 9 }, { gx: 11, gy: 9 },
      { gx: 5, gy: 13 }, { gx: 8, gy: 13 },
    ];
    for (const spot of bushSpots) {
      if (BUILDINGS.some(b => b.gridX === spot.gx && b.gridY === spot.gy)) continue;
      const tex = Texture.from(BUSH_PATHS[Math.floor(Math.random() * BUSH_PATHS.length)]);
      const bush = new Sprite(tex);
      bush.anchor.set(0.5, 0.7);
      const pos = gridToScreen(spot.gx, spot.gy);
      bush.x = pos.x; bush.y = pos.y;
      bush.scale.set(0.22); bush.zIndex = pos.y;
      sortLayer.addChild(bush);
    }

    // === BUILDINGS ===
    for (const b of BUILDINGS) {
      const pos = gridToScreen(b.gridX, b.gridY);
      const bc = new Container();
      bc.x = pos.x; bc.y = pos.y;
      bc.zIndex = pos.y + 1;
      bc.eventMode = 'static'; bc.cursor = 'pointer';
      const bid = b.id;
      bc.on('pointertap', () => {
        if (!dragMoved) onTapRef.current(bid);
      });

      if (builtIds.includes(b.id)) {
        const shadow = new Sprite(shadowTex);
        shadow.anchor.set(0.5, 0.5); shadow.y = 14;
        shadow.scale.set(0.5, 0.25); shadow.alpha = 0.3;
        bc.addChild(shadow);

        const spritePath = BUILDING_SPRITES[b.id];
        if (spritePath) {
          const sprite = new Sprite(Texture.from(spritePath));
          sprite.anchor.set(0.5, 0.85);
          sprite.scale.set(0.38);
          bc.addChild(sprite);
        }
        const label = new Text({
          text: b.name,
          style: new TextStyle({
            fontFamily: '"Zen Maru Gothic", sans-serif',
            fontSize: 10, fontWeight: 'bold',
            fill: '#ffffff',
            stroke: { color: '#1a1a2e', width: 3 },
            dropShadow: { color: '#000000', blur: 4, distance: 0, alpha: 0.5 },
          }),
        });
        label.anchor.set(0.5, 0); label.y = 14;
        bc.addChild(label);
      } else {
        const site = new Graphics();
        site.roundRect(-26, -26, 52, 52, 6);
        site.fill({ color: 0x000000, alpha: 0.08 });
        site.stroke({ color: 0x888888, width: 1.5 });
        bc.addChild(site);
        const hammer = new Sprite(Texture.from(TOOL_HAMMER_PATH));
        hammer.anchor.set(0.5, 0.5); hammer.scale.set(0.7); hammer.y = -6;
        bc.addChild(hammer);
        const costContainer = new Container();
        const coinIcon = new Sprite(Texture.from(GOLD_ICON_PATH));
        coinIcon.anchor.set(0.5, 0.5); coinIcon.scale.set(0.28);
        costContainer.addChild(coinIcon);
        const costText = new Text({
          text: `${b.cost}`,
          style: new TextStyle({
            fontFamily: '"Zen Maru Gothic", sans-serif',
            fontSize: 10, fontWeight: 'bold',
            fill: '#F39C12', stroke: { color: '#ffffff', width: 2 },
          }),
        });
        costText.anchor.set(0, 0.5); costText.x = 10;
        costContainer.addChild(costText);
        costContainer.x = -12; costContainer.y = 16;
        bc.addChild(costContainer);
      }
      sortLayer.addChild(bc);
    }

    // === NPCs ===
    const pawnTex = Texture.from(PAWN_RUN_PATH);
    const pawnFrames = createFrames(pawnTex, 6, pawnTex.width / 6, pawnTex.height);
    const npcs: NPCState[] = [];
    for (let i = 0; i < 8; i++) {
      const npc = new AnimatedSprite(pawnFrames);
      npc.animationSpeed = 0.1; npc.play();
      npc.anchor.set(0.5, 0.8); npc.scale.set(0.25);
      const gx = 2 + Math.floor(Math.random() * (GRID_COLS - 4));
      const gy = 2 + Math.floor(Math.random() * (GRID_ROWS - 4));
      const pos = gridToScreen(gx, gy);
      npc.x = pos.x + (Math.random() - 0.5) * 20;
      npc.y = pos.y + (Math.random() - 0.5) * 10;
      npc.zIndex = npc.y;
      sortLayer.addChild(npc);
      npcs.push({ sprite: npc, targetX: npc.x, targetY: npc.y,
        speed: 0.3 + Math.random() * 0.3, waitTimer: Math.random() * 120 });
    }

    // === SHEEP ===
    const sheepTex = Texture.from(SHEEP_IDLE_PATH);
    const sheepFrames = createFrames(sheepTex, 6, sheepTex.width / 6, sheepTex.height);
    for (let i = 0; i < 3; i++) {
      const sheep = new AnimatedSprite(sheepFrames);
      sheep.animationSpeed = 0.06; sheep.play();
      sheep.anchor.set(0.5, 0.7); sheep.scale.set(0.3);
      const pos = gridToScreen(9 + i, 11);
      sheep.x = pos.x + (Math.random() - 0.5) * 20;
      sheep.y = pos.y; sheep.zIndex = pos.y;
      sortLayer.addChild(sheep);
    }

    /* ====== FX LAYER ====== */
    const fxLayer = new Container();
    world.addChild(fxLayer);
    // Light rays
    for (let i = 0; i < 8; i++) {
      const ray = new Graphics();
      const rx = Math.random() * MAP_W;
      ray.rect(-2, 0, 4, 60 + Math.random() * 80);
      ray.fill({ color: 0xFFE082, alpha: 0.03 + Math.random() * 0.03 });
      ray.x = rx; ray.y = 0;
      ray.rotation = -0.1 + Math.random() * 0.2;
      fxLayer.addChild(ray);
    }
    // Warm overlay
    const warmOverlay = new Graphics();
    warmOverlay.rect(0, 0, MAP_W, MAP_H);
    warmOverlay.fill({ color: 0xFFF3E0, alpha: 0.04 });
    fxLayer.addChild(warmOverlay);

    // Color grading
    const colorMatrix = new ColorMatrixFilter();
    colorMatrix.saturate(0.12);
    world.filters = [colorMatrix];

    /* ====== ANIMATION ====== */
    app.ticker.add(() => {
      for (const c of cloudSprites) {
        c.x += 0.12;
        if (c.x > MAP_W + 50) c.x = -c.width;
      }
      for (const npc of npcs) {
        if (npc.waitTimer > 0) { npc.waitTimer--; continue; }
        const dx = npc.targetX - npc.sprite.x;
        const dy = npc.targetY - npc.sprite.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 2) {
          npc.waitTimer = 60 + Math.random() * 120;
          const tp = gridToScreen(
            2 + Math.floor(Math.random() * (GRID_COLS - 4)),
            2 + Math.floor(Math.random() * (GRID_ROWS - 4)),
          );
          npc.targetX = tp.x + (Math.random() - 0.5) * 30;
          npc.targetY = tp.y + (Math.random() - 0.5) * 15;
        } else {
          npc.sprite.x += (dx / dist) * npc.speed;
          npc.sprite.y += (dy / dist) * npc.speed;
          npc.sprite.scale.x = dx > 0 ? 0.25 : -0.25;
          npc.sprite.zIndex = npc.sprite.y;
        }
      }
    });
  }, [builtIds]);

  useEffect(() => {
    initApp();
    return () => {
      if (appRef.current) { appRef.current.destroy(true, { children: true }); appRef.current = null; }
    };
  }, [initApp]);

  // Click fallback (only fires if drag didn't move)
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const app = appRef.current;
    if (!app || !container) return;
    const rect = container.getBoundingClientRect();
    const world = app.stage.children[0];
    if (!world) return;
    const mx = (e.clientX - rect.left - world.x) / 1;
    const my = (e.clientY - rect.top - world.y) / 1;
    const gx = Math.floor(mx / TILE_W);
    const gy = Math.floor(my / TILE_H);
    const building = BUILDINGS.find(b => b.gridX === gx && b.gridY === gy);
    if (building) onTapRef.current(building.id);
  }, []);

  return (
    <div ref={containerRef} onClick={handleClick}
      style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: 12, touchAction: 'none' }} />
  );
}
