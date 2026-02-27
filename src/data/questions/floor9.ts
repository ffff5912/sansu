import type { Question } from '../types.ts';

// Floor 9: 図形のしんでん (Shapes - Parallel and Perpendicular)
export const floor9Questions: Question[] = [
  // === easy (5問) ===
  {
    id: 'f9-e1', floorId: 9, difficulty: 'easy',
    text: '2つの直線が直角に交わるとき、この関係を何という？',
    choices: ['垂直', '平行', '対角', '交差'],
    answerIndex: 0,
  },
  {
    id: 'f9-e2', floorId: 9, difficulty: 'easy',
    text: '2つの直線がどこまでいっても交わらないとき、この関係を何という？',
    choices: ['平行', '垂直', '対角', '直角'],
    answerIndex: 0,
  },
  {
    id: 'f9-e3', floorId: 9, difficulty: 'easy',
    text: '正方形の向かい合う辺の関係は？',
    choices: ['平行', '垂直', '斜め', '交差'],
    answerIndex: 0,
  },
  {
    id: 'f9-e4', floorId: 9, difficulty: 'easy',
    text: '正方形のとなり合う辺の関係は？',
    choices: ['垂直', '平行', '斜め', '同じ長さ'],
    answerIndex: 0,
  },
  {
    id: 'f9-e5', floorId: 9, difficulty: 'easy',
    text: '平行四辺形の向かい合う辺は？',
    choices: ['平行で長さが等しい', '垂直', '長さがちがう', '直角'],
    answerIndex: 0,
  },

  // === normal (5問) ===
  {
    id: 'f9-n1', floorId: 9, difficulty: 'normal',
    text: '台形はどんな四角形？',
    choices: ['1組の向かい合う辺が平行', '2組の辺が平行', '全部の辺が等しい', '4つの角が直角'],
    answerIndex: 0,
  },
  {
    id: 'f9-n2', floorId: 9, difficulty: 'normal',
    text: 'ひし形の特ちょうは？',
    choices: ['4つの辺の長さが全部等しい', '4つの角が直角', '向かい合う辺だけ等しい', '1組だけ平行'],
    answerIndex: 0,
  },
  {
    id: 'f9-n3', floorId: 9, difficulty: 'normal',
    text: '平行四辺形の向かい合う角は？',
    choices: ['等しい', '直角', '合わせて180度', '合わせて90度'],
    answerIndex: 0,
  },
  {
    id: 'f9-n4', floorId: 9, difficulty: 'normal',
    text: '長方形は平行四辺形の仲間？',
    choices: ['はい', 'いいえ', '場合による', 'ちがう形'],
    answerIndex: 0,
  },
  {
    id: 'f9-n5', floorId: 9, difficulty: 'normal',
    text: '対角線が直角に交わる四角形はどれ？',
    choices: ['ひし形', '台形', '平行四辺形', '長方形'],
    answerIndex: 0,
  },

  // === hard (5問) ===
  {
    id: 'f9-h1', floorId: 9, difficulty: 'hard',
    text: '正方形はひし形でもある？',
    choices: ['はい', 'いいえ', '場合による', 'ちがう形'],
    answerIndex: 0,
  },
  {
    id: 'f9-h2', floorId: 9, difficulty: 'hard',
    text: '平行四辺形のとなり合う角の和は？',
    choices: ['180度', '90度', '360度', '270度'],
    answerIndex: 0,
  },
  {
    id: 'f9-h3', floorId: 9, difficulty: 'hard',
    text: '2組の辺が平行で4つの角が直角の四角形は？',
    choices: ['長方形', 'ひし形', '台形', '平行四辺形'],
    answerIndex: 0,
  },
  {
    id: 'f9-h4', floorId: 9, difficulty: 'hard',
    text: '平行四辺形の対角線の交点は対角線を？',
    choices: ['2等分する', '直角に分ける', '3等分する', '等しく分けない'],
    answerIndex: 0,
  },
  {
    id: 'f9-h5', floorId: 9, difficulty: 'hard',
    text: '1つの頂点から引ける対角線で四角形はいくつの三角形に分かれる？',
    choices: ['2つ', '3つ', '4つ', '1つ'],
    answerIndex: 0,
  },
];
