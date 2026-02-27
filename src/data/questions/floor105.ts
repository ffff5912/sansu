import type { Question } from '../types.ts';

export const floor105Questions: Question[] = [
  // === easy (5問) — くりさがりのある ひきざん ===
  {
    id: 'f105-e1', floorId: 105, difficulty: 'easy',
    text: '11 - 2 = ?',
    choices: ['9', '8', '10', '13'],
    answerIndex: 0,
  },
  {
    id: 'f105-e2', floorId: 105, difficulty: 'easy',
    text: '12 - 3 = ?',
    choices: ['9', '8', '10', '15'],
    answerIndex: 0,
  },
  {
    id: 'f105-e3', floorId: 105, difficulty: 'easy',
    text: '11 - 4 = ?',
    choices: ['7', '6', '8', '15'],
    answerIndex: 0,
  },
  {
    id: 'f105-e4', floorId: 105, difficulty: 'easy',
    text: '13 - 5 = ?',
    choices: ['8', '7', '9', '18'],
    answerIndex: 0,
  },
  {
    id: 'f105-e5', floorId: 105, difficulty: 'easy',
    text: '14 - 6 = ?',
    choices: ['8', '7', '9', '20'],
    answerIndex: 0,
  },

  // === normal (5問) ===
  {
    id: 'f105-n1', floorId: 105, difficulty: 'normal',
    text: '15 - 7 = ?',
    choices: ['8', '7', '9', '22'],
    answerIndex: 0,
  },
  {
    id: 'f105-n2', floorId: 105, difficulty: 'normal',
    text: '16 - 8 = ?',
    choices: ['8', '7', '9', '24'],
    answerIndex: 0,
  },
  {
    id: 'f105-n3', floorId: 105, difficulty: 'normal',
    text: '13 - 9 = ?',
    choices: ['4', '3', '5', '22'],
    answerIndex: 0,
  },
  {
    id: 'f105-n4', floorId: 105, difficulty: 'normal',
    text: '17 - 8 = ?',
    choices: ['9', '8', '10', '25'],
    answerIndex: 0,
  },
  {
    id: 'f105-n5', floorId: 105, difficulty: 'normal',
    text: '12 - 7 = ?',
    choices: ['5', '4', '6', '19'],
    answerIndex: 0,
  },

  // === hard (5問) ===
  {
    id: 'f105-h1', floorId: 105, difficulty: 'hard',
    text: '14 - □ = 6 の □は？',
    choices: ['8', '7', '9', '20'],
    answerIndex: 0,
  },
  {
    id: 'f105-h2', floorId: 105, difficulty: 'hard',
    text: '□ - 9 = 7 の □は？',
    choices: ['16', '15', '17', '2'],
    answerIndex: 0,
  },
  {
    id: 'f105-h3', floorId: 105, difficulty: 'hard',
    text: 'おりがみが 15まい、8まい つかうと のこりは？',
    choices: ['7まい', '6まい', '8まい', '23まい'],
    answerIndex: 0,
  },
  {
    id: 'f105-h4', floorId: 105, difficulty: 'hard',
    text: '18 - 9 = ?',
    choices: ['9', '8', '10', '27'],
    answerIndex: 0,
  },
  {
    id: 'f105-h5', floorId: 105, difficulty: 'hard',
    text: '15 - 6 - 3 = ?',
    choices: ['6', '5', '7', '4'],
    answerIndex: 0,
  },
];
