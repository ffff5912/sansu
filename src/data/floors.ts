import type { FloorDef } from './types.ts';

export const FLOORS: FloorDef[] = [
  {
    id: 1,
    name: '大きな数のどうくつ',
    subtitle: '億・兆の世界へ',
    theme: 'cave',
    emoji: '🏔️',
    unlocked: true,
    monsterIds: ['slime-kazu', 'bat-suu', 'ghost-man'],
    bossId: 'dragon-oku',
  },
  {
    id: 2, name: 'わり算のもり', subtitle: '÷の冒険', theme: 'forest', emoji: '🌲',
    unlocked: false, monsterIds: [], bossId: '',
  },
  {
    id: 3, name: '角度のとう', subtitle: '分度器マスター', theme: 'tower', emoji: '🗼',
    unlocked: false, monsterIds: [], bossId: '',
  },
  {
    id: 4, name: '小数のみずうみ', subtitle: '0.1の世界', theme: 'lake', emoji: '🌊',
    unlocked: false, monsterIds: [], bossId: '',
  },
  {
    id: 5, name: 'がい数のさばく', subtitle: '四捨五入の砂嵐', theme: 'desert', emoji: '🏜️',
    unlocked: false, monsterIds: [], bossId: '',
  },
  {
    id: 6, name: '面積のへいげん', subtitle: 'cm²とm²', theme: 'plains', emoji: '🟩',
    unlocked: false, monsterIds: [], bossId: '',
  },
  {
    id: 7, name: '分数のどうくつ', subtitle: '仲間分け', theme: 'cave2', emoji: '🧩',
    unlocked: false, monsterIds: [], bossId: '',
  },
  {
    id: 8, name: 'グラフのまち', subtitle: '折れ線グラフ', theme: 'city', emoji: '📊',
    unlocked: false, monsterIds: [], bossId: '',
  },
  {
    id: 9, name: '図形のしんでん', subtitle: '平行と垂直', theme: 'temple', emoji: '🏛️',
    unlocked: false, monsterIds: [], bossId: '',
  },
  {
    id: 10, name: 'そろばんのやま', subtitle: '暗算チャレンジ', theme: 'mountain', emoji: '🧮',
    unlocked: false, monsterIds: [], bossId: '',
  },
  {
    id: 11, name: '変わり方のラボ', subtitle: '□と○の関係', theme: 'lab', emoji: '🔬',
    unlocked: false, monsterIds: [], bossId: '',
  },
  {
    id: 12, name: '立体のてんくう', subtitle: '直方体と立方体', theme: 'sky', emoji: '☁️',
    unlocked: false, monsterIds: [], bossId: '',
  },
];

export function getFloor(id: number): FloorDef | undefined {
  return FLOORS.find(f => f.id === id);
}
