import type { Question } from '../types.ts';

// Floor 11: 変わり方のラボ (Variables & Relationships)
export const floor11Questions: Question[] = [
  // === easy (5問) ===
  {
    id: 'f11-e1', floorId: 11, difficulty: 'easy',
    text: '□ + 5 = 12 の□は？',
    choices: ['7', '5', '17', '6'],
    answerIndex: 0,
  },
  {
    id: 'f11-e2', floorId: 11, difficulty: 'easy',
    text: '□ × 3 = 18 の□は？',
    choices: ['6', '5', '15', '9'],
    answerIndex: 0,
  },
  {
    id: 'f11-e3', floorId: 11, difficulty: 'easy',
    text: '20 - □ = 8 の□は？',
    choices: ['12', '8', '28', '10'],
    answerIndex: 0,
  },
  {
    id: 'f11-e4', floorId: 11, difficulty: 'easy',
    text: '□が1増えると○は2増える。□が5のとき○は10。□が6のとき○は？',
    choices: ['12', '11', '10', '8'],
    answerIndex: 0,
  },
  {
    id: 'f11-e5', floorId: 11, difficulty: 'easy',
    text: '○ = □ + 3 で、□が4のとき○は？',
    choices: ['7', '1', '12', '3'],
    answerIndex: 0,
  },

  // === normal (5問) ===
  {
    id: 'f11-n1', floorId: 11, difficulty: 'normal',
    text: '○ = □ × 2 + 1 で、□が5のとき○は？',
    choices: ['11', '10', '12', '7'],
    answerIndex: 0,
  },
  {
    id: 'f11-n2', floorId: 11, difficulty: 'normal',
    text: '1だんで4まい、2だんで8まい。○ = □ × ? のきまりは？',
    choices: ['4', '2', '8', '6'],
    answerIndex: 0,
  },
  {
    id: 'f11-n3', floorId: 11, difficulty: 'normal',
    text: '□が1→3、2→5、3→7。□が6のとき○は？',
    choices: ['13', '12', '11', '14'],
    answerIndex: 0,
  },
  {
    id: 'f11-n4', floorId: 11, difficulty: 'normal',
    text: '正方形の1辺の長さ□cmとまわりの長さ○cm。○ = □ × ?',
    choices: ['4', '2', '8', '6'],
    answerIndex: 0,
  },
  {
    id: 'f11-n5', floorId: 11, difficulty: 'normal',
    text: '□ + ○ = 10 で、□が3のとき○は？',
    choices: ['7', '13', '3', '30'],
    answerIndex: 0,
  },

  // === hard (5問) ===
  {
    id: 'f11-h1', floorId: 11, difficulty: 'hard',
    text: '○ = □ × □ で、□が7のとき○は？',
    choices: ['49', '14', '42', '56'],
    answerIndex: 0,
  },
  {
    id: 'f11-h2', floorId: 11, difficulty: 'hard',
    text: '1だん目1こ、2だん目3こ、3だん目5こ。nだん目は？',
    choices: ['2×n-1', '2×n', '2×n+1', 'n×n'],
    answerIndex: 0,
  },
  {
    id: 'f11-h3', floorId: 11, difficulty: 'hard',
    text: '□が1→2、2→5、3→10、4→17。□が5のとき○は？',
    choices: ['26', '24', '25', '22'],
    answerIndex: 0,
  },
  {
    id: 'f11-h4', floorId: 11, difficulty: 'hard',
    text: '3×□ + 2×○ = 26 で、□が4のとき○は？',
    choices: ['7', '5', '6', '8'],
    answerIndex: 0,
  },
  {
    id: 'f11-h5', floorId: 11, difficulty: 'hard',
    text: '1, 1, 2, 3, 5, 8, ? 次の数は？',
    choices: ['13', '11', '10', '15'],
    answerIndex: 0,
  },
];
