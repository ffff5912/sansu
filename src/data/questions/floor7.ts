import type { Question } from '../types.ts';

// Floor 7: 分数のどうくつ (Fractions)
export const floor7Questions: Question[] = [
  // === easy (5問) ===
  {
    id: 'f7-e1', floorId: 7, difficulty: 'easy',
    text: '1/2 + 1/2 = ?',
    choices: ['1', '2/4', '1/4', '2/2'],
    answerIndex: 0,
  },
  {
    id: 'f7-e2', floorId: 7, difficulty: 'easy',
    text: '1/4 + 2/4 = ?',
    choices: ['3/4', '3/8', '1/2', '2/4'],
    answerIndex: 0,
  },
  {
    id: 'f7-e3', floorId: 7, difficulty: 'easy',
    text: '3/5 の分母はどれ？',
    choices: ['5', '3', '8', '15'],
    answerIndex: 0,
  },
  {
    id: 'f7-e4', floorId: 7, difficulty: 'easy',
    text: '5/5 はいくつ？',
    choices: ['1', '5', '0', '10'],
    answerIndex: 0,
  },
  {
    id: 'f7-e5', floorId: 7, difficulty: 'easy',
    text: '1/3 + 1/3 = ?',
    choices: ['2/3', '2/6', '1/6', '1/3'],
    answerIndex: 0,
  },

  // === normal (5問) ===
  {
    id: 'f7-n1', floorId: 7, difficulty: 'normal',
    text: '2/5 + 2/5 = ?',
    choices: ['4/5', '4/10', '2/10', '1/5'],
    answerIndex: 0,
  },
  {
    id: 'f7-n2', floorId: 7, difficulty: 'normal',
    text: '7/8 - 3/8 = ?',
    choices: ['4/8', '4/16', '3/8', '10/8'],
    answerIndex: 0,
  },
  {
    id: 'f7-n3', floorId: 7, difficulty: 'normal',
    text: '2/6 を約分すると？',
    choices: ['1/3', '1/2', '2/3', '1/6'],
    answerIndex: 0,
  },
  {
    id: 'f7-n4', floorId: 7, difficulty: 'normal',
    text: '1と3/4 を仮分数にすると？',
    choices: ['7/4', '4/3', '3/4', '13/4'],
    answerIndex: 0,
  },
  {
    id: 'f7-n5', floorId: 7, difficulty: 'normal',
    text: '大きいのはどっち？ 3/4 と 2/3',
    choices: ['3/4', '2/3', '同じ', 'わからない'],
    answerIndex: 0,
  },

  // === hard (5問) ===
  {
    id: 'f7-h1', floorId: 7, difficulty: 'hard',
    text: '1/2 + 1/3 = ?（通分して計算）',
    choices: ['5/6', '2/5', '1/5', '3/6'],
    answerIndex: 0,
  },
  {
    id: 'f7-h2', floorId: 7, difficulty: 'hard',
    text: '9/4 を帯分数にすると？',
    choices: ['2と1/4', '2と2/4', '1と5/4', '4と1/9'],
    answerIndex: 0,
  },
  {
    id: 'f7-h3', floorId: 7, difficulty: 'hard',
    text: '3/4 - 1/3 = ?（通分して計算）',
    choices: ['5/12', '2/1', '2/12', '1/4'],
    answerIndex: 0,
  },
  {
    id: 'f7-h4', floorId: 7, difficulty: 'hard',
    text: '12/18 を約分すると？',
    choices: ['2/3', '3/4', '4/6', '6/9'],
    answerIndex: 0,
  },
  {
    id: 'f7-h5', floorId: 7, difficulty: 'hard',
    text: '2と1/2 + 1と1/2 = ?',
    choices: ['4', '3と2/4', '3', '3と1/2'],
    answerIndex: 0,
  },
];
