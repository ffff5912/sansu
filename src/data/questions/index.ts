import type { Question, Difficulty } from '../types.ts';
import { floor1Questions } from './floor1.ts';

const questionsByFloor: Record<number, Question[]> = {
  1: floor1Questions,
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
