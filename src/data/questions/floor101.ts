import type { Question } from '../types.ts';

export const floor101Questions: Question[] = [
  // === easy (5問) — 10までのかず ===
  {
    id: 'f101-e1', floorId: 101, difficulty: 'easy',
    text: 'りんごが 3こ あります。いくつ？',
    choices: ['3', '2', '4', '5'],
    answerIndex: 0,
  },
  {
    id: 'f101-e2', floorId: 101, difficulty: 'easy',
    text: '5の つぎの かずは？',
    choices: ['6', '4', '7', '5'],
    answerIndex: 0,
  },
  {
    id: 'f101-e3', floorId: 101, difficulty: 'easy',
    text: '「なな」を すうじで かくと？',
    choices: ['7', '8', '6', '9'],
    answerIndex: 0,
  },
  {
    id: 'f101-e4', floorId: 101, difficulty: 'easy',
    text: '4の まえの かずは？',
    choices: ['3', '5', '2', '4'],
    answerIndex: 0,
  },
  {
    id: 'f101-e5', floorId: 101, difficulty: 'easy',
    text: 'いちばん おおきい かずは？',
    choices: ['9', '6', '8', '7'],
    answerIndex: 0,
  },

  // === normal (5問) ===
  {
    id: 'f101-n1', floorId: 101, difficulty: 'normal',
    text: '3と 5では どちらが おおきい？',
    choices: ['5', '3', 'おなじ', 'わからない'],
    answerIndex: 0,
  },
  {
    id: 'f101-n2', floorId: 101, difficulty: 'normal',
    text: '1, 2, □, 4 の □に はいる かずは？',
    choices: ['3', '5', '2', '0'],
    answerIndex: 0,
  },
  {
    id: 'f101-n3', floorId: 101, difficulty: 'normal',
    text: '8は いくつと いくつ？ 8は 5と□',
    choices: ['3', '2', '4', '5'],
    answerIndex: 0,
  },
  {
    id: 'f101-n4', floorId: 101, difficulty: 'normal',
    text: '6の つぎの つぎの かずは？',
    choices: ['8', '7', '9', '5'],
    answerIndex: 0,
  },
  {
    id: 'f101-n5', floorId: 101, difficulty: 'normal',
    text: '10は いくつと いくつ？ 10は 7と□',
    choices: ['3', '2', '4', '7'],
    answerIndex: 0,
  },

  // === hard (5問) ===
  {
    id: 'f101-h1', floorId: 101, difficulty: 'hard',
    text: 'おおきい じゅんに ならべると？ 3, 7, 1',
    choices: ['7, 3, 1', '1, 3, 7', '3, 7, 1', '7, 1, 3'],
    answerIndex: 0,
  },
  {
    id: 'f101-h2', floorId: 101, difficulty: 'hard',
    text: '10は いくつと いくつ？ 10は 4と□',
    choices: ['6', '5', '7', '4'],
    answerIndex: 0,
  },
  {
    id: 'f101-h3', floorId: 101, difficulty: 'hard',
    text: '0, 2, 4, □ の □に はいるかずは？',
    choices: ['6', '5', '8', '3'],
    answerIndex: 0,
  },
  {
    id: 'f101-h4', floorId: 101, difficulty: 'hard',
    text: '9は 1と いくつ？',
    choices: ['8', '7', '9', '10'],
    answerIndex: 0,
  },
  {
    id: 'f101-h5', floorId: 101, difficulty: 'hard',
    text: '10, 9, 8, □ の □に はいるかずは？',
    choices: ['7', '6', '11', '5'],
    answerIndex: 0,
  },
];
