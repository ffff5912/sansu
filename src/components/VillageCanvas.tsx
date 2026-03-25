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

/* ====== Layout ====== */
const GRID_COLS = 6;
const GRID_ROWS = 6;
const TILE_W = 64;
const TILE_H = 64;
const SKY_H = 50;
const VILLAGE_W = GRID_COLS * TILE_W;
const VILLAGE_H = GRID_ROWS * TILE_H + SKY_H + 60;

function gridToScreen(gx: number, gy: number) {
  return { x: gx * TILE_W + TILE_W / 2, y: gy * TILE_H + TILE_H / 2 + SKY_H };
}
function screenToGrid(sx: number, sy: number) {
  return { gx: Math.floor(sx / TILE_W), gy: Math.floor((sy - SKY_H) / TILE_H) };
}

/** Extract a single tile from the tilemap spritesheet (64x64 tiles, 9 columns) */
function tileTexture(tilemapTex: Texture, col: number, row: number): Texture {
  return new Texture({
    source: tilemapTex.source,
    frame: new Rectangle(col * 64, row * 64, 64, 64),
  });
}

function createFrames(texture: Texture, frameCount: number, frameW: number, frameH: number): Texture[] {
  const frames: Texture[] = [];
  for (let i = 0; i < frameCount; i++) {
    frames.push(new Texture({
      source: texture.source,
      frame: new Rectangle(i * frameW, 0, frameW, frameH),
    }));
  }
  return frames;
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
    const app = new Application();
    await app.init({
      width: viewW, height: viewH,
      backgroundAlpha: 0,
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

    const scale = Math.min(viewW / VILLAGE_W, viewH / VILLAGE_H);
    const world = new Container();
    world.scale.set(scale);
    world.x = (viewW - VILLAGE_W * scale) / 2;
    world.y = (viewH - VILLAGE_H * scale) / 2;
    app.stage.addChild(world);

    /* ====== FULL GRASS BACKGROUND ====== */
    // Fill entire area with solid green to prevent any transparent gaps
    const bgFill = new Graphics();
    bgFill.rect(0, 0, VILLAGE_W, VILLAGE_H);
    bgFill.fill(0x5DAA5D);
    world.addChild(bgFill);

    /* ====== GROUND LAYER (tilemap grass) ====== */
    const groundLayer = new Container();
    world.addChild(groundLayer);
    const tilemapTex = Texture.from(TILEMAP_PATH);
    // Interior flat grass tiles (no edge fringe) — col 1-2, row 1 area
    const grassTile = tileTexture(tilemapTex, 1, 1);
    const grassTile2 = tileTexture(tilemapTex, 2, 1);
    // Path uses a slightly different grass shade for visual variety
    const pathTile = tileTexture(tilemapTex, 1, 0);

    // Fill ground area including sky zone with grass (seamless)
    const extraRows = Math.ceil(SKY_H / TILE_H) + 1;
    for (let gy = -extraRows; gy < GRID_ROWS + 2; gy++) {
      for (let gx = -1; gx < GRID_COLS + 1; gx++) {
        const isPath = (gx >= 0 && gx < GRID_COLS && gy >= 0 && gy < GRID_ROWS) && (gx === 3 || gy === 3);
        const tex = isPath ? pathTile : ((gx + gy) % 2 === 0 ? grassTile : grassTile2);
        const tile = new Sprite(tex);
        tile.x = gx * TILE_W;
        tile.y = gy * TILE_H + SKY_H;
        tile.width = TILE_W;
        tile.height = TILE_H;
        groundLayer.addChild(tile);
      }
    }

    /* ====== CLOUDS (floating above ground, with blur for depth) ====== */
    const cloudContainer = new Container();
    const cloudBlur = new BlurFilter({ strength: 1.5, quality: 2 });
    cloudContainer.filters = [cloudBlur];
    world.addChild(cloudContainer);
    const cloudSprites: Sprite[] = [];
    for (let i = 0; i < 4; i++) {
      const tex = Texture.from(CLOUD_PATHS[i % CLOUD_PATHS.length]);
      const c = new Sprite(tex);
      c.scale.set(0.12 + Math.random() * 0.08);
      c.x = Math.random() * VILLAGE_W;
      c.y = 2 + Math.random() * 25;
      c.alpha = 0.35 + Math.random() * 0.2;
      cloudContainer.addChild(c);
      cloudSprites.push(c);
    }

    /* ====== MAIN SORTABLE LAYER ====== */
    const sortLayer = new Container();
    sortLayer.sortableChildren = true;
    world.addChild(sortLayer);

    // Shadow texture for buildings
    const shadowTex = Texture.from(SHADOW_PATH);

    // === TREES ===
    const treeSpots = [
      { gx: 0, gy: 0 }, { gx: 1, gy: 0 }, { gx: 5, gy: 0 },
      { gx: 5, gy: 2 }, { gx: 0, gy: 5 }, { gx: 5, gy: 5 },
    ];
    for (const spot of treeSpots) {
      if (BUILDINGS.some(b => b.gridX === spot.gx && b.gridY === spot.gy)) continue;
      const treePath = TREE_PATHS[Math.floor(Math.random() * TREE_PATHS.length)];
      const tex = Texture.from(treePath);
      const frameW = tex.width / 8;
      const frames = createFrames(tex, 8, frameW, tex.height);
      const tree = new AnimatedSprite(frames);
      tree.animationSpeed = 0.06;
      tree.play();
      tree.anchor.set(0.5, 0.85);
      const pos = gridToScreen(spot.gx, spot.gy);
      tree.x = pos.x; tree.y = pos.y;
      tree.scale.set(0.38);
      tree.zIndex = pos.y;
      sortLayer.addChild(tree);
    }

    // === BUSHES ===
    const bushSpots = [
      { gx: 2, gy: 0 }, { gx: 4, gy: 0 }, { gx: 0, gy: 2 },
      { gx: 5, gy: 4 }, { gx: 4, gy: 5 },
    ];
    for (const spot of bushSpots) {
      if (BUILDINGS.some(b => b.gridX === spot.gx && b.gridY === spot.gy)) continue;
      const tex = Texture.from(BUSH_PATHS[Math.floor(Math.random() * BUSH_PATHS.length)]);
      const bush = new Sprite(tex);
      bush.anchor.set(0.5, 0.7);
      const pos = gridToScreen(spot.gx, spot.gy);
      bush.x = pos.x; bush.y = pos.y;
      bush.scale.set(0.28);
      bush.zIndex = pos.y;
      sortLayer.addChild(bush);
    }

    // === BUILDINGS ===
    for (const b of BUILDINGS) {
      const pos = gridToScreen(b.gridX, b.gridY);
      const bc = new Container();
      bc.x = pos.x; bc.y = pos.y;
      bc.zIndex = pos.y + 1;
      bc.eventMode = 'static';
      bc.cursor = 'pointer';
      const bid = b.id;
      bc.on('pointertap', () => onTapRef.current(bid));

      if (builtIds.includes(b.id)) {
        // Shadow
        const shadow = new Sprite(shadowTex);
        shadow.anchor.set(0.5, 0.5);
        shadow.y = 14;
        shadow.scale.set(0.5, 0.25);
        shadow.alpha = 0.3;
        bc.addChild(shadow);

        const spritePath = BUILDING_SPRITES[b.id];
        if (spritePath) {
          const sprite = new Sprite(Texture.from(spritePath));
          sprite.anchor.set(0.5, 0.85);
          sprite.scale.set(0.5);
          bc.addChild(sprite);
        }
        // Label with HD-2D style glow
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
        label.anchor.set(0.5, 0);
        label.y = 14;
        bc.addChild(label);
      } else {
        // Construction site
        const site = new Graphics();
        site.roundRect(-26, -26, 52, 52, 6);
        site.fill({ color: 0x000000, alpha: 0.08 });
        site.stroke({ color: 0x888888, width: 1.5 });
        bc.addChild(site);

        // Hammer icon from asset
        const hammer = new Sprite(Texture.from(TOOL_HAMMER_PATH));
        hammer.anchor.set(0.5, 0.5);
        hammer.scale.set(0.7);
        hammer.y = -6;
        bc.addChild(hammer);

        // Gold cost with coin icon
        const costContainer = new Container();
        const coinIcon = new Sprite(Texture.from(GOLD_ICON_PATH));
        coinIcon.anchor.set(0.5, 0.5);
        coinIcon.scale.set(0.28);
        costContainer.addChild(coinIcon);
        const costText = new Text({
          text: `${b.cost}`,
          style: new TextStyle({
            fontFamily: '"Zen Maru Gothic", sans-serif',
            fontSize: 10, fontWeight: 'bold',
            fill: '#F39C12',
            stroke: { color: '#ffffff', width: 2 },
          }),
        });
        costText.anchor.set(0, 0.5);
        costText.x = 10;
        costContainer.addChild(costText);
        costContainer.x = -12;
        costContainer.y = 16;
        bc.addChild(costContainer);
      }
      sortLayer.addChild(bc);
    }

    // === NPCs ===
    const pawnTex = Texture.from(PAWN_RUN_PATH);
    const pawnFrames = createFrames(pawnTex, 6, pawnTex.width / 6, pawnTex.height);
    const npcs: NPCState[] = [];
    for (let i = 0; i < 5; i++) {
      const npc = new AnimatedSprite(pawnFrames);
      npc.animationSpeed = 0.1;
      npc.play();
      npc.anchor.set(0.5, 0.8);
      npc.scale.set(0.3);
      const gx = 1 + Math.floor(Math.random() * (GRID_COLS - 2));
      const gy = 1 + Math.floor(Math.random() * (GRID_ROWS - 2));
      const pos = gridToScreen(gx, gy);
      npc.x = pos.x + (Math.random() - 0.5) * 20;
      npc.y = pos.y + (Math.random() - 0.5) * 10;
      npc.zIndex = npc.y;
      sortLayer.addChild(npc);
      npcs.push({ sprite: npc, targetX: npc.x, targetY: npc.y,
        speed: 0.4 + Math.random() * 0.3, waitTimer: Math.random() * 120 });
    }

    // === SHEEP ===
    const sheepTex = Texture.from(SHEEP_IDLE_PATH);
    const sheepFrames = createFrames(sheepTex, 6, sheepTex.width / 6, sheepTex.height);
    for (let i = 0; i < 2; i++) {
      const sheep = new AnimatedSprite(sheepFrames);
      sheep.animationSpeed = 0.06; sheep.play();
      sheep.anchor.set(0.5, 0.7); sheep.scale.set(0.35);
      const pos = gridToScreen(4 + i, 5);
      sheep.x = pos.x + (Math.random() - 0.5) * 20;
      sheep.y = pos.y; sheep.zIndex = pos.y;
      sortLayer.addChild(sheep);
    }

    /* ====== HD-2D FOREGROUND EFFECTS ====== */
    const fxLayer = new Container();
    world.addChild(fxLayer);

    // Depth-of-field: blur bottom edge (near camera)
    const dofBottom = new Graphics();
    dofBottom.rect(0, VILLAGE_H - 40, VILLAGE_W, 40);
    dofBottom.fill(0x000000);
    dofBottom.alpha = 0;
    const dofBlur = new BlurFilter({ strength: 3, quality: 2 });
    dofBottom.filters = [dofBlur];
    fxLayer.addChild(dofBottom);

    // Vignette overlay
    const vignette = new Graphics();
    vignette.rect(0, 0, VILLAGE_W, VILLAGE_H);
    vignette.fill(0x000000);
    vignette.alpha = 0.15;
    // Create a radial "hole" effect by overlaying semi-transparent edges
    const vignetteEdge = new Graphics();
    // Top edge
    vignetteEdge.rect(0, 0, VILLAGE_W, 15);
    vignetteEdge.fill({ color: 0x000000, alpha: 0.2 });
    // Bottom edge
    vignetteEdge.rect(0, VILLAGE_H - 15, VILLAGE_W, 15);
    vignetteEdge.fill({ color: 0x000000, alpha: 0.25 });
    // Left edge
    vignetteEdge.rect(0, 0, 15, VILLAGE_H);
    vignetteEdge.fill({ color: 0x000000, alpha: 0.15 });
    // Right edge
    vignetteEdge.rect(VILLAGE_W - 15, 0, 15, VILLAGE_H);
    vignetteEdge.fill({ color: 0x000000, alpha: 0.15 });
    fxLayer.addChild(vignetteEdge);

    // Light rays (subtle golden overlay particles)
    const lightRays: { sprite: Graphics; baseX: number; speed: number }[] = [];
    for (let i = 0; i < 6; i++) {
      const ray = new Graphics();
      const rx = Math.random() * VILLAGE_W;
      ray.rect(-2, 0, 4, 60 + Math.random() * 80);
      ray.fill({ color: 0xFFE082, alpha: 0.03 + Math.random() * 0.04 });
      ray.x = rx; ray.y = 0;
      ray.rotation = -0.1 + Math.random() * 0.2;
      fxLayer.addChild(ray);
      lightRays.push({ sprite: ray, baseX: rx, speed: 0.02 + Math.random() * 0.03 });
    }

    // Color warmth overlay (HD-2D warm tone)
    const warmOverlay = new Graphics();
    warmOverlay.rect(0, 0, VILLAGE_W, VILLAGE_H);
    warmOverlay.fill({ color: 0xFFF3E0, alpha: 0.06 });
    fxLayer.addChild(warmOverlay);

    // Subtle color grading on entire world
    const colorMatrix = new ColorMatrixFilter();
    colorMatrix.saturate(0.15); // slightly boost saturation
    world.filters = [colorMatrix];

    /* ====== ANIMATION LOOP ====== */
    let frame = 0;
    app.ticker.add(() => {
      frame++;
      // Clouds
      for (const c of cloudSprites) {
        c.x += 0.12;
        if (c.x > VILLAGE_W + 50) c.x = -c.width;
      }
      // NPCs
      for (const npc of npcs) {
        if (npc.waitTimer > 0) { npc.waitTimer--; continue; }
        const dx = npc.targetX - npc.sprite.x;
        const dy = npc.targetY - npc.sprite.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 2) {
          npc.waitTimer = 60 + Math.random() * 120;
          const tp = gridToScreen(
            Math.floor(Math.random() * GRID_COLS),
            1 + Math.floor(Math.random() * (GRID_ROWS - 1)),
          );
          npc.targetX = tp.x + (Math.random() - 0.5) * 30;
          npc.targetY = tp.y + (Math.random() - 0.5) * 15;
        } else {
          npc.sprite.x += (dx / dist) * npc.speed;
          npc.sprite.y += (dy / dist) * npc.speed;
          npc.sprite.scale.x = dx > 0 ? 0.3 : -0.3;
          npc.sprite.zIndex = npc.sprite.y;
        }
      }
      // Light rays sway
      for (const lr of lightRays) {
        lr.sprite.x = lr.baseX + Math.sin(frame * lr.speed) * 15;
        lr.sprite.alpha = 0.03 + Math.sin(frame * 0.01 + lr.baseX) * 0.02;
      }
    });
  }, [builtIds]);

  useEffect(() => {
    initApp();
    return () => {
      if (appRef.current) { appRef.current.destroy(true, { children: true }); appRef.current = null; }
    };
  }, [initApp]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!appRef.current || !container) return;
    const rect = container.getBoundingClientRect();
    const viewW = container.clientWidth;
    const viewH = container.clientHeight;
    const s = Math.min(viewW / VILLAGE_W, viewH / VILLAGE_H);
    const offX = (viewW - VILLAGE_W * s) / 2;
    const offY = (viewH - VILLAGE_H * s) / 2;
    const mx = (e.clientX - rect.left - offX) / s;
    const my = (e.clientY - rect.top - offY) / s;
    const { gx, gy } = screenToGrid(mx, my);
    const building = BUILDINGS.find(b => b.gridX === gx && b.gridY === gy);
    if (building) onTapRef.current(building.id);
  }, []);

  return (
    <div ref={containerRef} onClick={handleClick}
      style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: 12 }} />
  );
}
