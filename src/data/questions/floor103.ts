import type { Question } from '../types.ts';

export const floor103Questions: Question[] = [
  // === easy (5問) — ひきざん（くりさがりなし）===
  {
    id: 'f103-e1', floorId: 103, difficulty: 'easy',
    text: '5 - 2 = ?',
    choices: ['3', '2', '4', '7'],
    answerIndex: 0,
  },
  {
    id: 'f103-e2', floorId: 103, difficulty: 'easy',
    text: '7 - 3 = ?',
    choices: ['4', '3', '5', '10'],
    answerIndex: 0,
  },
  {
    id: 'f103-e3', floorId: 103, difficulty: 'easy',
    text: '6 - 1 = ?',
    choices: ['5', '4', '6', '7'],
    answerIndex: 0,
  },
  {
    id: 'f103-e4', floorId: 103, difficulty: 'easy',
    text: '4 - 2 = ?',
    choices: ['2', '3', '1', '6'],
    answerIndex: 0,
  },
  {
    id: 'f103-e5', floorId: 103, difficulty: 'easy',
    text: '8 - 5 = ?',
    choices: ['3', '2', '4', '13'],
    answerIndex: 0,
  },

  // === normal (5問) ===
  {
    id: 'f103-n1', floorId: 103, difficulty: 'normal',
    text: '9 - 4 = ?',
    choices: ['5', '4', '6', '13'],
    answerIndex: 0,
  },
  {
    id: 'f103-n2', floorId: 103, difficulty: 'normal',
    text: '10 - 3 = ?',
    choices: ['7', '8', '6', '13'],
    answerIndex: 0,
  },
  {
    id: 'f103-n3', floorId: 103, difficulty: 'normal',
    text: '8 - 8 = ?',
    choices: ['0', '1', '8', '16'],
    answerIndex: 0,
  },
  {
    id: 'f103-n4', floorId: 103, difficulty: 'normal',
    text: '10 - 6 = ?',
    choices: ['4', '5', '3', '16'],
    answerIndex: 0,
  },
  {
    id: 'f103-n5', floorId: 103, difficulty: 'normal',
    text: '7 - 0 = ?',
    choices: ['7', '0', '1', '6'],
    answerIndex: 0,
  },

  // === hard (5問) ===
  {
    id: 'f103-h1', floorId: 103, difficulty: 'hard',
    text: '9 - □ = 3 の □は？',
    choices: ['6', '5', '3', '12'],
    answerIndex: 0,
  },
  {
    id: 'f103-h2', floorId: 103, difficulty: 'hard',
    text: '□ - 4 = 5 の □は？',
    choices: ['9', '1', '8', '10'],
    answerIndex: 0,
  },
  {
    id: 'f103-h3', floorId: 103, difficulty: 'hard',
    text: 'いちごが 8こ、3こ たべると のこりは？',
    choices: ['5こ', '4こ', '6こ', '11こ'],
    answerIndex: 0,
  },
  {
    id: 'f103-h4', floorId: 103, difficulty: 'hard',
    text: '10 - 2 - 3 = ?',
    choices: ['5', '4', '6', '15'],
    answerIndex: 0,
  },
  {
    id: 'f103-h5', floorId: 103, difficulty: 'hard',
    text: 'どちらが おおきい？ 9-4 と 8-5',
    choices: ['9-4', '8-5', 'おなじ', 'わからない'],
    answerIndex: 0,
  },
];
