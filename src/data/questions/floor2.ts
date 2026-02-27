import type { Question } from '../types.ts';

// Floor 2: わり算のもり (Division)
export const floor2Questions: Question[] = [
  // === easy (5問) ===
  {
    id: 'f2-e1', floorId: 2, difficulty: 'easy',
    text: '12 ÷ 3 = ?',
    choices: ['4', '3', '6', '5'],
    answerIndex: 0,
  },
  {
    id: 'f2-e2', floorId: 2, difficulty: 'easy',
    text: '20 ÷ 5 = ?',
    choices: ['4', '5', '3', '10'],
    answerIndex: 0,
  },
  {
    id: 'f2-e3', floorId: 2, difficulty: 'easy',
    text: '18 ÷ 2 = ?',
    choices: ['9', '8', '6', '10'],
    answerIndex: 0,
  },
  {
    id: 'f2-e4', floorId: 2, difficulty: 'easy',
    text: '36 ÷ 6 = ?',
    choices: ['6', '5', '7', '8'],
    answerIndex: 0,
  },
  {
    id: 'f2-e5', floorId: 2, difficulty: 'easy',
    text: '45 ÷ 9 = ?',
    choices: ['5', '4', '6', '9'],
    answerIndex: 0,
  },

  // === normal (5問) ===
  {
    id: 'f2-n1', floorId: 2, difficulty: 'normal',
    text: '84 ÷ 7 = ?',
    choices: ['12', '11', '13', '14'],
    answerIndex: 0,
  },
  {
    id: 'f2-n2', floorId: 2, difficulty: 'normal',
    text: '96 ÷ 8 = ?',
    choices: ['12', '11', '13', '14'],
    answerIndex: 0,
  },
  {
    id: 'f2-n3', floorId: 2, difficulty: 'normal',
    text: '75 ÷ 25 = ?',
    choices: ['3', '4', '5', '2'],
    answerIndex: 0,
  },
  {
    id: 'f2-n4', floorId: 2, difficulty: 'normal',
    text: '136 ÷ 4 = ?',
    choices: ['34', '32', '36', '38'],
    answerIndex: 0,
  },
  {
    id: 'f2-n5', floorId: 2, difficulty: 'normal',
    text: '91 ÷ 7 のあまりは？',
    choices: ['0', '1', '2', '3'],
    answerIndex: 0,
  },

  // === hard (5問) ===
  {
    id: 'f2-h1', floorId: 2, difficulty: 'hard',
    text: '432 ÷ 16 = ?',
    choices: ['27', '26', '28', '24'],
    answerIndex: 0,
  },
  {
    id: 'f2-h2', floorId: 2, difficulty: 'hard',
    text: '625 ÷ 25 = ?',
    choices: ['25', '24', '26', '30'],
    answerIndex: 0,
  },
  {
    id: 'f2-h3', floorId: 2, difficulty: 'hard',
    text: '357 ÷ 17 のあまりは？',
    choices: ['0', '1', '3', '5'],
    answerIndex: 0,
  },
  {
    id: 'f2-h4', floorId: 2, difficulty: 'hard',
    text: '□ ÷ 12 = 15 の□は？',
    choices: ['180', '170', '150', '200'],
    answerIndex: 0,
  },
  {
    id: 'f2-h5', floorId: 2, difficulty: 'hard',
    text: '504 ÷ 21 = ?',
    choices: ['24', '22', '26', '25'],
    answerIndex: 0,
  },
];
