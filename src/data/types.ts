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

/* ========== Materials ========== */
export interface MaterialDef {
  id: string;
  name: string;
  icon: string;
  description: string;
}

/** Bag of materials: materialId → count */
export interface MaterialBag {
  [materialId: string]: number;
}

/* ========== Equipment ========== */
export interface EquipmentDef {
  id: string;
  name: string;
  icon: string;
  description: string;
  slot: 'weapon' | 'armor' | 'accessory';
  atkBonus: number;
  defBonus: number;
  expBonus: number;
  recipe: { materialId: string; count: number }[];
  craftGold: number;
}

export interface EquipmentSlots {
  weapon: string | null;
  armor: string | null;
  accessory: string | null;
}

/* ========== Building Save ========== */
export interface BuildingSave {
  id: string;
  level: number;
}

/* ========== Dungeon Buff ========== */
export type DungeonBuff = 'none' | 'hp' | 'atk' | 'timer';

/* ========== Villager ========== */
export interface VillagerDef {
  id: string;
  name: string;
  sprite: string;
  dialogue: string[];
  unlockCondition: { type: 'villageLv' | 'floor'; value: number };
}

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
  materials: MaterialBag;
  craftedEquipment: string[];
  equipment: EquipmentSlots;
  defeatedBossIds: string[];
  colosseumHighScore: number;
  colosseumBestRank: ColosseumRank;
  timestamp: number;
}

/* ========== Game State (top level) ========== */
export type GameScene = 'title' | 'base' | 'worldmap' | 'dungeon' | 'result' | 'practice' | 'colosseum';

/* ========== Colosseum ========== */
export type ColosseumRank = 'none' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface ColosseumResult {
  score: number;
  combo: number;
  maxCombo: number;
  correct: number;
  total: number;
  rank: ColosseumRank;
}

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
  materials: MaterialBag;
  craftedEquipment: string[];
  equipment: EquipmentSlots;
  defeatedBossIds: string[];
  colosseumHighScore: number;
  colosseumBestRank: ColosseumRank;
  dungeonBuff: DungeonBuff;
}
