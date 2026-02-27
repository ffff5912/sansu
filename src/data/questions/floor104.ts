import type { Question } from '../types.ts';

export const floor104Questions: Question[] = [
  // === easy (5問) — くりあがりのある たしざん ===
  {
    id: 'f104-e1', floorId: 104, difficulty: 'easy',
    text: '9 + 2 = ?',
    choices: ['11', '10', '12', '7'],
    answerIndex: 0,
  },
  {
    id: 'f104-e2', floorId: 104, difficulty: 'easy',
    text: '8 + 3 = ?',
    choices: ['11', '10', '12', '5'],
    answerIndex: 0,
  },
  {
    id: 'f104-e3', floorId: 104, difficulty: 'easy',
    text: '7 + 4 = ?',
    choices: ['11', '10', '12', '3'],
    answerIndex: 0,
  },
  {
    id: 'f104-e4', floorId: 104, difficulty: 'easy',
    text: '9 + 3 = ?',
    choices: ['12', '11', '13', '6'],
    answerIndex: 0,
  },
  {
    id: 'f104-e5', floorId: 104, difficulty: 'easy',
    text: '8 + 5 = ?',
    choices: ['13', '12', '14', '3'],
    answerIndex: 0,
  },

  // === normal (5問) ===
  {
    id: 'f104-n1', floorId: 104, difficulty: 'normal',
    text: '6 + 7 = ?',
    choices: ['13', '12', '14', '1'],
    answerIndex: 0,
  },
  {
    id: 'f104-n2', floorId: 104, difficulty: 'normal',
    text: '5 + 8 = ?',
    choices: ['13', '12', '14', '3'],
    answerIndex: 0,
  },
  {
    id: 'f104-n3', floorId: 104, difficulty: 'normal',
    text: '7 + 7 = ?',
    choices: ['14', '13', '15', '0'],
    answerIndex: 0,
  },
  {
    id: 'f104-n4', floorId: 104, difficulty: 'normal',
    text: '9 + 9 = ?',
    choices: ['18', '17', '19', '0'],
    answerIndex: 0,
  },
  {
    id: 'f104-n5', floorId: 104, difficulty: 'normal',
    text: '6 + 6 = ?',
    choices: ['12', '11', '13', '0'],
    answerIndex: 0,
  },

  // === hard (5問) ===
  {
    id: 'f104-h1', floorId: 104, difficulty: 'hard',
    text: '□ + 7 = 15 の □は？',
    choices: ['8', '7', '9', '22'],
    answerIndex: 0,
  },
  {
    id: 'f104-h2', floorId: 104, difficulty: 'hard',
    text: '8 + □ = 14 の □は？',
    choices: ['6', '5', '7', '22'],
    answerIndex: 0,
  },
  {
    id: 'f104-h3', floorId: 104, difficulty: 'hard',
    text: 'ケーキが 7こ、あと 6こ かうと ぜんぶで？',
    choices: ['13こ', '12こ', '14こ', '1こ'],
    answerIndex: 0,
  },
  {
    id: 'f104-h4', floorId: 104, difficulty: 'hard',
    text: '5 + 6 + 3 = ?',
    choices: ['14', '13', '15', '12'],
    answerIndex: 0,
  },
  {
    id: 'f104-h5', floorId: 104, difficulty: 'hard',
    text: '9 + 8 = ?',
    choices: ['17', '16', '18', '1'],
    answerIndex: 0,
  },
];
