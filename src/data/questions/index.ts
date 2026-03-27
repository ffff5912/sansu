import type { Question, Difficulty } from '../types.ts';
import { floor1Questions } from './floor1.ts';
import { floor2Questions } from './floor2.ts';
import { floor3Questions } from './floor3.ts';
import { floor4Questions } from './floor4.ts';
import { floor5Questions } from './floor5.ts';
import { floor6Questions } from './floor6.ts';
import { floor7Questions } from './floor7.ts';
import { floor8Questions } from './floor8.ts';
import { floor9Questions } from './floor9.ts';
import { floor10Questions } from './floor10.ts';
import { floor11Questions } from './floor11.ts';
import { floor12Questions } from './floor12.ts';
import { floor101Questions } from './floor101.ts';
import { floor102Questions } from './floor102.ts';
import { floor103Questions } from './floor103.ts';
import { floor104Questions } from './floor104.ts';
import { floor105Questions } from './floor105.ts';
import { floor106Questions } from './floor106.ts';
import { floor107Questions } from './floor107.ts';
import { floor108Questions } from './floor108.ts';
import { floor109Questions } from './floor109.ts';
import { floor13Questions } from './floor13.ts';
import { floor14Questions } from './floor14.ts';
import { floor15Questions } from './floor15.ts';

const questionsByFloor: Record<number, Question[]> = {
  1: floor1Questions,
  2: floor2Questions,
  3: floor3Questions,
  4: floor4Questions,
  5: floor5Questions,
  6: floor6Questions,
  7: floor7Questions,
  8: floor8Questions,
  9: floor9Questions,
  10: floor10Questions,
  11: floor11Questions,
  12: floor12Questions,
  101: floor101Questions,
  102: floor102Questions,
  103: floor103Questions,
  104: floor104Questions,
  105: floor105Questions,
  106: floor106Questions,
  107: floor107Questions,
  108: floor108Questions,
  109: floor109Questions,
  13: floor13Questions,
  14: floor14Questions,
  15: floor15Questions,
};

export function getQuestions(floorId: number): Question[] {
  return questionsByFloor[floorId] ?? [];
}

export function getRandomQuestion(
  floorId: number,
  difficulty?: Difficulty,
  excludeIds?: Set<string>,
): Question | null {
  let pool = getQuestions(floorId);
  if (difficulty) {
    pool = pool.filter(q => q.difficulty === difficulty);
  }
  if (excludeIds) {
    pool = pool.filter(q => !excludeIds.has(q.id));
  }
  if (pool.length === 0) {
    // If all excluded, reset and pick from full pool
    pool = getQuestions(floorId);
    if (difficulty) pool = pool.filter(q => q.difficulty === difficulty);
  }
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function pickDifficulty(questionsAnswered: number): Difficulty {
  if (questionsAnswered < 2) return 'easy';
  if (questionsAnswered < 5) return 'normal';
  return 'hard';
}
