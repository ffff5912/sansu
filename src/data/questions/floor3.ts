import type { Question } from '../types.ts';

// Floor 3: 角度のとう (Angles)
export const floor3Questions: Question[] = [
  // === easy (5問) ===
  {
    id: 'f3-e1', floorId: 3, difficulty: 'easy',
    text: '直角は何度？',
    choices: ['90度', '45度', '180度', '60度'],
    answerIndex: 0,
  },
  {
    id: 'f3-e2', floorId: 3, difficulty: 'easy',
    text: '一回転は何度？',
    choices: ['360度', '180度', '270度', '300度'],
    answerIndex: 0,
  },
  {
    id: 'f3-e3', floorId: 3, difficulty: 'easy',
    text: '半回転は何度？',
    choices: ['180度', '90度', '270度', '360度'],
    answerIndex: 0,
  },
  {
    id: 'f3-e4', floorId: 3, difficulty: 'easy',
    text: '直角の半分は何度？',
    choices: ['45度', '30度', '60度', '90度'],
    answerIndex: 0,
  },
  {
    id: 'f3-e5', floorId: 3, difficulty: 'easy',
    text: '時計の3時の長針と短針の角度は？',
    choices: ['90度', '60度', '120度', '180度'],
    answerIndex: 0,
  },

  // === normal (5問) ===
  {
    id: 'f3-n1', floorId: 3, difficulty: 'normal',
    text: '三角形の3つの角の和は？',
    choices: ['180度', '360度', '270度', '90度'],
    answerIndex: 0,
  },
  {
    id: 'f3-n2', floorId: 3, difficulty: 'normal',
    text: '四角形の4つの角の和は？',
    choices: ['360度', '180度', '270度', '540度'],
    answerIndex: 0,
  },
  {
    id: 'f3-n3', floorId: 3, difficulty: 'normal',
    text: '30度 + 60度 + □度 = 180度 の□は？',
    choices: ['90', '80', '100', '70'],
    answerIndex: 0,
  },
  {
    id: 'f3-n4', floorId: 3, difficulty: 'normal',
    text: '正三角形の1つの角は何度？',
    choices: ['60度', '90度', '45度', '120度'],
    answerIndex: 0,
  },
  {
    id: 'f3-n5', floorId: 3, difficulty: 'normal',
    text: '二等辺三角形の頂角が40度のとき、底角は何度？',
    choices: ['70度', '80度', '60度', '50度'],
    answerIndex: 0,
  },

  // === hard (5問) ===
  {
    id: 'f3-h1', floorId: 3, difficulty: 'hard',
    text: '時計の6時の長針と短針の角度は？',
    choices: ['180度', '90度', '270度', '360度'],
    answerIndex: 0,
  },
  {
    id: 'f3-h2', floorId: 3, difficulty: 'hard',
    text: '正方形の対角線がつくる角度は？',
    choices: ['90度', '45度', '60度', '120度'],
    answerIndex: 0,
  },
  {
    id: 'f3-h3', floorId: 3, difficulty: 'hard',
    text: '五角形の内角の和は？',
    choices: ['540度', '360度', '480度', '720度'],
    answerIndex: 0,
  },
  {
    id: 'f3-h4', floorId: 3, difficulty: 'hard',
    text: '2つの直線が交わるとき、向かい合う角を何という？',
    choices: ['対頂角', '同位角', '錯角', '隣接角'],
    answerIndex: 0,
  },
  {
    id: 'f3-h5', floorId: 3, difficulty: 'hard',
    text: '135度の角は直角何個分と何度？',
    choices: ['1個分と45度', '2個分と45度', '1個分と35度', '1個分と55度'],
    answerIndex: 0,
  },
];
