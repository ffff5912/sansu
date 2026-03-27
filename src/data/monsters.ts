import type { Monster } from './types.ts';

export const MONSTERS: Monster[] = [
  // === Floor 1: 大きな数のどうくつ ===
  { id: 'slime-kazu', name: 'スライムかず', emoji: '🐸', hp: 30, attack: 8, exp: 10, isBoss: false, floorId: 1 },
  { id: 'bat-suu', name: 'コウモリすう', emoji: '🦋', hp: 35, attack: 10, exp: 12, isBoss: false, floorId: 1 },
  { id: 'ghost-man', name: 'おばけまん', emoji: '🐻', hp: 40, attack: 12, exp: 15, isBoss: false, floorId: 1 },
  { id: 'dragon-oku', name: 'ドラゴン・オク', emoji: '🦖', hp: 100, attack: 18, exp: 50, isBoss: true, floorId: 1 },

  // === Floor 2: わり算のもり ===
  { id: 'wolf-wari', name: 'オオカミわり', emoji: '🐶', hp: 35, attack: 10, exp: 12, isBoss: false, floorId: 2 },
  { id: 'boar-amari', name: 'イノシシあまり', emoji: '🐷', hp: 40, attack: 12, exp: 14, isBoss: false, floorId: 2 },
  { id: 'bear-shou', name: 'クマしょう', emoji: '🧸', hp: 45, attack: 14, exp: 16, isBoss: false, floorId: 2 },
  { id: 'treant-warizan', name: 'トレント÷', emoji: '🌴', hp: 120, attack: 20, exp: 55, isBoss: true, floorId: 2 },

  // === Floor 3: 角度のとう ===
  { id: 'hawk-kaku', name: 'タカかくど', emoji: '🦜', hp: 40, attack: 12, exp: 14, isBoss: false, floorId: 3 },
  { id: 'gargoyle-do', name: 'ガーゴイルど', emoji: '🐢', hp: 45, attack: 14, exp: 16, isBoss: false, floorId: 3 },
  { id: 'golem-choku', name: 'ゴーレムちょっかく', emoji: '🤖', hp: 50, attack: 16, exp: 18, isBoss: false, floorId: 3 },
  { id: 'sphinx-bundo', name: 'スフィンクス分度器', emoji: '🦁', hp: 140, attack: 22, exp: 60, isBoss: true, floorId: 3 },

  // === Floor 4: 小数のみずうみ ===
  { id: 'fish-shousuu', name: 'さかなしょうすう', emoji: '🐠', hp: 42, attack: 13, exp: 15, isBoss: false, floorId: 4 },
  { id: 'frog-ten', name: 'カエルてん', emoji: '🐸', hp: 48, attack: 15, exp: 17, isBoss: false, floorId: 4 },
  { id: 'turtle-rei', name: 'カメれいてん', emoji: '🐢', hp: 52, attack: 16, exp: 19, isBoss: false, floorId: 4 },
  { id: 'kraken-shousuu', name: 'クラーケン0.1', emoji: '🐙', hp: 150, attack: 24, exp: 65, isBoss: true, floorId: 4 },

  // === Floor 5: がい数のさばく ===
  { id: 'scorpion-gai', name: 'サソリがいすう', emoji: '🦀', hp: 48, attack: 14, exp: 17, isBoss: false, floorId: 5 },
  { id: 'snake-shisha', name: 'ヘビ四捨五入', emoji: '🐍', hp: 52, attack: 16, exp: 19, isBoss: false, floorId: 5 },
  { id: 'cactus-mitsumori', name: 'サボテンみつもり', emoji: '🌵', hp: 55, attack: 17, exp: 20, isBoss: false, floorId: 5 },
  { id: 'djinn-gaisuu', name: 'ジン・ガイスウ', emoji: '🧞', hp: 160, attack: 26, exp: 70, isBoss: true, floorId: 5 },

  // === Floor 6: 面積のへいげん ===
  { id: 'rabbit-menseki', name: 'ウサギめんせき', emoji: '🐰', hp: 50, attack: 15, exp: 18, isBoss: false, floorId: 6 },
  { id: 'sheep-heihou', name: 'ヒツジへいほう', emoji: '🐑', hp: 55, attack: 17, exp: 20, isBoss: false, floorId: 6 },
  { id: 'horse-tate', name: 'ウマたてよこ', emoji: '🦄', hp: 58, attack: 18, exp: 22, isBoss: false, floorId: 6 },
  { id: 'giant-menseki', name: 'ジャイアントm²', emoji: '🐘', hp: 170, attack: 28, exp: 75, isBoss: true, floorId: 6 },

  // === Floor 7: 分数のどうくつ ===
  { id: 'rat-bunbo', name: 'ネズミぶんぼ', emoji: '🐭', hp: 52, attack: 16, exp: 19, isBoss: false, floorId: 7 },
  { id: 'spider-bunshi', name: 'クモぶんし', emoji: '🕷️', hp: 58, attack: 18, exp: 21, isBoss: false, floorId: 7 },
  { id: 'mole-tsuubun', name: 'モグラつうぶん', emoji: '🦔', hp: 62, attack: 19, exp: 23, isBoss: false, floorId: 7 },
  { id: 'minotaur-bunsuu', name: 'ミノタウロス分数', emoji: '🐮', hp: 180, attack: 30, exp: 80, isBoss: true, floorId: 7 },

  // === Floor 8: グラフのまち ===
  { id: 'pigeon-graph', name: 'ハトグラフ', emoji: '🐦', hp: 55, attack: 17, exp: 20, isBoss: false, floorId: 8 },
  { id: 'cat-oresen', name: 'ネコおれせん', emoji: '🐱', hp: 60, attack: 19, exp: 22, isBoss: false, floorId: 8 },
  { id: 'dog-hyou', name: 'イヌひょう', emoji: '🐶', hp: 65, attack: 20, exp: 24, isBoss: false, floorId: 8 },
  { id: 'phoenix-graph', name: 'フェニックスグラフ', emoji: '🦚', hp: 190, attack: 32, exp: 85, isBoss: true, floorId: 8 },

  // === Floor 9: 図形のしんでん ===
  { id: 'lizard-heikou', name: 'トカゲへいこう', emoji: '🦎', hp: 58, attack: 18, exp: 22, isBoss: false, floorId: 9 },
  { id: 'crab-suichoku', name: 'カニすいちょく', emoji: '🦞', hp: 62, attack: 20, exp: 24, isBoss: false, floorId: 9 },
  { id: 'beetle-taikaku', name: 'カブトたいかくせん', emoji: '🐞', hp: 68, attack: 21, exp: 26, isBoss: false, floorId: 9 },
  { id: 'cerberus-zukei', name: 'ケルベロス図形', emoji: '🦊', hp: 200, attack: 34, exp: 90, isBoss: true, floorId: 9 },

  // === Floor 10: そろばんのやま ===
  { id: 'monkey-anzan', name: 'サルあんざん', emoji: '🐒', hp: 60, attack: 19, exp: 23, isBoss: false, floorId: 10 },
  { id: 'eagle-kufuu', name: 'ワシくふう', emoji: '🦅', hp: 65, attack: 21, exp: 25, isBoss: false, floorId: 10 },
  { id: 'yeti-keisan', name: 'イエティけいさん', emoji: '🐧', hp: 70, attack: 22, exp: 27, isBoss: false, floorId: 10 },
  { id: 'titan-soroban', name: 'タイタンそろばん', emoji: '🦍', hp: 210, attack: 36, exp: 95, isBoss: true, floorId: 10 },

  // === Floor 11: 変わり方のラボ ===
  { id: 'robot-shikaku', name: 'ロボット□', emoji: '🤖', hp: 65, attack: 20, exp: 25, isBoss: false, floorId: 11 },
  { id: 'alien-maru', name: 'エイリアン○', emoji: '👽', hp: 70, attack: 22, exp: 27, isBoss: false, floorId: 11 },
  { id: 'ufo-kankei', name: 'UFOかんけい', emoji: '🛸', hp: 75, attack: 23, exp: 29, isBoss: false, floorId: 11 },
  { id: 'mecha-kawarikata', name: 'メカ変わり方', emoji: '🤖', hp: 220, attack: 38, exp: 100, isBoss: true, floorId: 11 },

  // === Floor 12: 立体のてんくう ===
  { id: 'cloud-men', name: 'クラウドめん', emoji: '☁️', hp: 70, attack: 22, exp: 27, isBoss: false, floorId: 12 },
  { id: 'star-chouten', name: 'スターちょうてん', emoji: '🌟', hp: 75, attack: 24, exp: 29, isBoss: false, floorId: 12 },
  { id: 'comet-hen', name: 'すいせいへん', emoji: '☄️', hp: 80, attack: 25, exp: 31, isBoss: false, floorId: 12 },
  { id: 'bahamut-rittai', name: 'バハムート立体', emoji: '🐲', hp: 250, attack: 40, exp: 120, isBoss: true, floorId: 12 },

  // === Floor 101: かずのもり (小1) ===
  { id: 'kinoko-kazu', name: 'キノコかず', emoji: '🍄', hp: 20, attack: 4, exp: 8, isBoss: false, floorId: 101 },
  { id: 'hana-kazu', name: 'おはなかず', emoji: '🌸', hp: 22, attack: 5, exp: 9, isBoss: false, floorId: 101 },
  { id: 'mushi-kazu', name: 'むしかず', emoji: '🐛', hp: 25, attack: 5, exp: 10, isBoss: false, floorId: 101 },
  { id: 'fukurou-kazu', name: 'フクロウかず', emoji: '🦉', hp: 60, attack: 10, exp: 30, isBoss: true, floorId: 101 },

  // === Floor 102: たしざんのはら (小1) ===
  { id: 'usagi-tasu', name: 'うさぎたす', emoji: '🐰', hp: 22, attack: 5, exp: 9, isBoss: false, floorId: 102 },
  { id: 'kaeru-tasu', name: 'かえるたす', emoji: '🐸', hp: 25, attack: 6, exp: 10, isBoss: false, floorId: 102 },
  { id: 'risu-tasu', name: 'りすたす', emoji: '🐿️', hp: 28, attack: 6, exp: 11, isBoss: false, floorId: 102 },
  { id: 'kuma-tashizan', name: 'くまたしざん', emoji: '🧸', hp: 70, attack: 12, exp: 35, isBoss: true, floorId: 102 },

  // === Floor 103: ひきざんのかわ (小1) ===
  { id: 'sakana-hiku', name: 'さかなひく', emoji: '🐟', hp: 25, attack: 6, exp: 10, isBoss: false, floorId: 103 },
  { id: 'kani-hiku', name: 'かにひく', emoji: '🦀', hp: 28, attack: 7, exp: 11, isBoss: false, floorId: 103 },
  { id: 'kame-hiku', name: 'かめひく', emoji: '🐢', hp: 30, attack: 7, exp: 12, isBoss: false, floorId: 103 },
  { id: 'wani-hikizan', name: 'わにひきざん', emoji: '🐊', hp: 80, attack: 13, exp: 38, isBoss: true, floorId: 103 },

  // === Floor 104: くりあがりのおか (小1) ===
  { id: 'tanuki-kuri', name: 'たぬきくり', emoji: '🦝', hp: 28, attack: 7, exp: 11, isBoss: false, floorId: 104 },
  { id: 'kitsune-kuri', name: 'きつねくり', emoji: '🦊', hp: 30, attack: 8, exp: 12, isBoss: false, floorId: 104 },
  { id: 'inoshishi-kuri', name: 'いのししくり', emoji: '🐷', hp: 33, attack: 8, exp: 13, isBoss: false, floorId: 104 },
  { id: 'oni-kuriagari', name: 'おにくりあがり', emoji: '👹', hp: 90, attack: 14, exp: 42, isBoss: true, floorId: 104 },

  // === Floor 105: くりさがりのたに (小1) ===
  { id: 'karasu-sage', name: 'からすさげ', emoji: '🐦‍⬛', hp: 30, attack: 8, exp: 12, isBoss: false, floorId: 105 },
  { id: 'hebi-sage', name: 'へびさげ', emoji: '🐍', hp: 33, attack: 9, exp: 13, isBoss: false, floorId: 105 },
  { id: 'mogura-sage', name: 'もぐらさげ', emoji: '🐹', hp: 35, attack: 9, exp: 14, isBoss: false, floorId: 105 },
  { id: 'tengu-kurisagari', name: 'てんぐくりさがり', emoji: '👺', hp: 100, attack: 15, exp: 45, isBoss: true, floorId: 105 },

  // === Floor 106: とけいのしろ (小1) ===
  { id: 'hoshi-tokei', name: 'ほしとけい', emoji: '🌟', hp: 33, attack: 9, exp: 13, isBoss: false, floorId: 106 },
  { id: 'kumo-tokei', name: 'くもとけい', emoji: '☁️', hp: 35, attack: 10, exp: 14, isBoss: false, floorId: 106 },
  { id: 'niji-tokei', name: 'にじとけい', emoji: '🌈', hp: 38, attack: 10, exp: 15, isBoss: false, floorId: 106 },
  { id: 'maou-tokei', name: 'まおうとけい', emoji: '🕰️', hp: 110, attack: 16, exp: 50, isBoss: true, floorId: 106 },

  // === Floor 107: たしざんのやま (小1) ===
  { id: 'yama-tasu1', name: 'いわたす', emoji: '🪨', hp: 35, attack: 9, exp: 13, isBoss: false, floorId: 107 },
  { id: 'yama-tasu2', name: 'やまねこたす', emoji: '🐱', hp: 38, attack: 10, exp: 14, isBoss: false, floorId: 107 },
  { id: 'yama-tasu3', name: 'くもたす', emoji: '🕸️', hp: 40, attack: 11, exp: 15, isBoss: false, floorId: 107 },
  { id: 'yama-boss-tasu', name: 'やまおうたす', emoji: '🏔️', hp: 120, attack: 17, exp: 55, isBoss: true, floorId: 107 },

  // === Floor 108: ひきざんのそら (小1) ===
  { id: 'sora-hiku1', name: 'とりひく', emoji: '🐤', hp: 38, attack: 10, exp: 14, isBoss: false, floorId: 108 },
  { id: 'sora-hiku2', name: 'かぜひく', emoji: '🌬️', hp: 40, attack: 11, exp: 15, isBoss: false, floorId: 108 },
  { id: 'sora-hiku3', name: 'にじひく', emoji: '🌈', hp: 42, attack: 12, exp: 16, isBoss: false, floorId: 108 },
  { id: 'sora-boss-hiku', name: 'そらおうひく', emoji: '☁️', hp: 130, attack: 18, exp: 58, isBoss: true, floorId: 108 },

  // === Floor 109: しきづくりのまち (小1) ===
  { id: 'shiki-pawn1', name: 'しきスライム', emoji: '🟢', hp: 40, attack: 11, exp: 15, isBoss: false, floorId: 109 },
  { id: 'shiki-pawn2', name: 'しきゴースト', emoji: '👻', hp: 42, attack: 12, exp: 16, isBoss: false, floorId: 109 },
  { id: 'shiki-pawn3', name: 'しきロボ', emoji: '🤖', hp: 45, attack: 13, exp: 17, isBoss: false, floorId: 109 },
  { id: 'shiki-boss', name: 'しきまおう', emoji: '📝', hp: 140, attack: 19, exp: 60, isBoss: true, floorId: 109 },

  // === Floor 13: 筆算のくふう (小4) ===
  { id: 'calc-pawn1', name: 'ひっさんスライム', emoji: '🧮', hp: 75, attack: 23, exp: 28, isBoss: false, floorId: 13 },
  { id: 'calc-pawn2', name: 'ひっさんゴブリン', emoji: '👺', hp: 80, attack: 24, exp: 30, isBoss: false, floorId: 13 },
  { id: 'calc-pawn3', name: 'ひっさんウルフ', emoji: '🐺', hp: 85, attack: 25, exp: 32, isBoss: false, floorId: 13 },
  { id: 'calc-boss', name: 'ひっさんドラゴン', emoji: '🐉', hp: 230, attack: 37, exp: 100, isBoss: true, floorId: 13 },

  // === Floor 14: かけ算のしろ (小4) ===
  { id: 'mult-pawn1', name: 'かけざんスケルトン', emoji: '💀', hp: 80, attack: 24, exp: 30, isBoss: false, floorId: 14 },
  { id: 'mult-pawn2', name: 'かけざんゴーレム', emoji: '🗿', hp: 85, attack: 25, exp: 32, isBoss: false, floorId: 14 },
  { id: 'mult-pawn3', name: 'かけざんデーモン', emoji: '😈', hp: 90, attack: 26, exp: 34, isBoss: false, floorId: 14 },
  { id: 'mult-boss', name: 'かけざんキング', emoji: '👑', hp: 260, attack: 40, exp: 110, isBoss: true, floorId: 14 },

  // === Floor 15: 小数の計算 (小4) ===
  { id: 'dec-pawn1', name: 'しょうすうエルフ', emoji: '🧝', hp: 85, attack: 25, exp: 32, isBoss: false, floorId: 15 },
  { id: 'dec-pawn2', name: 'しょうすうニンフ', emoji: '🧚', hp: 88, attack: 26, exp: 34, isBoss: false, floorId: 15 },
  { id: 'dec-pawn3', name: 'しょうすうフェアリー', emoji: '✨', hp: 92, attack: 27, exp: 36, isBoss: false, floorId: 15 },
  { id: 'dec-boss', name: 'しょうすうまおう', emoji: '🔮', hp: 280, attack: 42, exp: 120, isBoss: true, floorId: 15 },
];

export function getMonster(id: string): Monster | undefined {
  return MONSTERS.find(m => m.id === id);
}

export function getFloorMonsters(floorId: number): Monster[] {
  return MONSTERS.filter(m => m.floorId === floorId);
}
