import type { Question } from '../types.ts';

// Floor 4: 小数のみずうみ (Decimals)
export const floor4Questions: Question[] = [
  // === easy (5問) ===
  {
    id: 'f4-e1', floorId: 4, difficulty: 'easy',
    text: '0.1 + 0.2 = ?',
    choices: ['0.3', '0.12', '0.03', '3'],
    answerIndex: 0,
  },
  {
    id: 'f4-e2', floorId: 4, difficulty: 'easy',
    text: '0.5 + 0.5 = ?',
    choices: ['1', '0.10', '1.0', '0.55'],
    answerIndex: 0,
  },
  {
    id: 'f4-e3', floorId: 4, difficulty: 'easy',
    text: '1.2 + 0.3 = ?',
    choices: ['1.5', '1.23', '0.15', '4.2'],
    answerIndex: 0,
  },
  {
    id: 'f4-e4', floorId: 4, difficulty: 'easy',
    text: '0.7 - 0.3 = ?',
    choices: ['0.4', '0.73', '1.0', '0.1'],
    answerIndex: 0,
  },
  {
    id: 'f4-e5', floorId: 4, difficulty: 'easy',
    text: '0.1が5こで何？',
    choices: ['0.5', '5', '0.15', '0.05'],
    answerIndex: 0,
  },

  // === normal (5問) ===
  {
    id: 'f4-n1', floorId: 4, difficulty: 'normal',
    text: '2.5 + 3.8 = ?',
    choices: ['6.3', '6.13', '5.13', '5.3'],
    answerIndex: 0,
  },
  {
    id: 'f4-n2', floorId: 4, difficulty: 'normal',
    text: '5.0 - 2.7 = ?',
    choices: ['2.3', '3.3', '2.7', '3.7'],
    answerIndex: 0,
  },
  {
    id: 'f4-n3', floorId: 4, difficulty: 'normal',
    text: '0.01が100こで何？',
    choices: ['1', '10', '0.1', '100'],
    answerIndex: 0,
  },
  {
    id: 'f4-n4', floorId: 4, difficulty: 'normal',
    text: '3.14の「1」は何の位？',
    choices: ['十分の一の位', '一の位', '百分の一の位', '十の位'],
    answerIndex: 0,
  },
  {
    id: 'f4-n5', floorId: 4, difficulty: 'normal',
    text: '1.25を10倍すると？',
    choices: ['12.5', '125', '0.125', '1.250'],
    answerIndex: 0,
  },

  // === hard (5問) ===
  {
    id: 'f4-h1', floorId: 4, difficulty: 'hard',
    text: '4.56 + 3.78 = ?',
    choices: ['8.34', '8.24', '7.34', '8.44'],
    answerIndex: 0,
  },
  {
    id: 'f4-h2', floorId: 4, difficulty: 'hard',
    text: '10 - 3.65 = ?',
    choices: ['6.35', '7.35', '6.45', '7.65'],
    answerIndex: 0,
  },
  {
    id: 'f4-h3', floorId: 4, difficulty: 'hard',
    text: '0.25 × 4 = ?',
    choices: ['1', '0.100', '1.0', '0.29'],
    answerIndex: 0,
  },
  {
    id: 'f4-h4', floorId: 4, difficulty: 'hard',
    text: '7.2 ÷ 0.9 = ?',
    choices: ['8', '7', '9', '6'],
    answerIndex: 0,
  },
  {
    id: 'f4-h5', floorId: 4, difficulty: 'hard',
    text: '0.001が何こで0.1？',
    choices: ['100こ', '10こ', '1000こ', '50こ'],
    answerIndex: 0,
  },
];
