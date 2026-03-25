import { useState, useCallback, useRef } from 'react';
import type { BattleState, Monster, PlayerState, Question } from '../data/types.ts';
import { getRandomQuestion, pickDifficulty } from '../data/questions/index.ts';
import { calculateDamage, calculateMonsterDamage, calculateGoldReward, applyExp, applyDamageToPlayer } from '../lib/battleEngine.ts';
import { useTimer } from './useTimer.ts';

interface UseBattleReturn {
  battle: BattleState | null;
  timer: ReturnType<typeof useTimer>;
  startBattle: (monster: Monster) => void;
  submitAnswer: (choiceIndex: number) => void;
  nextTurn: () => void;
  endBattle: () => void;
  playerUpdate: PlayerState | null;
  leveledUp: boolean;
  goldEarned: number;
}

export function useBattle(
  floorId: number,
  player: PlayerState,
): UseBattleReturn {
  const [battle, setBattle] = useState<BattleState | null>(null);
  const [playerUpdate, setPlayerUpdate] = useState<PlayerState | null>(null);
  const [leveledUp, setLeveledUp] = useState(false);
  const [goldEarned, setGoldEarned] = useState(0);
  const timer = useTimer(15);
  const askedRef = useRef<Set<string>>(new Set());

  const startBattle = useCallback((monster: Monster) => {
    askedRef.current = new Set();
    setPlayerUpdate(null);
    setLeveledUp(false);
    setGoldEarned(0);
    setBattle({
      phase: 'intro',
      monster,
      monsterHp: monster.hp,
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
      timer.reset(15);
      timer.start();
    }, 800);
  }, [floorId, timer]);

  const submitAnswer = useCallback((choiceIndex: number) => {
    if (!battle || battle.phase !== 'question' || !battle.currentQuestion) return;

    const elapsed = timer.stop();
    const correct = choiceIndex === battle.currentQuestion.answerIndex;
    const dmg = calculateDamage(correct, elapsed, player.attack);
    const monsterDmg = calculateMonsterDamage(correct, battle.monster);
    const newMonsterHp = Math.max(0, battle.monsterHp - dmg);

    // Apply monster damage to player
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
        const expResult = applyExp(newPlayer, battle.monster.exp);
        const playerWithGold = { ...expResult.newPlayer, gold: expResult.newPlayer.gold + gold };
        setPlayerUpdate(playerWithGold);
        setLeveledUp(expResult.leveled);
        setGoldEarned(gold);
        setBattle(b => b ? { ...b, phase: 'victory' } : b);
      } else if (newPlayer.hp <= 0) {
        // Defeat
        setBattle(b => b ? { ...b, phase: 'defeat' } : b);
      } else {
        // Continue with next question
        nextQuestion(b => b);
      }
    }, 1200);
  }, [battle, timer, player]);

  const nextQuestion = useCallback((
    _updater?: (b: BattleState | null) => BattleState | null
  ) => {
    setBattle(b => {
      if (!b) return b;
      const diff = pickDifficulty(b.questionsAnswered);
      const q = getRandomQuestion(floorId, diff, askedRef.current);
      if (q) askedRef.current.add(q.id);
      timer.reset(15);
      timer.start();
      return { ...b, phase: 'question', currentQuestion: q };
    });
  }, [floorId, timer]);

  const nextTurn = useCallback(() => {
    nextQuestion();
  }, [nextQuestion]);

  const endBattle = useCallback(() => {
    setBattle(null);
    timer.reset();
  }, [timer]);

  return {
    battle,
    timer,
    startBattle,
    submitAnswer,
    nextTurn,
    endBattle,
    playerUpdate,
    leveledUp,
    goldEarned,
  };
}
