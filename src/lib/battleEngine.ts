import type { PlayerState, Monster } from '../data/types.ts';

export function calculateDamage(
  answerCorrect: boolean,
  timeSeconds: number,
  playerAttack: number,
): number {
  if (!answerCorrect) return 0;
  let base: number;
  if (timeSeconds <= 5) base = 40;
  else if (timeSeconds <= 10) base = 25;
  else base = 15;
  // Scale with player attack (base 10)
  return Math.round(base * (playerAttack / 10));
}

export function calculateMonsterDamage(
  answerCorrect: boolean,
  monster: Monster,
): number {
  if (answerCorrect) return 0;
  return monster.attack;
}

export function calculateExpToNext(level: number): number {
  return 30 + (level - 1) * 15;
}

export interface LevelUpResult {
  leveled: boolean;
  newPlayer: PlayerState;
}

export function applyExp(player: PlayerState, expGain: number): LevelUpResult {
  let p = { ...player };
  p.exp += expGain;
  let leveled = false;

  while (p.exp >= p.expToNext) {
    p.exp -= p.expToNext;
    p.level += 1;
    p.maxHp += 10;
    p.hp = p.maxHp; // Full heal on level up
    p.attack += 3;
    p.expToNext = calculateExpToNext(p.level);
    leveled = true;
  }

  return { leveled, newPlayer: p };
}

export function applyDamageToPlayer(
  player: PlayerState,
  damage: number,
): PlayerState {
  return {
    ...player,
    hp: Math.max(0, player.hp - damage),
  };
}
