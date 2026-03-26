import type { PlayerState, Monster, GameDifficulty, EquipmentSlots } from '../data/types.ts';
import { getEquipment } from '../data/crafting.ts';

/** Calculate total equipment bonuses */
export function getEquipmentBonuses(equip: EquipmentSlots): { atk: number; def: number; expPct: number } {
  let atk = 0, def = 0, expPct = 0;
  for (const slotId of [equip.weapon, equip.armor, equip.accessory]) {
    if (!slotId) continue;
    const e = getEquipment(slotId);
    if (e) { atk += e.atkBonus; def += e.defBonus; expPct += e.expBonus; }
  }
  return { atk, def, expPct };
}


/** Apply difficulty scaling to a monster */
export function scaleMonster(monster: Monster, difficulty: GameDifficulty): Monster {
  if (difficulty === 'normal') return monster;
  // Hard: HP x1.5, ATK x1.5, EXP x1.5
  return {
    ...monster,
    hp: Math.round(monster.hp * 1.5),
    attack: Math.round(monster.attack * 1.5),
    exp: Math.round(monster.exp * 1.5),
  };
}

/** Timer seconds per difficulty */
export function getTimerSeconds(difficulty: GameDifficulty): number {
  return difficulty === 'hard' ? 10 : 15;
}

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

export function calculateGoldReward(monster: Monster): number {
  // Monster stats are already scaled by difficulty via scaleMonster()
  const base = monster.isBoss ? monster.exp * 2 : monster.exp;
  // Add small random variation ±20%
  const variation = 0.8 + Math.random() * 0.4;
  return Math.round(base * variation);
}

export interface LevelUpResult {
  leveled: boolean;
  newPlayer: PlayerState;
}

export function applyExp(player: PlayerState, expGain: number): LevelUpResult {
  const p = { ...player };
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
