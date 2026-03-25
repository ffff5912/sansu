import type { Question } from '../types.ts';

export const floor106Questions: Question[] = [
  // === easy (5問) — とけい（時計画像つき）===
  {
    id: 'f106-e1', floorId: 106, difficulty: 'easy',
    text: 'このとけいは なんじ？',
    choices: ['3じ', '6じ', '9じ', '12じ'],
    answerIndex: 0,
    clockTime: { hour: 3, minute: 0 },
  },
  {
    id: 'f106-e2', floorId: 106, difficulty: 'easy',
    text: 'このとけいは なんじ？',
    choices: ['7じ', '1じ', '8じ', '12じ'],
    answerIndex: 0,
    clockTime: { hour: 7, minute: 0 },
  },
  {
    id: 'f106-e3', floorId: 106, difficulty: 'easy',
    text: 'このとけいは なんじ？',
    choices: ['12じ', '6じ', '3じ', '9じ'],
    answerIndex: 0,
    clockTime: { hour: 12, minute: 0 },
  },
  {
    id: 'f106-e4', floorId: 106, difficulty: 'easy',
    text: 'このとけいは なんじ？',
    choices: ['9じ', '3じ', '6じ', '12じ'],
    answerIndex: 0,
    clockTime: { hour: 9, minute: 0 },
  },
  {
    id: 'f106-e5', floorId: 106, difficulty: 'easy',
    text: 'このとけいは なんじ？',
    choices: ['6じ', '12じ', '3じ', '9じ'],
    answerIndex: 0,
    clockTime: { hour: 6, minute: 0 },
  },

  // === normal (5問) — 時計画像＋「〜じはん」===
  {
    id: 'f106-n1', floorId: 106, difficulty: 'normal',
    text: 'このとけいは なんじなんぷん？',
    choices: ['3じ30ぷん', '3じ', '6じ30ぷん', '9じ30ぷん'],
    answerIndex: 0,
    clockTime: { hour: 3, minute: 30 },
  },
  {
    id: 'f106-n2', floorId: 106, difficulty: 'normal',
    text: 'このとけいは なんじなんぷん？',
    choices: ['10じ30ぷん', '10じ', '4じ30ぷん', '11じ'],
    answerIndex: 0,
    clockTime: { hour: 10, minute: 30 },
  },
  {
    id: 'f106-n3', floorId: 106, difficulty: 'normal',
    text: 'このとけいは なんじなんぷん？',
    choices: ['8じ15ふん', '3じ40ぷん', '8じ', '3じ'],
    answerIndex: 0,
    clockTime: { hour: 8, minute: 15 },
  },
  {
    id: 'f106-n4', floorId: 106, difficulty: 'normal',
    text: 'このとけいは なんじなんぷん？',
    choices: ['1じ45ふん', '9じ5ふん', '2じ', '1じ30ぷん'],
    answerIndex: 0,
    clockTime: { hour: 1, minute: 45 },
  },
  {
    id: 'f106-n5', floorId: 106, difficulty: 'normal',
    text: 'このとけいは なんじなんぷん？',
    choices: ['5じ30ぷん', '6じ25ふん', '5じ', '11じ30ぷん'],
    answerIndex: 0,
    clockTime: { hour: 5, minute: 30 },
  },

  // === hard (5問) — 5分きざみ + 文章題 ===
  {
    id: 'f106-h1', floorId: 106, difficulty: 'hard',
    text: 'このとけいは なんじなんぷん？',
    choices: ['2じ50ぷん', '10じ10ぷん', '3じ', '2じ10ぷん'],
    answerIndex: 0,
    clockTime: { hour: 2, minute: 50 },
  },
  {
    id: 'f106-h2', floorId: 106, difficulty: 'hard',
    text: 'このとけいは なんじなんぷん？',
    choices: ['11じ20ぷん', '4じ55ふん', '11じ', '4じ'],
    answerIndex: 0,
    clockTime: { hour: 11, minute: 20 },
  },
  {
    id: 'f106-h3', floorId: 106, difficulty: 'hard',
    text: 'このとけいの 30ぷんご は なんじなんぷん？',
    choices: ['4じ25ふん', '3じ25ふん', '3じ55ふん', '4じ55ふん'],
    answerIndex: 0,
    clockTime: { hour: 3, minute: 55 },
  },
  {
    id: 'f106-h4', floorId: 106, difficulty: 'hard',
    text: 'このとけいは なんじなんぷん？',
    choices: ['7じ40ぷん', '8じ35ふん', '7じ', '8じ'],
    answerIndex: 0,
    clockTime: { hour: 7, minute: 40 },
  },
  {
    id: 'f106-h5', floorId: 106, difficulty: 'hard',
    text: 'このとけいの 1じかんまえ は なんじなんぷん？',
    choices: ['5じ10ぷん', '6じ10ぷん', '7じ10ぷん', '5じ'],
    answerIndex: 0,
    clockTime: { hour: 6, minute: 10 },
  },
];
