import { useRef, useEffect, useCallback } from 'react';
import { Application, Assets, Sprite, Texture, Container, AnimatedSprite, Graphics, Text, TextStyle, Rectangle, BlurFilter, ColorMatrixFilter } from 'pixi.js';
import { BUILDINGS } from '../data/buildings.ts';
import type { VillagerDef } from '../data/types.ts';
import type { MonumentDef } from '../data/villageProgression.ts';
import { getVillageLevelInfo } from '../data/villageProgression.ts';

interface VillageCanvasProps {
  builtIds: string[];
  villageLv: number;
  villagers: VillagerDef[];
  monuments: MonumentDef[];
  onTapBuilding: (id: string) => void;
  onTapVillager: (id: string) => void;
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
  smithy:   `${A}/Buildings/Red Buildings/House2.png`,
  school:   `${A}/Buildings/Purple Buildings/House1.png`,
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
const CASTLE_PATH = `${A}/Buildings/Blue Buildings/Castle.png`;
const TILEMAP2_PATH = `${A}/Terrain/Tileset/Tilemap_color3.png`;

/* ====== Expanded Layout (scrollable) ====== */
const GRID_COLS = 20;
const GRID_ROWS = 20;
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

export default function VillageCanvas({ builtIds, villageLv, villagers, monuments, onTapBuilding, onTapVillager }: VillageCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const onTapRef = useRef(onTapBuilding);
  useEffect(() => { onTapRef.current = onTapBuilding; }, [onTapBuilding]);
  const onTapVillagerRef = useRef(onTapVillager);
  useEffect(() => { onTapVillagerRef.current = onTapVillager; }, [onTapVillager]);
  // Persist scroll position and zoom across re-inits
  const scrollRef = useRef<{ x: number; y: number } | null>(null);
  const zoomRef = useRef(1);

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
      TOOL_HAMMER_PATH, GOLD_ICON_PATH, SHADOW_PATH, CASTLE_PATH, TILEMAP2_PATH,
      ...villagers.map(v => v.sprite),
    ];
    await Assets.load(allPaths);

    /* ====== WORLD (draggable + zoomable) ====== */
    const world = new Container();
    let currentZoom = zoomRef.current;
    world.scale.set(currentZoom);
    // Restore or center scroll position
    if (scrollRef.current) {
      world.x = scrollRef.current.x;
      world.y = scrollRef.current.y;
    } else {
      world.x = viewW / 2 - MAP_W * currentZoom / 2;
      world.y = viewH / 2 - MAP_H * currentZoom / 2;
    }
    app.stage.addChild(world);

    /* ====== DRAG TO SCROLL ====== */
    let dragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let worldStartX = 0;
    let worldStartY = 0;
    let dragMoved = false;

    const clampWorld = () => {
      const scaledW = MAP_W * currentZoom;
      const scaledH = MAP_H * currentZoom;
      const minX = viewW - scaledW;
      const minY = viewH - scaledH;
      world.x = Math.min(0, Math.max(minX, world.x));
      world.y = Math.min(0, Math.max(minY, world.y));
      // Save scroll position
      scrollRef.current = { x: world.x, y: world.y };
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

    /* ====== PINCH ZOOM + WHEEL ZOOM ====== */
    let lastPinchDist = 0;
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastPinchDist = Math.sqrt(dx * dx + dy * dy);
      }
    }, { passive: true });
    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (lastPinchDist > 0) {
          const delta = dist / lastPinchDist;
          currentZoom = Math.min(2, Math.max(0.5, currentZoom * delta));
          world.scale.set(currentZoom);
          zoomRef.current = currentZoom;
          clampWorld();
        }
        lastPinchDist = dist;
      }
    }, { passive: true });
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      currentZoom = Math.min(2, Math.max(0.5, currentZoom * delta));
      world.scale.set(currentZoom);
      zoomRef.current = currentZoom;
      clampWorld();
    }, { passive: false });

    /* ====== GROUND ====== */
    const tilemapTex = Texture.from(TILEMAP_PATH);
    const tilemapTex2 = Texture.from(TILEMAP2_PATH);
    const lvInfo = getVillageLevelInfo(villageLv);
    // Ground tiles based on village level
    let grassTile: Texture, grassTile2: Texture, pathTile: Texture;
    if (lvInfo.groundType === 'dirt') {
      grassTile = tileTexture(tilemapTex, 3, 0);
      grassTile2 = tileTexture(tilemapTex, 4, 0);
      pathTile = tileTexture(tilemapTex, 1, 0);
    } else if (lvInfo.groundType === 'stone') {
      grassTile = tileTexture(tilemapTex2, 1, 1);
      grassTile2 = tileTexture(tilemapTex2, 2, 1);
      pathTile = tileTexture(tilemapTex2, 5, 4);
    } else {
      // grass or flower
      grassTile = tileTexture(tilemapTex, 1, 1);
      grassTile2 = tileTexture(tilemapTex, 2, 1);
      pathTile = tileTexture(tilemapTex, 1, 0);
    }

    const groundLayer = new Container();
    world.addChild(groundLayer);
    for (let gy = 0; gy < GRID_ROWS; gy++) {
      for (let gx = 0; gx < GRID_COLS; gx++) {
        const isPath = gx === 10 || gy === 10;
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
    // Trees scattered around the expanded 20x20 map
    const treeSpots = [
      { gx: 0, gy: 0 }, { gx: 3, gy: 0 }, { gx: 7, gy: 0 }, { gx: 12, gy: 0 }, { gx: 16, gy: 0 }, { gx: 19, gy: 0 },
      { gx: 0, gy: 4 }, { gx: 19, gy: 4 }, { gx: 0, gy: 8 }, { gx: 19, gy: 8 },
      { gx: 0, gy: 12 }, { gx: 19, gy: 12 }, { gx: 0, gy: 16 }, { gx: 19, gy: 16 },
      { gx: 0, gy: 19 }, { gx: 5, gy: 19 }, { gx: 14, gy: 19 }, { gx: 19, gy: 19 },
      { gx: 1, gy: 1 }, { gx: 18, gy: 1 }, { gx: 1, gy: 18 }, { gx: 18, gy: 18 },
      { gx: 15, gy: 3 }, { gx: 4, gy: 15 }, { gx: 15, gy: 15 },
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
      { gx: 2, gy: 2 }, { gx: 6, gy: 0 }, { gx: 17, gy: 2 },
      { gx: 4, gy: 6 }, { gx: 15, gy: 6 },
      { gx: 3, gy: 13 }, { gx: 16, gy: 13 },
      { gx: 7, gy: 19 }, { gx: 12, gy: 19 },
      { gx: 2, gy: 10 }, { gx: 17, gy: 10 },
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
    for (let i = 0; i < 4; i++) {
      const sheep = new AnimatedSprite(sheepFrames);
      sheep.animationSpeed = 0.06; sheep.play();
      sheep.anchor.set(0.5, 0.7); sheep.scale.set(0.3);
      const pos = gridToScreen(13 + i, 16);
      sheep.x = pos.x + (Math.random() - 0.5) * 20;
      sheep.y = pos.y; sheep.zIndex = pos.y;
      sortLayer.addChild(sheep);
    }

    // === CASTLE (village Lv5) ===
    if (lvInfo.hasCastle) {
      const castleTex = Texture.from(CASTLE_PATH);
      const castle = new Sprite(castleTex);
      castle.anchor.set(0.5, 0.85);
      castle.scale.set(0.55);
      const cPos = gridToScreen(10, 5);
      castle.x = cPos.x; castle.y = cPos.y;
      castle.zIndex = cPos.y + 2;
      sortLayer.addChild(castle);
      // Castle label
      const cLabel = new Text({
        text: 'さんすう王国 おしろ',
        style: new TextStyle({
          fontFamily: '"Zen Maru Gothic", sans-serif', fontSize: 10, fontWeight: 'bold',
          fill: '#FFD700', stroke: { color: '#1a1a2e', width: 3 },
        }),
      });
      cLabel.anchor.set(0.5, 0); cLabel.x = cPos.x; cLabel.y = cPos.y + 20;
      cLabel.zIndex = cPos.y + 3;
      sortLayer.addChild(cLabel);
    }

    // === WALLS (village Lv3+) ===
    if (lvInfo.hasWalls) {
      const wallGraphics = new Graphics();
      const wallInset = TILE_W * 2;
      wallGraphics.roundRect(wallInset, wallInset, MAP_W - wallInset * 2, MAP_H - wallInset * 2, 12);
      wallGraphics.stroke({ color: 0x8B7355, width: 4, alpha: 0.5 });
      wallGraphics.zIndex = -1;
      sortLayer.addChild(wallGraphics);
    }

    // === VILLAGERS (from progression) ===
    for (let i = 0; i < villagers.length; i++) {
      const v = villagers[i];
      try {
        const vTex = Texture.from(v.sprite);
        const vFrames = createFrames(vTex, 8, vTex.width / 8, vTex.height);
        const vSprite = new AnimatedSprite(vFrames);
        vSprite.animationSpeed = 0.07; vSprite.play();
        vSprite.anchor.set(0.5, 0.8); vSprite.scale.set(0.25);
        // Spread villagers around the village center
        const angle = (i / Math.max(villagers.length, 1)) * Math.PI * 2;
        const radius = 3 + (i % 3);
        const vgx = Math.round(10 + Math.cos(angle) * radius);
        const vgy = Math.round(10 + Math.sin(angle) * radius);
        const vPos = gridToScreen(Math.max(2, Math.min(17, vgx)), Math.max(2, Math.min(17, vgy)));
        vSprite.x = vPos.x; vSprite.y = vPos.y;
        vSprite.zIndex = vPos.y;
        vSprite.eventMode = 'static'; vSprite.cursor = 'pointer';
        const vid = v.id;
        vSprite.on('pointertap', () => { if (!dragMoved) onTapVillagerRef.current(vid); });
        sortLayer.addChild(vSprite);
      } catch { /* skip if sprite fails to load */ }
    }

    // === MONUMENTS (boss trophies) ===
    for (let i = 0; i < monuments.length; i++) {
      const m = monuments[i];
      const mPos = gridToScreen(4 + (i % 6) * 2, 14 + Math.floor(i / 6) * 2);
      const mText = new Text({
        text: m.emoji,
        style: new TextStyle({ fontSize: 24 }),
      });
      mText.anchor.set(0.5, 0.5);
      mText.x = mPos.x; mText.y = mPos.y - 8;
      mText.zIndex = mPos.y;
      sortLayer.addChild(mText);
      // Pedestal
      const pedestal = new Graphics();
      pedestal.roundRect(mPos.x - 12, mPos.y, 24, 8, 3);
      pedestal.fill(0x8B7355);
      pedestal.zIndex = mPos.y - 1;
      sortLayer.addChild(pedestal);
      // Name
      const mLabel = new Text({
        text: m.name,
        style: new TextStyle({
          fontFamily: '"Zen Maru Gothic", sans-serif', fontSize: 7, fontWeight: 'bold',
          fill: '#fff', stroke: { color: '#000', width: 2 },
        }),
      });
      mLabel.anchor.set(0.5, 0); mLabel.x = mPos.x; mLabel.y = mPos.y + 8;
      mLabel.zIndex = mPos.y + 1;
      sortLayer.addChild(mLabel);
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
  }, [builtIds, villageLv, villagers, monuments]);

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
