import type { Question } from '../types.ts';

// Floor 12: 立体のてんくう (3D Shapes - Rectangular prisms & Cubes)
export const floor12Questions: Question[] = [
  // === easy (5問) ===
  {
    id: 'f12-e1', floorId: 12, difficulty: 'easy',
    text: '立方体の面はいくつ？',
    choices: ['6つ', '4つ', '8つ', '12つ'],
    answerIndex: 0,
  },
  {
    id: 'f12-e2', floorId: 12, difficulty: 'easy',
    text: '立方体の頂点はいくつ？',
    choices: ['8つ', '6つ', '4つ', '12つ'],
    answerIndex: 0,
  },
  {
    id: 'f12-e3', floorId: 12, difficulty: 'easy',
    text: '立方体の辺はいくつ？',
    choices: ['12本', '8本', '6本', '10本'],
    answerIndex: 0,
  },
  {
    id: 'f12-e4', floorId: 12, difficulty: 'easy',
    text: 'さいころの形は？',
    choices: ['立方体', '直方体', '三角柱', '円柱'],
    answerIndex: 0,
  },
  {
    id: 'f12-e5', floorId: 12, difficulty: 'easy',
    text: '直方体の面の形は？',
    choices: ['長方形（または正方形）', '三角形', '円', '五角形'],
    answerIndex: 0,
  },

  // === normal (5問) ===
  {
    id: 'f12-n1', floorId: 12, difficulty: 'normal',
    text: '直方体で向かい合う面の関係は？',
    choices: ['平行で合同', '垂直', '形がちがう', '大きさがちがう'],
    answerIndex: 0,
  },
  {
    id: 'f12-n2', floorId: 12, difficulty: 'normal',
    text: '直方体のとなり合う面の関係は？',
    choices: ['垂直', '平行', '合同', '同じ大きさ'],
    answerIndex: 0,
  },
  {
    id: 'f12-n3', floorId: 12, difficulty: 'normal',
    text: '1辺が3cmの立方体の1つの面の面積は？',
    choices: ['9cm²', '6cm²', '12cm²', '27cm²'],
    answerIndex: 0,
  },
  {
    id: 'f12-n4', floorId: 12, difficulty: 'normal',
    text: '直方体の展開図で向かい合う面はどの位置？',
    choices: ['1つとんだ位置', 'となり', '真向かい', '斜め'],
    answerIndex: 0,
  },
  {
    id: 'f12-n5', floorId: 12, difficulty: 'normal',
    text: '直方体で1つの頂点に集まる辺は何本？',
    choices: ['3本', '2本', '4本', '6本'],
    answerIndex: 0,
  },

  // === hard (5問) ===
  {
    id: 'f12-h1', floorId: 12, difficulty: 'hard',
    text: '直方体(たて3cm, 横4cm, 高さ5cm)の全部の辺の長さの合計は？',
    choices: ['48cm', '60cm', '36cm', '24cm'],
    answerIndex: 0,
  },
  {
    id: 'f12-h2', floorId: 12, difficulty: 'hard',
    text: '見取図で見えない辺はどうかく？',
    choices: ['点線でかく', 'かかない', '太い線でかく', '赤い線でかく'],
    answerIndex: 0,
  },
  {
    id: 'f12-h3', floorId: 12, difficulty: 'hard',
    text: '立方体の展開図は全部で何種類？',
    choices: ['11種類', '6種類', '8種類', '14種類'],
    answerIndex: 0,
  },
  {
    id: 'f12-h4', floorId: 12, difficulty: 'hard',
    text: '直方体(2cm×3cm×4cm)の表面積は？',
    choices: ['52cm²', '48cm²', '24cm²', '26cm²'],
    answerIndex: 0,
  },
  {
    id: 'f12-h5', floorId: 12, difficulty: 'hard',
    text: '1辺5cmの立方体の辺の長さの合計は？',
    choices: ['60cm', '30cm', '50cm', '20cm'],
    answerIndex: 0,
  },
];
