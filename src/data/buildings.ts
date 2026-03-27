import type { BuildingDef } from './types.ts';

export const BUILDINGS: BuildingDef[] = [
  // === Center area (always built) ===
  {
    id: 'fountain',
    name: 'いやしの泉',
    emoji: '⛲',
    description: 'HPをまんたんにする',
    cost: 0,
    gridX: 7,
    gridY: 7,
  },
  {
    id: 'shop',
    name: 'ショップ',
    emoji: '🏪',
    description: 'アイテムをかう',
    cost: 0,
    gridX: 5,
    gridY: 5,
  },
  {
    id: 'guild',
    name: 'ぼうけんギルド',
    emoji: '⚔️',
    description: 'ダンジョンへ出発する',
    cost: 0,
    gridX: 9,
    gridY: 5,
  },
  // === Near center (cheap) ===
  {
    id: 'garden',
    name: 'おはなばたけ',
    emoji: '🌻',
    description: '村がにぎやかになる',
    cost: 80,
    gridX: 5,
    gridY: 9,
  },
  {
    id: 'dojo',
    name: 'たいりょくどうじょう',
    emoji: '🥋',
    description: 'HP上限+20（1回のみ）',
    cost: 120,
    gridX: 3,
    gridY: 3,
  },
  // === Mid range ===
  {
    id: 'library',
    name: 'まほうとしょかん',
    emoji: '📚',
    description: 'こうげき力+5（1回のみ）',
    cost: 150,
    gridX: 11,
    gridY: 3,
  },
  {
    id: 'inn',
    name: 'やどや',
    emoji: '🏨',
    description: 'ダンジョン前にバフ選択',
    cost: 200,
    gridX: 9,
    gridY: 9,
  },
  // === Far (expensive, endgame) ===
  {
    id: 'smithy',
    name: 'かじや',
    emoji: '🔨',
    description: 'そざいから そうびを つくる',
    cost: 100,
    gridX: 3,
    gridY: 7,
  },
  {
    id: 'colosseum',
    name: 'コロシアム',
    emoji: '🏟️',
    description: '10もん連続チャレンジ！ランクをめざせ',
    cost: 150,
    gridX: 13,
    gridY: 5,
  },
  {
    id: 'school',
    name: 'れんしゅうじょ',
    emoji: '📝',
    description: 'ダンジョンなしで もんだいを れんしゅう',
    cost: 50,
    gridX: 11,
    gridY: 7,
  },
  {
    id: 'tower',
    name: 'ものみのとう',
    emoji: '🗼',
    description: 'モンスター図鑑がみれる',
    cost: 300,
    gridX: 7,
    gridY: 2,
  },
];

export function getBuilding(id: string): BuildingDef | undefined {
  return BUILDINGS.find(b => b.id === id);
}

/** Buildings that are always available (cost=0) */
export const DEFAULT_BUILDINGS = BUILDINGS.filter(b => b.cost === 0).map(b => b.id);
