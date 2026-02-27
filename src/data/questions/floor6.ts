import type { Question } from '../types.ts';

// Floor 6: 面積のへいげん (Area)
export const floor6Questions: Question[] = [
  // === easy (5問) ===
  {
    id: 'f6-e1', floorId: 6, difficulty: 'easy',
    text: 'たて3cm、横4cmの長方形の面積は？',
    choices: ['12cm²', '7cm²', '14cm²', '10cm²'],
    answerIndex: 0,
  },
  {
    id: 'f6-e2', floorId: 6, difficulty: 'easy',
    text: '1辺が5cmの正方形の面積は？',
    choices: ['25cm²', '20cm²', '10cm²', '15cm²'],
    answerIndex: 0,
  },
  {
    id: 'f6-e3', floorId: 6, difficulty: 'easy',
    text: '面積の単位で正しいのはどれ？',
    choices: ['cm²', 'cm', 'cm³', 'c²m'],
    answerIndex: 0,
  },
  {
    id: 'f6-e4', floorId: 6, difficulty: 'easy',
    text: 'たて2cm、横6cmの長方形の面積は？',
    choices: ['12cm²', '8cm²', '16cm²', '10cm²'],
    answerIndex: 0,
  },
  {
    id: 'f6-e5', floorId: 6, difficulty: 'easy',
    text: '長方形の面積の公式は？',
    choices: ['たて×横', 'たて＋横', 'たて×横×2', '（たて＋横）×2'],
    answerIndex: 0,
  },

  // === normal (5問) ===
  {
    id: 'f6-n1', floorId: 6, difficulty: 'normal',
    text: '1m² = 何cm²？',
    choices: ['10000cm²', '100cm²', '1000cm²', '100000cm²'],
    answerIndex: 0,
  },
  {
    id: 'f6-n2', floorId: 6, difficulty: 'normal',
    text: 'たて8cm、横12cmの長方形の面積は？',
    choices: ['96cm²', '40cm²', '80cm²', '20cm²'],
    answerIndex: 0,
  },
  {
    id: 'f6-n3', floorId: 6, difficulty: 'normal',
    text: '面積が36cm²の正方形の1辺は何cm？',
    choices: ['6cm', '9cm', '4cm', '18cm'],
    answerIndex: 0,
  },
  {
    id: 'f6-n4', floorId: 6, difficulty: 'normal',
    text: '1a（アール）は何m²？',
    choices: ['100m²', '10m²', '1000m²', '50m²'],
    answerIndex: 0,
  },
  {
    id: 'f6-n5', floorId: 6, difficulty: 'normal',
    text: 'たて5m、横8mの長方形の面積は？',
    choices: ['40m²', '13m²', '26m²', '80m²'],
    answerIndex: 0,
  },

  // === hard (5問) ===
  {
    id: 'f6-h1', floorId: 6, difficulty: 'hard',
    text: '1ha（ヘクタール）は何m²？',
    choices: ['10000m²', '1000m²', '100m²', '100000m²'],
    answerIndex: 0,
  },
  {
    id: 'f6-h2', floorId: 6, difficulty: 'hard',
    text: '1km² = 何m²？',
    choices: ['1000000m²', '100000m²', '10000m²', '1000m²'],
    answerIndex: 0,
  },
  {
    id: 'f6-h3', floorId: 6, difficulty: 'hard',
    text: 'L字型の面積：大きい長方形(5×8)から小さい長方形(2×3)を引くと？',
    choices: ['34cm²', '40cm²', '46cm²', '30cm²'],
    answerIndex: 0,
  },
  {
    id: 'f6-h4', floorId: 6, difficulty: 'hard',
    text: '30000cm²は何m²？',
    choices: ['3m²', '30m²', '300m²', '0.3m²'],
    answerIndex: 0,
  },
  {
    id: 'f6-h5', floorId: 6, difficulty: 'hard',
    text: 'たて15m、横20mの長方形は何a？',
    choices: ['3a', '30a', '300a', '0.3a'],
    answerIndex: 0,
  },
];
