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
}

/* ========== Grade ========== */
export type Grade = 1 | 4;

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

/* ========== Save Data ========== */
export interface SaveData {
  version: number;
  grade: Grade;
  player: PlayerState;
  clearedFloors: number[];
  currentFloor: number | null;
  inventory: Inventory;
  timestamp: number;
}

/* ========== Game State (top level) ========== */
export type GameScene = 'title' | 'base' | 'worldmap' | 'dungeon' | 'result';

export interface GameState {
  scene: GameScene;
  grade: Grade;
  player: PlayerState;
  clearedFloors: number[];
  currentFloor: number | null;
  resultType: 'clear' | 'gameover' | null;
  inventory: Inventory;
}
