import type { ItemDef } from './types.ts';

const A = '/assets/tiny-swords';

export const ITEMS: ItemDef[] = [
  {
    id: 'potion',
    name: 'かいふくドリンク',
    emoji: '🧃',
    icon: `${A}/UI Elements/UI Elements/Icons/Icon_04.png`,
    description: 'HPを30かいふくする',
    price: 20,
    effect: 'heal',
    value: 30,
  },
  {
    id: 'hi-potion',
    name: 'スーパードリンク',
    emoji: '🥤',
    icon: `${A}/UI Elements/UI Elements/Icons/Icon_04.png`,
    description: 'HPを80かいふくする',
    price: 50,
    effect: 'heal',
    value: 80,
  },
  {
    id: 'full-potion',
    name: 'まんたんドリンク',
    emoji: '🍹',
    icon: `${A}/UI Elements/UI Elements/Icons/Icon_04.png`,
    description: 'HPをぜんかいふくする',
    price: 100,
    effect: 'heal',
    value: 9999,
  },
  {
    id: 'atk-candy',
    name: 'パワーキャンディ',
    emoji: '🍬',
    icon: `${A}/UI Elements/UI Elements/Icons/Icon_05.png`,
    description: 'こうげき力が3アップ！',
    price: 80,
    effect: 'atkUp',
    value: 3,
  },
  {
    id: 'exp-book',
    name: 'けいけんのほん',
    emoji: '📖',
    icon: `${A}/UI Elements/UI Elements/Icons/Icon_11.png`,
    description: 'けいけんち50もらえる',
    price: 60,
    effect: 'expUp',
    value: 50,
  },
];

export function getItem(id: string): ItemDef | undefined {
  return ITEMS.find(i => i.id === id);
}
