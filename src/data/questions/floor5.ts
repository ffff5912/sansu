import type { Question } from '../types.ts';

// Floor 5: がい数のさばく (Rounding / Estimation)
export const floor5Questions: Question[] = [
  // === easy (5問) ===
  {
    id: 'f5-e1', floorId: 5, difficulty: 'easy',
    text: '36を四捨五入して十の位までのがい数にすると？',
    choices: ['40', '30', '36', '35'],
    answerIndex: 0,
  },
  {
    id: 'f5-e2', floorId: 5, difficulty: 'easy',
    text: '74を四捨五入して十の位までのがい数にすると？',
    choices: ['70', '80', '75', '74'],
    answerIndex: 0,
  },
  {
    id: 'f5-e3', floorId: 5, difficulty: 'easy',
    text: '85を四捨五入して十の位までのがい数にすると？',
    choices: ['90', '80', '85', '100'],
    answerIndex: 0,
  },
  {
    id: 'f5-e4', floorId: 5, difficulty: 'easy',
    text: '四捨五入で切り上げるのは何以上？',
    choices: ['5以上', '4以上', '6以上', '3以上'],
    answerIndex: 0,
  },
  {
    id: 'f5-e5', floorId: 5, difficulty: 'easy',
    text: '123を四捨五入して百の位までのがい数にすると？',
    choices: ['100', '120', '130', '200'],
    answerIndex: 0,
  },

  // === normal (5問) ===
  {
    id: 'f5-n1', floorId: 5, difficulty: 'normal',
    text: '3456を四捨五入して千の位までのがい数にすると？',
    choices: ['3000', '4000', '3500', '3400'],
    answerIndex: 0,
  },
  {
    id: 'f5-n2', floorId: 5, difficulty: 'normal',
    text: '7850を四捨五入して千の位までのがい数にすると？',
    choices: ['8000', '7000', '7900', '7800'],
    answerIndex: 0,
  },
  {
    id: 'f5-n3', floorId: 5, difficulty: 'normal',
    text: '以上・以下・未満。5以上に5はふくまれる？',
    choices: ['ふくまれる', 'ふくまれない', '場合による', 'わからない'],
    answerIndex: 0,
  },
  {
    id: 'f5-n4', floorId: 5, difficulty: 'normal',
    text: '四捨五入して百の位までのがい数が500になる数はどれ？',
    choices: ['531', '440', '560', '600'],
    answerIndex: 0,
  },
  {
    id: 'f5-n5', floorId: 5, difficulty: 'normal',
    text: '2950を四捨五入して千の位までのがい数にすると？',
    choices: ['3000', '2000', '2900', '2950'],
    answerIndex: 0,
  },

  // === hard (5問) ===
  {
    id: 'f5-h1', floorId: 5, difficulty: 'hard',
    text: '四捨五入して千の位までのがい数が6000になる整数のはんいは？',
    choices: ['5500以上6499以下', '5000以上6999以下', '5500以上6500以下', '6000以上6499以下'],
    answerIndex: 0,
  },
  {
    id: 'f5-h2', floorId: 5, difficulty: 'hard',
    text: '12345を上から2けたのがい数にすると？',
    choices: ['12000', '13000', '12300', '12400'],
    answerIndex: 0,
  },
  {
    id: 'f5-h3', floorId: 5, difficulty: 'hard',
    text: '298 + 512 の見積もり（百の位のがい数で計算）は？',
    choices: ['800', '700', '900', '810'],
    answerIndex: 0,
  },
  {
    id: 'f5-h4', floorId: 5, difficulty: 'hard',
    text: '5未満の整数は何個？（0をふくむ）',
    choices: ['5個', '4個', '6個', '3個'],
    answerIndex: 0,
  },
  {
    id: 'f5-h5', floorId: 5, difficulty: 'hard',
    text: '67890を上から3けたのがい数にすると？',
    choices: ['67900', '67800', '68000', '67000'],
    answerIndex: 0,
  },
];
