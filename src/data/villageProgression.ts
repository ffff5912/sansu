import type { VillagerDef, BuildingSave } from './types.ts';

const A = '/assets/tiny-swords/Units';

/* ====== Village Level ====== */
export interface VillageLevelInfo {
  level: number;
  name: string;
  groundType: 'dirt' | 'grass' | 'stone' | 'flower';
  hasWalls: boolean;
  hasCastle: boolean;
}

/** Calculate village level from buildings + their levels */
export function calcVillageLevel(buildings: string[], buildingLevels: BuildingSave[]): number {
  let points = 0;
  points += buildings.length * 2;
  for (const bl of buildingLevels) {
    points += (bl.level - 1) * 1;
  }
  if (points <= 5) return 1;
  if (points <= 10) return 2;
  if (points <= 15) return 3;
  if (points <= 20) return 4;
  return 5;
}

export function getVillageLevelInfo(level: number): VillageLevelInfo {
  switch (level) {
    case 1: return { level: 1, name: 'ちいさな むら', groundType: 'dirt', hasWalls: false, hasCastle: false };
    case 2: return { level: 2, name: 'みどりの むら', groundType: 'grass', hasWalls: false, hasCastle: false };
    case 3: return { level: 3, name: 'にぎやかな まち', groundType: 'stone', hasWalls: true, hasCastle: false };
    case 4: return { level: 4, name: 'はなの みやこ', groundType: 'flower', hasWalls: true, hasCastle: false };
    default: return { level: 5, name: 'さんすう王国', groundType: 'flower', hasWalls: true, hasCastle: true };
  }
}

/* ====== Villagers ====== */
export const VILLAGERS: VillagerDef[] = [
  // Unlock by village level
  {
    id: 'elder', name: 'そんちょう',
    sprite: `${A}/Blue Units/Monk/Idle.png`,
    dialogue: ['ようこそ さんすうの村へ！', 'たくさん もんだいを といて つよくなろう！', 'この村は みんなの ちからで おおきくなるんだ'],
    unlockCondition: { type: 'villageLv', value: 1 },
  },
  {
    id: 'merchant', name: 'しょうにん マルコ',
    sprite: `${A}/Yellow Units/Pawn/Pawn_Idle Gold.png`,
    dialogue: ['いい しなものが あるよ！', 'ゴールドを あつめて かいものしよう！', 'きょうは とくべつに やすくしておくよ'],
    unlockCondition: { type: 'villageLv', value: 1 },
  },
  {
    id: 'baker', name: 'パンやの タロウ',
    sprite: `${A}/Yellow Units/Pawn/Pawn_Idle Meat.png`,
    dialogue: ['できたての パンだよ！', 'けいさんが とくいな こは だいすき！', 'まいにち れんしゅう するのが だいじだよ'],
    unlockCondition: { type: 'villageLv', value: 2 },
  },
  {
    id: 'carpenter', name: 'だいくの ケンタ',
    sprite: `${A}/Yellow Units/Pawn/Pawn_Idle Hammer.png`,
    dialogue: ['いい たてものを つくるぞ！', 'もくざいが たくさん いるんだ', 'つぎは なにを たてようか？'],
    unlockCondition: { type: 'villageLv', value: 2 },
  },
  {
    id: 'scholar', name: 'はかせ ミナ',
    sprite: `${A}/Purple Units/Monk/Idle.png`,
    dialogue: ['ちしきは ちからなり！', 'もんだいを よく よんで かんがえよう', 'まちがえても だいじょうぶ。つぎ がんばろう！'],
    unlockCondition: { type: 'villageLv', value: 3 },
  },
  {
    id: 'knight', name: 'きし アーサー',
    sprite: `${A}/Blue Units/Warrior/Warrior_Idle.png`,
    dialogue: ['この村は おれが まもる！', 'つよい モンスターに まけるな！', 'そうびを しっかり ととのえよう'],
    unlockCondition: { type: 'villageLv', value: 3 },
  },
  {
    id: 'miner', name: 'こうふ ゴンタ',
    sprite: `${A}/Yellow Units/Pawn/Pawn_Idle Pickaxe.png`,
    dialogue: ['きょうも いい おれが ほれたぞ！', 'ダンジョンの おくに レアな そざいが あるらしい', 'てっこうせきは つよい ぶきの もとだ'],
    unlockCondition: { type: 'villageLv', value: 4 },
  },
  {
    id: 'princess', name: 'おうじょ リリア',
    sprite: `${A}/Blue Units/Archer/Archer_Idle.png`,
    dialogue: ['みんな がんばってるわね！', 'この村が だいすき！', 'さんすう王国を いっしょに つくりましょう'],
    unlockCondition: { type: 'villageLv', value: 5 },
  },
  // Unlock by clearing floors
  {
    id: 'traveler1', name: 'たびびと リク',
    sprite: `${A}/Red Units/Pawn/Pawn_Idle.png`,
    dialogue: ['とおい くにから きたよ', 'この村は いい ところだね', 'もっと たくさんの ひとが くるといいな'],
    unlockCondition: { type: 'floor', value: 2 },
  },
  {
    id: 'traveler2', name: 'たびびと ソラ',
    sprite: `${A}/Purple Units/Pawn/Pawn_Idle.png`,
    dialogue: ['すごい ダンジョンが あるんだって？', 'ぼうけんしゃ って かっこいいなぁ', 'いつか ぼくも ぼうけん したい！'],
    unlockCondition: { type: 'floor', value: 4 },
  },
  {
    id: 'witch', name: 'まじょ カリン',
    sprite: `${A}/Purple Units/Archer/Archer_Idle.png`,
    dialogue: ['フフフ…いい まほうの いしが あるわね', 'けいさんと まほうは にている のよ', 'ただしい こたえは ちからに なる'],
    unlockCondition: { type: 'floor', value: 6 },
  },
  {
    id: 'hero', name: 'ゆうしゃ レオ',
    sprite: `${A}/Red Units/Warrior/Warrior_Idle.png`,
    dialogue: ['おまえも つよくなったな！', 'さいごの ダンジョンが まっている', 'いっしょに さんすう王国を まもろう！'],
    unlockCondition: { type: 'floor', value: 10 },
  },
];

/** Get unlocked villagers based on village level and cleared floors */
export function getUnlockedVillagers(villageLv: number, clearedFloors: number[]): VillagerDef[] {
  return VILLAGERS.filter(v => {
    if (v.unlockCondition.type === 'villageLv') return villageLv >= v.unlockCondition.value;
    if (v.unlockCondition.type === 'floor') return clearedFloors.length >= v.unlockCondition.value;
    return false;
  });
}

/* ====== Boss Monuments ====== */
export interface MonumentDef {
  bossId: string;
  name: string;
  emoji: string;
}

export const MONUMENTS: MonumentDef[] = [
  { bossId: 'dragon-oku', name: 'ドラゴンの像', emoji: '🐉' },
  { bossId: 'treant-warizan', name: 'トレントの像', emoji: '🌳' },
  { bossId: 'sphinx-bundo', name: 'スフィンクスの像', emoji: '🦁' },
  { bossId: 'kraken-shousuu', name: 'クラーケンの像', emoji: '🐙' },
  { bossId: 'djinn-gaisuu', name: 'ジンの像', emoji: '🧞' },
  { bossId: 'giant-menseki', name: 'ジャイアントの像', emoji: '🐘' },
  { bossId: 'minotaur-bunsuu', name: 'ミノタウロスの像', emoji: '🐮' },
  { bossId: 'phoenix-graph', name: 'フェニックスの像', emoji: '🦚' },
  { bossId: 'cerberus-zukei', name: 'ケルベロスの像', emoji: '🦊' },
  { bossId: 'titan-soroban', name: 'タイタンの像', emoji: '🦍' },
  { bossId: 'mecha-kawarikata', name: 'メカの像', emoji: '🤖' },
  { bossId: 'bahamut-rittai', name: 'バハムートの像', emoji: '🐲' },
  // Grade 1 bosses
  { bossId: 'fukurou-kazu', name: 'フクロウの像', emoji: '🦉' },
  { bossId: 'kuma-tashizan', name: 'クマの像', emoji: '🧸' },
  { bossId: 'wani-hikizan', name: 'ワニの像', emoji: '🐊' },
  { bossId: 'oni-kuriagari', name: 'オニの像', emoji: '👹' },
  { bossId: 'tengu-kurisagari', name: 'テングの像', emoji: '👺' },
  { bossId: 'maou-tokei', name: 'まおうの像', emoji: '🕰️' },
];

export function getUnlockedMonuments(defeatedBossIds: string[]): MonumentDef[] {
  return MONUMENTS.filter(m => defeatedBossIds.includes(m.bossId));
}
