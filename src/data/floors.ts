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
    unlocked: false, monsterIds: ['wolf-wari', 'boar-amari', 'bear-shou'], bossId: 'treant-warizan',
  },
  {
    id: 3, name: '角度のとう', subtitle: '分度器マスター', theme: 'tower', emoji: '🗼',
    unlocked: false, monsterIds: ['hawk-kaku', 'gargoyle-do', 'golem-choku'], bossId: 'sphinx-bundo',
  },
  {
    id: 4, name: '小数のみずうみ', subtitle: '0.1の世界', theme: 'lake', emoji: '🌊',
    unlocked: false, monsterIds: ['fish-shousuu', 'frog-ten', 'turtle-rei'], bossId: 'kraken-shousuu',
  },
  {
    id: 5, name: 'がい数のさばく', subtitle: '四捨五入の砂嵐', theme: 'desert', emoji: '🏜️',
    unlocked: false, monsterIds: ['scorpion-gai', 'snake-shisha', 'cactus-mitsumori'], bossId: 'djinn-gaisuu',
  },
  {
    id: 6, name: '面積のへいげん', subtitle: 'cm²とm²', theme: 'plains', emoji: '🟩',
    unlocked: false, monsterIds: ['rabbit-menseki', 'sheep-heihou', 'horse-tate'], bossId: 'giant-menseki',
  },
  {
    id: 7, name: '分数のどうくつ', subtitle: '仲間分け', theme: 'cave2', emoji: '🧩',
    unlocked: false, monsterIds: ['rat-bunbo', 'spider-bunshi', 'mole-tsuubun'], bossId: 'minotaur-bunsuu',
  },
  {
    id: 8, name: 'グラフのまち', subtitle: '折れ線グラフ', theme: 'city', emoji: '📊',
    unlocked: false, monsterIds: ['pigeon-graph', 'cat-oresen', 'dog-hyou'], bossId: 'phoenix-graph',
  },
  {
    id: 9, name: '図形のしんでん', subtitle: '平行と垂直', theme: 'temple', emoji: '🏛️',
    unlocked: false, monsterIds: ['lizard-heikou', 'crab-suichoku', 'beetle-taikaku'], bossId: 'cerberus-zukei',
  },
  {
    id: 10, name: 'そろばんのやま', subtitle: '暗算チャレンジ', theme: 'mountain', emoji: '🧮',
    unlocked: false, monsterIds: ['monkey-anzan', 'eagle-kufuu', 'yeti-keisan'], bossId: 'titan-soroban',
  },
  {
    id: 11, name: '変わり方のラボ', subtitle: '□と○の関係', theme: 'lab', emoji: '🔬',
    unlocked: false, monsterIds: ['robot-shikaku', 'alien-maru', 'ufo-kankei'], bossId: 'mecha-kawarikata',
  },
  {
    id: 12, name: '立体のてんくう', subtitle: '直方体と立方体', theme: 'sky', emoji: '☁️',
    unlocked: false, monsterIds: ['cloud-men', 'star-chouten', 'comet-hen'], bossId: 'bahamut-rittai',
  },
];

export function getFloor(id: number): FloorDef | undefined {
  return FLOORS.find(f => f.id === id);
}
