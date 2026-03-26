/* ========== Tile Map ========== */
export type TileChar = '#' | '.' | 'S' | 'D' | 'E' | 'B' | 'C';

export interface TileMap {
  width: number;
  height: number;
  tiles: TileChar[][];
}

export interface Position {
  x: number;
  y: number;
}

/* ========== Direction ========== */
export type Direction = 'up' | 'down' | 'left' | 'right';

/* ========== Monster ========== */
export type Difficulty = 'easy' | 'normal' | 'hard';

export interface Monster {
  id: string;
  name: string;
  emoji: string;
  /** Sprite sheet path for battle display */
  sprite?: string;
  /** Number of animation frames in sprite sheet */
  spriteFrames?: number;
  hp: number;
  attack: number;
  exp: number;
  isBoss: boolean;
  floorId: number;
}

/* ========== Question ========== */
export interface Question {
  id: string;
  floorId: number;
  difficulty: Difficulty;
  text: string;
  choices: [string, string, string, string];
  answerIndex: number;
  /** Optional clock display for time questions (hour, minute) */
  clockTime?: { hour: number; minute: number };
}

/* ========== Building ========== */
export interface BuildingDef {
  id: string;
  name: string;
  emoji: string;
  description: string;
  cost: number;
  /** Position in village grid (0-based, 0,0 = top-left) */
  gridX: number;
  gridY: number;
}

/* ========== Grade ========== */
export type Grade = 1 | 4;

/* ========== Game Difficulty ========== */
export type GameDifficulty = 'normal' | 'hard';

/* ========== Floor ========== */
export interface FloorDef {
  id: number;
  grade: Grade;
  name: string;
  subtitle: string;
  theme: string;
  emoji: string;
  unlocked: boolean;
  monsterIds: string[];
  bossId: string;
}

/* ========== Player ========== */
export interface PlayerState {
  level: number;
  maxHp: number;
  hp: number;
  attack: number;
  exp: number;
  expToNext: number;
  gold: number;
}

/* ========== Item ========== */
export interface ItemDef {
  id: string;
  name: string;
  emoji: string;
  icon?: string;
  description: string;
  price: number;
  effect: 'heal' | 'atkUp' | 'expUp';
  value: number;
}

export interface Inventory {
  [itemId: string]: number;
}

/* ========== Battle ========== */
export type BattlePhase =
  | 'intro'
  | 'question'
  | 'result'
  | 'victory'
  | 'defeat';

export interface BattleState {
  phase: BattlePhase;
  monster: Monster;
  monsterHp: number;
  currentQuestion: Question | null;
  answerTime: number;
  lastDamage: number;
  lastMonsterDamage: number;
  questionsAnswered: number;
  correctCount: number;
}

/* ========== Dungeon ========== */
export type DungeonPhase = 'explore' | 'battle' | 'clear' | 'gameover';

export interface DungeonState {
  floorId: number;
  playerPos: Position;
  phase: DungeonPhase;
  defeatedEnemies: Set<string>;
  doorOpen: boolean;
  chestsOpened: Set<string>;
}

/* ========== Building Save ========== */
export interface BuildingSave {
  id: string;
  level: number;
}

/* ========== Dungeon Buff ========== */
export type DungeonBuff = 'none' | 'hp' | 'atk' | 'timer';

/* ========== Save Data ========== */
export interface SaveData {
  version: number;
  grade: Grade;
  player: PlayerState;
  clearedFloors: number[];
  currentFloor: number | null;
  inventory: Inventory;
  buildings: string[];
  buildingLevels: BuildingSave[];
  defeatedMonsterIds: string[];
  timestamp: number;
}

/* ========== Game State (top level) ========== */
export type GameScene = 'title' | 'base' | 'worldmap' | 'dungeon' | 'result';

export interface GameState {
  scene: GameScene;
  grade: Grade;
  gameDifficulty: GameDifficulty;
  player: PlayerState;
  clearedFloors: number[];
  currentFloor: number | null;
  resultType: 'clear' | 'gameover' | null;
  inventory: Inventory;
  buildings: string[];
  buildingLevels: BuildingSave[];
  defeatedMonsterIds: string[];
  dungeonBuff: DungeonBuff;
}
