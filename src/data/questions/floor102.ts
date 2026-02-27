import type { Question } from '../types.ts';

export const floor102Questions: Question[] = [
  // === easy (5問) — たしざん（くりあがりなし）===
  {
    id: 'f102-e1', floorId: 102, difficulty: 'easy',
    text: '2 + 3 = ?',
    choices: ['5', '4', '6', '3'],
    answerIndex: 0,
  },
  {
    id: 'f102-e2', floorId: 102, difficulty: 'easy',
    text: '1 + 4 = ?',
    choices: ['5', '3', '6', '4'],
    answerIndex: 0,
  },
  {
    id: 'f102-e3', floorId: 102, difficulty: 'easy',
    text: '3 + 1 = ?',
    choices: ['4', '5', '3', '2'],
    answerIndex: 0,
  },
  {
    id: 'f102-e4', floorId: 102, difficulty: 'easy',
    text: '4 + 2 = ?',
    choices: ['6', '5', '7', '4'],
    answerIndex: 0,
  },
  {
    id: 'f102-e5', floorId: 102, difficulty: 'easy',
    text: '5 + 1 = ?',
    choices: ['6', '7', '5', '4'],
    answerIndex: 0,
  },

  // === normal (5問) ===
  {
    id: 'f102-n1', floorId: 102, difficulty: 'normal',
    text: '3 + 5 = ?',
    choices: ['8', '7', '9', '6'],
    answerIndex: 0,
  },
  {
    id: 'f102-n2', floorId: 102, difficulty: 'normal',
    text: '6 + 3 = ?',
    choices: ['9', '8', '10', '7'],
    answerIndex: 0,
  },
  {
    id: 'f102-n3', floorId: 102, difficulty: 'normal',
    text: '4 + 4 = ?',
    choices: ['8', '6', '9', '7'],
    answerIndex: 0,
  },
  {
    id: 'f102-n4', floorId: 102, difficulty: 'normal',
    text: '2 + 7 = ?',
    choices: ['9', '8', '10', '7'],
    answerIndex: 0,
  },
  {
    id: 'f102-n5', floorId: 102, difficulty: 'normal',
    text: '5 + 4 = ?',
    choices: ['9', '8', '10', '7'],
    answerIndex: 0,
  },

  // === hard (5問) ===
  {
    id: 'f102-h1', floorId: 102, difficulty: 'hard',
    text: '□ + 3 = 7 の □は？',
    choices: ['4', '3', '5', '10'],
    answerIndex: 0,
  },
  {
    id: 'f102-h2', floorId: 102, difficulty: 'hard',
    text: '6 + □ = 10 の □は？',
    choices: ['4', '6', '3', '5'],
    answerIndex: 0,
  },
  {
    id: 'f102-h3', floorId: 102, difficulty: 'hard',
    text: 'あめが 4こ、もう 5こ もらうと ぜんぶで？',
    choices: ['9こ', '8こ', '10こ', '7こ'],
    answerIndex: 0,
  },
  {
    id: 'f102-h4', floorId: 102, difficulty: 'hard',
    text: '0 + 8 = ?',
    choices: ['8', '0', '80', '9'],
    answerIndex: 0,
  },
  {
    id: 'f102-h5', floorId: 102, difficulty: 'hard',
    text: '3 + 2 + 4 = ?',
    choices: ['9', '8', '10', '7'],
    answerIndex: 0,
  },
];
