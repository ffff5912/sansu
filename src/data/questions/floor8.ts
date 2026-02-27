import type { Question } from '../types.ts';

// Floor 8: グラフのまち (Graphs - Line graphs)
export const floor8Questions: Question[] = [
  // === easy (5問) ===
  {
    id: 'f8-e1', floorId: 8, difficulty: 'easy',
    text: '折れ線グラフで変化が大きいのはどんなとき？',
    choices: ['線のかたむきが急なとき', '線が水平なとき', '点が多いとき', '線が短いとき'],
    answerIndex: 0,
  },
  {
    id: 'f8-e2', floorId: 8, difficulty: 'easy',
    text: '折れ線グラフのよこ軸は何を表す？',
    choices: ['時間や月日', '数量', '温度', '回数'],
    answerIndex: 0,
  },
  {
    id: 'f8-e3', floorId: 8, difficulty: 'easy',
    text: '気温の変化を見るのにいいグラフは？',
    choices: ['折れ線グラフ', '棒グラフ', '円グラフ', '帯グラフ'],
    answerIndex: 0,
  },
  {
    id: 'f8-e4', floorId: 8, difficulty: 'easy',
    text: '棒グラフは何をくらべるのに向いている？',
    choices: ['数量の大小', '変化のようす', '割合', '順番'],
    answerIndex: 0,
  },
  {
    id: 'f8-e5', floorId: 8, difficulty: 'easy',
    text: '表の数をまちがえなく読むコツは？',
    choices: ['たて・よこを指でたどる', '暗算する', '目を閉じる', '早く読む'],
    answerIndex: 0,
  },

  // === normal (5問) ===
  {
    id: 'f8-n1', floorId: 8, difficulty: 'normal',
    text: '月曜15度、火曜18度。何度上がった？',
    choices: ['3度', '33度', '18度', '15度'],
    answerIndex: 0,
  },
  {
    id: 'f8-n2', floorId: 8, difficulty: 'normal',
    text: '折れ線グラフで線が水平なところは？',
    choices: ['変化なし', '減っている', '増えている', '最大値'],
    answerIndex: 0,
  },
  {
    id: 'f8-n3', floorId: 8, difficulty: 'normal',
    text: '4月10度、5月15度、6月22度。5月から6月の上がり方は？',
    choices: ['7度', '5度', '12度', '22度'],
    answerIndex: 0,
  },
  {
    id: 'f8-n4', floorId: 8, difficulty: 'normal',
    text: '1目もりが2度の折れ線グラフで3目もり上がると何度？',
    choices: ['6度', '3度', '5度', '2度'],
    answerIndex: 0,
  },
  {
    id: 'f8-n5', floorId: 8, difficulty: 'normal',
    text: '2つの折れ線グラフを重ねるとわかることは？',
    choices: ['2つのデータの変化のちがい', '合計の値', '平均の値', 'データの個数'],
    answerIndex: 0,
  },

  // === hard (5問) ===
  {
    id: 'f8-h1', floorId: 8, difficulty: 'hard',
    text: '1月5度、2月3度、3月8度、4月14度。最も上がり方が大きいのは？',
    choices: ['3月→4月', '2月→3月', '1月→2月', '1月→4月'],
    answerIndex: 0,
  },
  {
    id: 'f8-h2', floorId: 8, difficulty: 'hard',
    text: '1目もりが0.5度のグラフで20.5度の点はどこ？',
    choices: ['20度から1目もり上', '20度から5目もり上', '21度から1目もり下', '20度のところ'],
    answerIndex: 0,
  },
  {
    id: 'f8-h3', floorId: 8, difficulty: 'hard',
    text: 'グラフの波線（〜）は何を表す？',
    choices: ['途中を省略している', 'データがない', '0を表す', '最大値を表す'],
    answerIndex: 0,
  },
  {
    id: 'f8-h4', floorId: 8, difficulty: 'hard',
    text: '平均気温 12, 14, 18, 20, 25 の平均は？',
    choices: ['17.8度', '18度', '20度', '15度'],
    answerIndex: 0,
  },
  {
    id: 'f8-h5', floorId: 8, difficulty: 'hard',
    text: 'A市(8,12,18,24,28度)とB市(10,12,16,22,26度)の差が一番大きい月は？',
    choices: ['5月目(2度差)', '4月目(2度差)', '1月目(2度差)', 'どの月も同じ'],
    answerIndex: 3,
  },
];
