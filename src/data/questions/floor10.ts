import type { Question } from '../types.ts';

// Floor 10: そろばんのやま (Mental Math / Abacus)
export const floor10Questions: Question[] = [
  // === easy (5問) ===
  {
    id: 'f10-e1', floorId: 10, difficulty: 'easy',
    text: '25 + 37 = ?（暗算）',
    choices: ['62', '52', '72', '63'],
    answerIndex: 0,
  },
  {
    id: 'f10-e2', floorId: 10, difficulty: 'easy',
    text: '80 - 35 = ?（暗算）',
    choices: ['45', '55', '35', '50'],
    answerIndex: 0,
  },
  {
    id: 'f10-e3', floorId: 10, difficulty: 'easy',
    text: '6 × 7 = ?',
    choices: ['42', '36', '48', '40'],
    answerIndex: 0,
  },
  {
    id: 'f10-e4', floorId: 10, difficulty: 'easy',
    text: '100 - 48 = ?（暗算）',
    choices: ['52', '62', '42', '58'],
    answerIndex: 0,
  },
  {
    id: 'f10-e5', floorId: 10, difficulty: 'easy',
    text: '15 × 4 = ?',
    choices: ['60', '50', '70', '55'],
    answerIndex: 0,
  },

  // === normal (5問) ===
  {
    id: 'f10-n1', floorId: 10, difficulty: 'normal',
    text: '125 + 278 = ?（暗算）',
    choices: ['403', '393', '413', '303'],
    answerIndex: 0,
  },
  {
    id: 'f10-n2', floorId: 10, difficulty: 'normal',
    text: '500 - 167 = ?（暗算）',
    choices: ['333', '343', '337', '367'],
    answerIndex: 0,
  },
  {
    id: 'f10-n3', floorId: 10, difficulty: 'normal',
    text: '25 × 8 = ?',
    choices: ['200', '175', '225', '150'],
    answerIndex: 0,
  },
  {
    id: 'f10-n4', floorId: 10, difficulty: 'normal',
    text: '99 × 5 = ?（くふうして計算）',
    choices: ['495', '500', '490', '485'],
    answerIndex: 0,
  },
  {
    id: 'f10-n5', floorId: 10, difficulty: 'normal',
    text: '1000 - 625 = ?（暗算）',
    choices: ['375', '385', '475', '365'],
    answerIndex: 0,
  },

  // === hard (5問) ===
  {
    id: 'f10-h1', floorId: 10, difficulty: 'hard',
    text: '250 × 4 = ?',
    choices: ['1000', '900', '1100', '800'],
    answerIndex: 0,
  },
  {
    id: 'f10-h2', floorId: 10, difficulty: 'hard',
    text: '48 × 25 = ?（くふうして計算）',
    choices: ['1200', '1100', '1000', '1250'],
    answerIndex: 0,
  },
  {
    id: 'f10-h3', floorId: 10, difficulty: 'hard',
    text: '3456 + 4544 = ?',
    choices: ['8000', '7900', '8100', '7000'],
    answerIndex: 0,
  },
  {
    id: 'f10-h4', floorId: 10, difficulty: 'hard',
    text: '101 × 9 = ?（くふうして計算）',
    choices: ['909', '900', '999', '910'],
    answerIndex: 0,
  },
  {
    id: 'f10-h5', floorId: 10, difficulty: 'hard',
    text: '756 - 298 = ?（暗算のくふう）',
    choices: ['458', '448', '468', '558'],
    answerIndex: 0,
  },
];
