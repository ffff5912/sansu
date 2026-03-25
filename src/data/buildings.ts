import type { BuildingDef } from './types.ts';

export const BUILDINGS: BuildingDef[] = [
  {
    id: 'fountain',
    name: 'いやしの泉',
    emoji: '⛲',
    description: 'HPをまんたんにする',
    cost: 0,
    gridX: 2,
    gridY: 2,
  },
  {
    id: 'shop',
    name: 'ショップ',
    emoji: '🏪',
    description: 'アイテムをかう',
    cost: 0,
    gridX: 0,
    gridY: 1,
  },
  {
    id: 'guild',
    name: 'ぼうけんギルド',
    emoji: '⚔️',
    description: 'ダンジョンへ出発する',
    cost: 0,
    gridX: 4,
    gridY: 1,
  },
  {
    id: 'dojo',
    name: 'たいりょくどうじょう',
    emoji: '🥋',
    description: 'HP上限+20（1回のみ）',
    cost: 120,
    gridX: 0,
    gridY: 3,
  },
  {
    id: 'library',
    name: 'まほうとしょかん',
    emoji: '📚',
    description: 'こうげき力+5（1回のみ）',
    cost: 150,
    gridX: 4,
    gridY: 3,
  },
  {
    id: 'inn',
    name: 'やどや',
    emoji: '🏨',
    description: 'ダンジョン前に自動回復',
    cost: 200,
    gridX: 1,
    gridY: 4,
  },
  {
    id: 'tower',
    name: 'ものみのとう',
    emoji: '🗼',
    description: '村のシンボル！',
    cost: 300,
    gridX: 2,
    gridY: 0,
  },
  {
    id: 'garden',
    name: 'おはなばたけ',
    emoji: '🌻',
    description: '村がにぎやかになる',
    cost: 80,
    gridX: 3,
    gridY: 4,
  },
];

export function getBuilding(id: string): BuildingDef | undefined {
  return BUILDINGS.find(b => b.id === id);
}

/** Buildings that are always available (cost=0) */
export const DEFAULT_BUILDINGS = BUILDINGS.filter(b => b.cost === 0).map(b => b.id);
