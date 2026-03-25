import { useRef, useEffect } from 'react';
import {
  Application, Assets, Sprite, Texture, Container, AnimatedSprite,
  Graphics, Rectangle, BlurFilter, ColorMatrixFilter,
} from 'pixi.js';
import type { TileMap, Position } from '../data/types.ts';
import { TILE_SIZE, computeCamera, getEnemyKey } from '../lib/gameEngine.ts';

interface DungeonCanvasProps {
  map: TileMap;
  playerPos: Position;
  defeatedEnemies: Set<string>;
  doorOpen: boolean;
}

/* ====== Asset paths ====== */
const A = '/assets/tiny-swords';
const TILEMAP_PATH = `${A}/Terrain/Tileset/Tilemap_color2.png`;
const PLAYER_IDLE_PATH = `${A}/Units/Blue Units/Warrior/Warrior_Idle.png`;
const PLAYER_RUN_PATH = `${A}/Units/Blue Units/Warrior/Warrior_Run.png`;
const ENEMY_IDLE_PATH = `${A}/Units/Red Units/Pawn/Pawn_Idle.png`;
const BOSS_IDLE_PATH = `${A}/Units/Red Units/Warrior/Warrior_Idle.png`;
const SHADOW_PATH = `${A}/Terrain/Tileset/Shadow.png`;
const ROCK_PATHS = [
  `${A}/Terrain/Decorations/Rocks/Rock1.png`,
  `${A}/Terrain/Decorations/Rocks/Rock2.png`,
  `${A}/Terrain/Decorations/Rocks/Rock3.png`,
  `${A}/Terrain/Decorations/Rocks/Rock4.png`,
];
const DUST_PATH = `${A}/Particle FX/Dust_01.png`;
const DOOR_SPRITE_PATH = `${A}/Buildings/Blue Buildings/Tower.png`;
const CHEST_GOLD_PATH = `${A}/Terrain/Resources/Gold/Gold Stones/Gold Stone 3.png`;

function createFrames(texture: Texture, count: number, fw: number, fh: number): Texture[] {
  return Array.from({ length: count }, (_, i) =>
    new Texture({ source: texture.source, frame: new Rectangle(i * fw, 0, fw, fh) })
  );
}

/* ====== Smooth camera ====== */
interface SmoothCam { x: number; y: number; }

export default function DungeonCanvas({ map, playerPos, defeatedEnemies, doorOpen }: DungeonCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const posRef = useRef(playerPos);
  const defeatedRef = useRef(defeatedEnemies);
  const doorRef = useRef(doorOpen);

  // Keep refs in sync via effects
  useEffect(() => { posRef.current = playerPos; }, [playerPos]);
  useEffect(() => { defeatedRef.current = defeatedEnemies; }, [defeatedEnemies]);
  useEffect(() => { doorRef.current = doorOpen; }, [doorOpen]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let destroyed = false;

    const setup = async () => {
      const viewW = el.clientWidth;
      const viewH = el.clientHeight;
      if (viewW === 0 || viewH === 0) return;

      const app = new Application();
      await app.init({
        width: viewW, height: viewH,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true, antialias: true,
        backgroundAlpha: 1, backgroundColor: 0x1a1a2e,
      });
      if (destroyed) { app.destroy(true); return; }
      el.appendChild(app.canvas as HTMLCanvasElement);
      appRef.current = app;

      // Preload assets
      const allPaths = [
        TILEMAP_PATH, PLAYER_IDLE_PATH, PLAYER_RUN_PATH,
        ENEMY_IDLE_PATH, BOSS_IDLE_PATH, SHADOW_PATH,
        ...ROCK_PATHS, DUST_PATH, DOOR_SPRITE_PATH, CHEST_GOLD_PATH,
      ];
      await Assets.load(allPaths);
      if (destroyed) { app.destroy(true); return; }

      // Tilemap textures (64x64 tiles, 9 cols, 6 rows)
      const tilemapTex = Texture.from(TILEMAP_PATH);
      const tileT = (col: number, row: number) =>
        new Texture({ source: tilemapTex.source, frame: new Rectangle(col * 64, row * 64, 64, 64) });

      const grassTex = [tileT(3, 0), tileT(4, 0)];
      const wallTex = [tileT(6, 3), tileT(7, 3)];
      const pathTex = tileT(3, 1);

      // Sprite frames
      const playerIdleTex = Texture.from(PLAYER_IDLE_PATH);
      const playerIdleFrames = createFrames(playerIdleTex, 8, playerIdleTex.width / 8, playerIdleTex.height);
      const playerRunTex = Texture.from(PLAYER_RUN_PATH);
      const playerRunFrames = createFrames(playerRunTex, 6, playerRunTex.width / 6, playerRunTex.height);
      const enemyIdleTex = Texture.from(ENEMY_IDLE_PATH);
      const enemyIdleFrames = createFrames(enemyIdleTex, 8, enemyIdleTex.width / 8, enemyIdleTex.height);
      const bossIdleTex = Texture.from(BOSS_IDLE_PATH);
      const bossIdleFrames = createFrames(bossIdleTex, 8, bossIdleTex.width / 8, bossIdleTex.height);
      const shadowTex = Texture.from(SHADOW_PATH);
      const dustTex = Texture.from(DUST_PATH);
      const dustFrames = createFrames(dustTex, 8, dustTex.width / 8, dustTex.height);

      /* ====== WORLD CONTAINER ====== */
      const world = new Container();
      app.stage.addChild(world);

      /* ====== BACKGROUND LAYER (blurred for depth) ====== */
      const bgLayer = new Container();
      const bgBlur = new BlurFilter({ strength: 1.5, quality: 2 });
      bgLayer.filters = [bgBlur];
      world.addChild(bgLayer);

      // Draw all wall tiles in bg layer (they are "far away" walls)
      for (let y = 0; y < map.height; y++) {
        for (let x = 0; x < map.width; x++) {
          const tile = map.tiles[y][x];
          if (tile === '#') {
            const wallSprite = new Sprite(wallTex[(x + y) % 2]);
            wallSprite.x = x * TILE_SIZE;
            wallSprite.y = y * TILE_SIZE;
            wallSprite.width = TILE_SIZE;
            wallSprite.height = TILE_SIZE;
            bgLayer.addChild(wallSprite);
          }
        }
      }

      /* ====== FLOOR LAYER ====== */
      const floorLayer = new Container();
      world.addChild(floorLayer);

      for (let y = 0; y < map.height; y++) {
        for (let x = 0; x < map.width; x++) {
          const tile = map.tiles[y][x];
          if (tile !== '#') {
            const isPath = tile === 'D' || tile === 'S';
            const tex = isPath ? pathTex : grassTex[(x + y) % 2];
            const floorSprite = new Sprite(tex);
            floorSprite.x = x * TILE_SIZE;
            floorSprite.y = y * TILE_SIZE;
            floorSprite.width = TILE_SIZE;
            floorSprite.height = TILE_SIZE;
            floorLayer.addChild(floorSprite);

            // Random rock decorations on empty floor tiles
            if (tile === '.' && Math.random() < 0.08) {
              const rockTex = Texture.from(ROCK_PATHS[Math.floor(Math.random() * ROCK_PATHS.length)]);
              const rock = new Sprite(rockTex);
              rock.anchor.set(0.5, 0.5);
              rock.x = x * TILE_SIZE + TILE_SIZE / 2 + (Math.random() - 0.5) * 10;
              rock.y = y * TILE_SIZE + TILE_SIZE / 2 + (Math.random() - 0.5) * 10;
              rock.scale.set(0.4 + Math.random() * 0.3);
              rock.alpha = 0.6;
              floorLayer.addChild(rock);
            }
          }
        }
      }

      /* ====== ENTITY LAYER (sorted) ====== */
      const entityLayer = new Container();
      entityLayer.sortableChildren = true;
      world.addChild(entityLayer);

      // Door sprite
      const doorTex = Texture.from(DOOR_SPRITE_PATH);
      const doorSprites: Sprite[] = [];
      for (let y = 0; y < map.height; y++) {
        for (let x = 0; x < map.width; x++) {
          if (map.tiles[y][x] === 'D') {
            const door = new Sprite(doorTex);
            door.anchor.set(0.5, 0.85);
            door.x = x * TILE_SIZE + TILE_SIZE / 2;
            door.y = y * TILE_SIZE + TILE_SIZE / 2;
            door.scale.set(0.25);
            door.zIndex = y * TILE_SIZE + TILE_SIZE;
            entityLayer.addChild(door);
            doorSprites.push(door);
          }
        }
      }

      // Chest sprites
      const chestTex = Texture.from(CHEST_GOLD_PATH);
      for (let y = 0; y < map.height; y++) {
        for (let x = 0; x < map.width; x++) {
          if (map.tiles[y][x] === 'C') {
            const chest = new Sprite(chestTex);
            chest.anchor.set(0.5, 0.5);
            chest.x = x * TILE_SIZE + TILE_SIZE / 2;
            chest.y = y * TILE_SIZE + TILE_SIZE / 2;
            chest.scale.set(0.6);
            chest.zIndex = y * TILE_SIZE + TILE_SIZE;
            entityLayer.addChild(chest);
          }
        }
      }

      // Enemy sprites
      interface EnemySprite { sprite: AnimatedSprite; key: string; shadow: Sprite; }
      const enemySprites: EnemySprite[] = [];
      for (let y = 0; y < map.height; y++) {
        for (let x = 0; x < map.width; x++) {
          const tile = map.tiles[y][x];
          if (tile === 'E' || tile === 'B') {
            const frames = tile === 'B' ? bossIdleFrames : enemyIdleFrames;
            const enemy = new AnimatedSprite(frames);
            enemy.animationSpeed = 0.08;
            enemy.play();
            enemy.anchor.set(0.5, 0.8);
            enemy.x = x * TILE_SIZE + TILE_SIZE / 2;
            enemy.y = y * TILE_SIZE + TILE_SIZE / 2;
            enemy.scale.set(tile === 'B' ? 0.35 : 0.3);
            enemy.zIndex = y * TILE_SIZE + TILE_SIZE;
            const shadow = new Sprite(shadowTex);
            shadow.anchor.set(0.5, 0.5);
            shadow.x = enemy.x;
            shadow.y = enemy.y + 8;
            shadow.scale.set(0.1, 0.04);
            shadow.alpha = 0.3;
            shadow.zIndex = y * TILE_SIZE + TILE_SIZE - 1;
            entityLayer.addChild(shadow);
            entityLayer.addChild(enemy);
            enemySprites.push({ sprite: enemy, key: getEnemyKey(x, y), shadow });
          }
        }
      }

      // Player sprite
      const playerSprite = new AnimatedSprite(playerIdleFrames);
      playerSprite.animationSpeed = 0.1;
      playerSprite.play();
      playerSprite.anchor.set(0.5, 0.8);
      playerSprite.scale.set(0.32);
      playerSprite.x = posRef.current.x * TILE_SIZE + TILE_SIZE / 2;
      playerSprite.y = posRef.current.y * TILE_SIZE + TILE_SIZE / 2;
      playerSprite.zIndex = 10000;
      entityLayer.addChild(playerSprite);

      // Player shadow
      const playerShadow = new Sprite(shadowTex);
      playerShadow.anchor.set(0.5, 0.5);
      playerShadow.scale.set(0.08, 0.03);
      playerShadow.alpha = 0.3;
      playerShadow.zIndex = 9999;
      entityLayer.addChild(playerShadow);

      // Dust particle container
      const dustContainer = new Container();
      dustContainer.zIndex = 10001;
      entityLayer.addChild(dustContainer);

      /* ====== FX LAYER ====== */
      const fxLayer = new Container();
      world.addChild(fxLayer);

      // Vignette
      const vignette = new Graphics();
      const mapPxW = map.width * TILE_SIZE;
      const mapPxH = map.height * TILE_SIZE;
      // Top/bottom edge darkness
      vignette.rect(0, 0, mapPxW, 20);
      vignette.fill({ color: 0x000000, alpha: 0.15 });
      vignette.rect(0, mapPxH - 20, mapPxW, 20);
      vignette.fill({ color: 0x000000, alpha: 0.2 });
      fxLayer.addChild(vignette);

      // Light rays
      const lightRays: Graphics[] = [];
      for (let i = 0; i < 4; i++) {
        const ray = new Graphics();
        const rx = Math.random() * mapPxW;
        ray.rect(-2, 0, 4, 30 + Math.random() * 40);
        ray.fill({ color: 0xFFE082, alpha: 0.04 });
        ray.x = rx;
        ray.y = 0;
        ray.rotation = -0.05 + Math.random() * 0.1;
        fxLayer.addChild(ray);
        lightRays.push(ray);
      }

      // Overall color grade
      const colorGrade = new ColorMatrixFilter();
      colorGrade.saturate(0.1);
      world.filters = [colorGrade];

      /* ====== SMOOTH CAMERA ====== */
      const cam: SmoothCam = {
        x: posRef.current.x * TILE_SIZE + TILE_SIZE / 2,
        y: posRef.current.y * TILE_SIZE + TILE_SIZE / 2,
      };
      let prevPosX = posRef.current.x;
      let prevPosY = posRef.current.y;
      let frame = 0;

      /* ====== TICK ====== */
      app.ticker.add(() => {
        frame++;

        // Target camera position
        const targetCam = computeCamera(posRef.current, map.width, map.height, viewW, viewH);
        // Smooth interpolation for camera
        const targetWorldX = targetCam.offsetX;
        const targetWorldY = targetCam.offsetY;
        const currentWorldX = world.x;
        const currentWorldY = world.y;
        world.x += (targetWorldX - currentWorldX) * 0.12;
        world.y += (targetWorldY - currentWorldY) * 0.12;

        // Smooth player movement
        const targetPx = posRef.current.x * TILE_SIZE + TILE_SIZE / 2;
        const targetPy = posRef.current.y * TILE_SIZE + TILE_SIZE / 2;
        cam.x += (targetPx - cam.x) * 0.18;
        cam.y += (targetPy - cam.y) * 0.18;
        playerSprite.x = cam.x;
        playerSprite.y = cam.y;
        playerShadow.x = cam.x;
        playerShadow.y = cam.y + 8;
        playerSprite.zIndex = cam.y + TILE_SIZE;

        // Detect movement for run animation + direction flip + dust
        const isMoving = Math.abs(targetPx - cam.x) > 1 || Math.abs(targetPy - cam.y) > 1;
        if (isMoving) {
          if (playerSprite.textures !== playerRunFrames) {
            playerSprite.textures = playerRunFrames;
            playerSprite.animationSpeed = 0.15;
            playerSprite.play();
          }
          // Direction
          if (targetPx < cam.x) playerSprite.scale.x = -0.32;
          else if (targetPx > cam.x) playerSprite.scale.x = 0.32;
        } else {
          if (playerSprite.textures !== playerIdleFrames) {
            playerSprite.textures = playerIdleFrames;
            playerSprite.animationSpeed = 0.1;
            playerSprite.play();
          }
        }

        // Spawn dust when player moves to new tile
        if (posRef.current.x !== prevPosX || posRef.current.y !== prevPosY) {
          prevPosX = posRef.current.x;
          prevPosY = posRef.current.y;
          const dust = new AnimatedSprite(dustFrames);
          dust.animationSpeed = 0.2;
          dust.loop = false;
          dust.anchor.set(0.5, 0.5);
          dust.x = cam.x;
          dust.y = cam.y + 5;
          dust.scale.set(0.25);
          dust.alpha = 0.5;
          dust.play();
          dust.onComplete = () => { dustContainer.removeChild(dust); dust.destroy(); };
          dustContainer.addChild(dust);
        }

        // Update enemy visibility
        for (const e of enemySprites) {
          const visible = !defeatedRef.current.has(e.key);
          e.sprite.visible = visible;
          e.shadow.visible = visible;
          // Gentle bob
          if (visible) {
            e.sprite.y += Math.sin(frame * 0.04 + e.sprite.x) * 0.1;
          }
        }

        // Door color tint
        for (const d of doorSprites) {
          d.tint = doorRef.current ? 0x55FF88 : 0xFF8855;
        }

        // Light ray sway
        for (let i = 0; i < lightRays.length; i++) {
          lightRays[i].alpha = 0.03 + Math.sin(frame * 0.01 + i * 2) * 0.02;
        }
      });
    };

    setup();

    return () => {
      destroyed = true;
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, [map]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />
  );
}
