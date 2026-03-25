import type { ItemDef } from './types.ts';

export const ITEMS: ItemDef[] = [
  {
    id: 'potion',
    name: 'かいふくドリンク',
    emoji: '🧃',
    description: 'HPを30かいふくする',
    price: 20,
    effect: 'heal',
    value: 30,
  },
  {
    id: 'hi-potion',
    name: 'スーパードリンク',
    emoji: '🥤',
    description: 'HPを80かいふくする',
    price: 50,
    effect: 'heal',
    value: 80,
  },
  {
    id: 'full-potion',
    name: 'まんたんドリンク',
    emoji: '🍹',
    description: 'HPをぜんかいふくする',
    price: 100,
    effect: 'heal',
    value: 9999,
  },
  {
    id: 'atk-candy',
    name: 'パワーキャンディ',
    emoji: '🍬',
    description: 'こうげき力が3アップ！',
    price: 80,
    effect: 'atkUp',
    value: 3,
  },
  {
    id: 'exp-book',
    name: 'けいけんのほん',
    emoji: '📖',
    description: 'けいけんち50もらえる',
    price: 60,
    effect: 'expUp',
    value: 50,
  },
];

export function getItem(id: string): ItemDef | undefined {
  return ITEMS.find(i => i.id === id);
}
