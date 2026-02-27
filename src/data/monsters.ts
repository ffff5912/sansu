import type { Monster } from './types.ts';

export const MONSTERS: Monster[] = [
  {
    id: 'slime-kazu',
    name: 'スライムかず',
    emoji: '🟢',
    hp: 30,
    attack: 8,
    exp: 10,
    isBoss: false,
    floorId: 1,
  },
  {
    id: 'bat-suu',
    name: 'コウモリすう',
    emoji: '🦇',
    hp: 35,
    attack: 10,
    exp: 12,
    isBoss: false,
    floorId: 1,
  },
  {
    id: 'ghost-man',
    name: 'ゴーストまん',
    emoji: '👻',
    hp: 40,
    attack: 12,
    exp: 15,
    isBoss: false,
    floorId: 1,
  },
  {
    id: 'dragon-oku',
    name: 'ドラゴン・オク',
    emoji: '🐉',
    hp: 100,
    attack: 18,
    exp: 50,
    isBoss: true,
    floorId: 1,
  },
];

export function getMonster(id: string): Monster | undefined {
  return MONSTERS.find(m => m.id === id);
}

export function getFloorMonsters(floorId: number): Monster[] {
  return MONSTERS.filter(m => m.floorId === floorId);
}
