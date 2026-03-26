import { useState, useCallback, useRef, useEffect } from 'react';
import type { BattleState, Monster, PlayerState, GameDifficulty, MaterialBag, EquipmentSlots, DungeonBuff } from '../data/types.ts';
import { rollDrops } from '../data/crafting.ts';
import { getRandomQuestion, pickDifficulty } from '../data/questions/index.ts';
import {
  calculateDamage, calculateMonsterDamage, calculateGoldReward,
  applyExp, applyDamageToPlayer, scaleMonster, getTimerSeconds, getEquipmentBonuses,
} from '../lib/battleEngine.ts';
import { useTimer } from './useTimer.ts';

interface UseBattleReturn {
  battle: BattleState | null;
  timer: ReturnType<typeof useTimer>;
  startBattle: (monster: Monster) => void;
  submitAnswer: (choiceIndex: number) => void;
  endBattle: () => void;
  playerUpdate: PlayerState | null;
  leveledUp: boolean;
  goldEarned: number;
  droppedMaterials: MaterialBag;
}

export function useBattle(
  floorId: number,
  player: PlayerState,
  gameDifficulty: GameDifficulty = 'normal',
  equipment: EquipmentSlots = { weapon: null, armor: null, accessory: null },
  dungeonBuff: DungeonBuff = 'none',
): UseBattleReturn {
  const equipBonus = getEquipmentBonuses(equipment);
  // Apply dungeon buff bonuses
  const buffAtkMult = dungeonBuff === 'atk' ? 1.15 : 1;
  const buffTimerExtra = dungeonBuff === 'timer' ? 3 : 0;
  const timerSecs = getTimerSeconds(gameDifficulty) + buffTimerExtra;
  const [battle, setBattle] = useState<BattleState | null>(null);
  const [playerUpdate, setPlayerUpdate] = useState<PlayerState | null>(null);
  const [leveledUp, setLeveledUp] = useState(false);
  const [goldEarned, setGoldEarned] = useState(0);
  const [droppedMaterials, setDroppedMaterials] = useState<MaterialBag>({});
  const timer = useTimer(timerSecs);
  const askedRef = useRef<Set<string>>(new Set());

  const nextQuestionRef = useRef<() => void>(() => {});

  const advanceToNextQuestion = useCallback(() => {
    setBattle(b => {
      if (!b) return b;
      const diff = pickDifficulty(b.questionsAnswered);
      const q = getRandomQuestion(floorId, diff, askedRef.current);
      if (q) askedRef.current.add(q.id);
      timer.reset(timerSecs);
      timer.start();
      return { ...b, phase: 'question', currentQuestion: q };
    });
  }, [floorId, timer, timerSecs]);

  // Keep ref in sync via effect to satisfy lint (no ref writes during render)
  useEffect(() => {
    nextQuestionRef.current = advanceToNextQuestion;
  }, [advanceToNextQuestion]);

  const startBattle = useCallback((monster: Monster) => {
    const scaled = scaleMonster(monster, gameDifficulty);
    askedRef.current = new Set();
    setPlayerUpdate(null);
    setLeveledUp(false);
    setGoldEarned(0);
    setDroppedMaterials({});
    setBattle({
      phase: 'intro',
      monster: scaled,
      monsterHp: scaled.hp,
      currentQuestion: null,
      answerTime: 0,
      lastDamage: 0,
      lastMonsterDamage: 0,
      questionsAnswered: 0,
      correctCount: 0,
    });
    // After short intro, go to first question
    setTimeout(() => {
      const diff = pickDifficulty(0);
      const q = getRandomQuestion(floorId, diff, askedRef.current);
      if (q) askedRef.current.add(q.id);
      setBattle(b => b ? { ...b, phase: 'question', currentQuestion: q } : b);
      timer.reset(timerSecs);
      timer.start();
    }, 800);
  }, [floorId, timer, gameDifficulty, timerSecs]);

  const submitAnswer = useCallback((choiceIndex: number) => {
    if (!battle || battle.phase !== 'question' || !battle.currentQuestion) return;

    const elapsed = timer.stop();
    const correct = choiceIndex === battle.currentQuestion.answerIndex;
    // Apply equipment bonuses to damage
    const effectiveAtk = Math.round((player.attack + equipBonus.atk) * buffAtkMult);
    const dmg = calculateDamage(correct, elapsed, effectiveAtk);
    const rawMonsterDmg = calculateMonsterDamage(correct, battle.monster);
    const monsterDmg = Math.max(0, rawMonsterDmg - equipBonus.def);
    const newMonsterHp = Math.max(0, battle.monsterHp - dmg);

    // Apply monster damage to player (reduced by armor)
    const newPlayer = applyDamageToPlayer(player, monsterDmg);

    setBattle(b => b ? {
      ...b,
      phase: 'result',
      answerTime: elapsed,
      lastDamage: dmg,
      lastMonsterDamage: monsterDmg,
      monsterHp: newMonsterHp,
      questionsAnswered: b.questionsAnswered + 1,
      correctCount: correct ? b.correctCount + 1 : b.correctCount,
    } : b);

    setPlayerUpdate(newPlayer);

    // Check outcomes after showing result
    setTimeout(() => {
      if (newMonsterHp <= 0) {
        // Victory - give exp and gold
        const gold = calculateGoldReward(battle.monster);
        // Apply EXP bonus from equipment
        const expGain = Math.round(battle.monster.exp * (1 + equipBonus.expPct / 100));
        const expResult = applyExp(newPlayer, expGain);
        const playerWithGold = { ...expResult.newPlayer, gold: expResult.newPlayer.gold + gold };
        setPlayerUpdate(playerWithGold);
        setLeveledUp(expResult.leveled);
        setGoldEarned(gold);
        // Roll material drops
        const drops = rollDrops(floorId, battle.monster.isBoss);
        const matBag: MaterialBag = {};
        for (const d of drops) {
          matBag[d.materialId] = (matBag[d.materialId] ?? 0) + d.count;
        }
        setDroppedMaterials(matBag);
        setBattle(b => b ? { ...b, phase: 'victory' } : b);
      } else if (newPlayer.hp <= 0) {
        // Defeat
        setBattle(b => b ? { ...b, phase: 'defeat' } : b);
      } else {
        // Continue with next question via ref (avoids circular dep)
        nextQuestionRef.current();
      }
    }, 1200);
  }, [battle, timer, player, floorId, equipBonus.atk, equipBonus.def, equipBonus.expPct, buffAtkMult]);

  const endBattle = useCallback(() => {
    setBattle(null);
    timer.reset();
  }, [timer]);

  return {
    battle,
    timer,
    startBattle,
    submitAnswer,
    endBattle,
    playerUpdate,
    leveledUp,
    goldEarned,
    droppedMaterials,
  };
}
