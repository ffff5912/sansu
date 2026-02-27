import type { Question } from '../types.ts';

export const floor1Questions: Question[] = [
  // === easy (5問) ===
  {
    id: 'f1-e1', floorId: 1, difficulty: 'easy',
    text: '三万五千を数字で書くと？',
    choices: ['35000', '3500', '350000', '30500'],
    answerIndex: 0,
  },
  {
    id: 'f1-e2', floorId: 1, difficulty: 'easy',
    text: '70000は何万？',
    choices: ['7万', '70万', '700万', '7千'],
    answerIndex: 0,
  },
  {
    id: 'f1-e3', floorId: 1, difficulty: 'easy',
    text: '十万を数字で書くと？',
    choices: ['100000', '10000', '1000000', '1000'],
    answerIndex: 0,
  },
  {
    id: 'f1-e4', floorId: 1, difficulty: 'easy',
    text: '40000 + 5000 = ?',
    choices: ['45000', '40500', '9000', '450000'],
    answerIndex: 0,
  },
  {
    id: 'f1-e5', floorId: 1, difficulty: 'easy',
    text: '90000は何が9こ？',
    choices: ['一万が9こ', '千が9こ', '十万が9こ', '百が9こ'],
    answerIndex: 0,
  },

  // === normal (5問) ===
  {
    id: 'f1-n1', floorId: 1, difficulty: 'normal',
    text: '三百二十五万を数字で書くと？',
    choices: ['3250000', '325000', '32500000', '30250000'],
    answerIndex: 0,
  },
  {
    id: 'f1-n2', floorId: 1, difficulty: 'normal',
    text: '5000000は何万？',
    choices: ['500万', '50万', '5000万', '5万'],
    answerIndex: 0,
  },
  {
    id: 'f1-n3', floorId: 1, difficulty: 'normal',
    text: '一億を数字で書くと0は何こ？',
    choices: ['8こ', '7こ', '9こ', '6こ'],
    answerIndex: 0,
  },
  {
    id: 'f1-n4', floorId: 1, difficulty: 'normal',
    text: '2400000 + 600000 = ?',
    choices: ['3000000', '2460000', '3000', '30000000'],
    answerIndex: 0,
  },
  {
    id: 'f1-n5', floorId: 1, difficulty: 'normal',
    text: '千万の位が7の数はどれ？',
    choices: ['72000000', '7200000', '720000', '700000000'],
    answerIndex: 0,
  },

  // === hard (5問) ===
  {
    id: 'f1-h1', floorId: 1, difficulty: 'hard',
    text: '一億三千万を数字で書くと？',
    choices: ['130000000', '13000000', '1300000000', '1030000000'],
    answerIndex: 0,
  },
  {
    id: 'f1-h2', floorId: 1, difficulty: 'hard',
    text: '10を8回かけた数は？',
    choices: ['一億', '一千万', '十億', '一万'],
    answerIndex: 0,
  },
  {
    id: 'f1-h3', floorId: 1, difficulty: 'hard',
    text: '一兆は一億の何倍？',
    choices: ['一万倍', '千倍', '百倍', '十万倍'],
    answerIndex: 0,
  },
  {
    id: 'f1-h4', floorId: 1, difficulty: 'hard',
    text: '45億 + 55億 = ?',
    choices: ['百億', '一兆', '千億', '九十億'],
    answerIndex: 0,
  },
  {
    id: 'f1-h5', floorId: 1, difficulty: 'hard',
    text: '999999999の次の数は？',
    choices: ['10億', '1億', '100億', '9億9千万'],
    answerIndex: 0,
  },
];
