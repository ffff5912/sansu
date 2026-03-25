import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { BattleState, PlayerState } from '../data/types.ts';
import HpBar from './HpBar.tsx';
import MonsterSprite from './MonsterSprite.tsx';
import DamageNumber from './DamageNumber.tsx';
import QuestionPanel from './QuestionPanel.tsx';

interface BattleOverlayProps {
  battle: BattleState;
  player: PlayerState;
  timeLeft: number;
  onAnswer: (index: number) => void;
  onVictory: () => void;
  onDefeat: () => void;
  leveledUp: boolean;
  goldEarned: number;
}

export default function BattleOverlay({
  battle,
  player,
  timeLeft,
  onAnswer,
  onVictory,
  onDefeat,
  leveledUp,
  goldEarned,
}: BattleOverlayProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [prevQuestionId, setPrevQuestionId] = useState<string | null>(null);
  const [prevPhase, setPrevPhase] = useState(battle.phase);

  // Derive monster animation phase from battle state
  const monsterPhase = useMemo((): 'appear' | 'idle' | 'hit' | 'defeat' => {
    if (battle.phase === 'intro') return 'appear';
    if (battle.phase === 'victory') return 'defeat';
    if (battle.phase === 'result' && battle.lastDamage > 0) return 'hit';
    return 'idle';
  }, [battle.phase, battle.lastDamage]);

  const showDamage = battle.phase === 'result';

  // Reset selection when new question arrives
  const questionId = battle.currentQuestion?.id ?? null;
  if (questionId !== prevQuestionId) {
    setPrevQuestionId(questionId);
    if (battle.phase === 'question') {
      setSelectedIndex(null);
    }
  }

  // Reset selection on phase transition to question
  if (battle.phase !== prevPhase) {
    setPrevPhase(battle.phase);
    if (battle.phase === 'question') {
      setSelectedIndex(null);
    }
  }

  const handleAnswer = useCallback((index: number) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(index);
    onAnswer(index === -1 ? -1 : index);
  }, [selectedIndex, onAnswer]);

  // Auto-submit on timeout
  const timeoutFiredRef = useRef(false);
  useEffect(() => {
    // Reset timeout flag when a new question starts
    timeoutFiredRef.current = false;
  }, [questionId]);
  useEffect(() => {
    if (battle.phase === 'question' && timeLeft <= 0 && selectedIndex === null && !timeoutFiredRef.current) {
      timeoutFiredRef.current = true;
      onAnswer(-1);
    }
  }, [timeLeft, battle.phase, selectedIndex, onAnswer]);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(240, 244, 255, 0.97)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      animation: 'fadeIn 0.3s ease',
      overflow: 'auto',
    }}>
      {/* Monster area */}
      <div style={{
        flex: '0 0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 16px 8px',
        position: 'relative',
        background: 'linear-gradient(180deg, #e8f0ff, transparent)',
      }}>
        <MonsterSprite
          emoji={battle.monster.emoji}
          name={battle.monster.name}
          phase={monsterPhase}
        />
        <div style={{ width: '60%', marginTop: 8 }}>
          <HpBar
            current={battle.monsterHp}
            max={battle.monster.hp}
            label={battle.monster.isBoss ? 'BOSS' : 'HP'}
          />
        </div>

        {/* Damage numbers */}
        {showDamage && battle.lastDamage > 0 && (
          <DamageNumber value={battle.lastDamage} />
        )}
        {showDamage && battle.lastMonsterDamage > 0 && (
          <DamageNumber value={battle.lastMonsterDamage} isPlayerDamage />
        )}
      </div>

      {/* Player HP */}
      <div style={{ padding: '4px 16px' }}>
        <HpBar
          current={player.hp}
          max={player.maxHp}
          label={`Lv.${player.level} HP`}
          height={14}
        />
      </div>

      {/* Question or result */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {battle.phase === 'intro' && (
          <div style={{
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--color-text)',
            animation: 'bounceIn 0.6s ease',
          }}>
            {battle.monster.name} があらわれた！
          </div>
        )}

        {battle.phase === 'question' && battle.currentQuestion && (
          <QuestionPanel
            question={battle.currentQuestion}
            timeLeft={timeLeft}
            onAnswer={handleAnswer}
            disabled={selectedIndex !== null}
            selectedIndex={selectedIndex}
          />
        )}

        {battle.phase === 'result' && (
          <div style={{
            textAlign: 'center',
            padding: 20,
            animation: 'fadeIn 0.3s ease',
          }}>
            {battle.lastDamage > 0 ? (
              <div style={{ color: 'var(--color-success)', fontSize: 18, fontWeight: 700 }}>
                せいかい！ {battle.lastDamage} ダメージ！
              </div>
            ) : (
              <div style={{ color: 'var(--color-danger)', fontSize: 18, fontWeight: 700 }}>
                はずれ… {battle.lastMonsterDamage} ダメージをうけた！
              </div>
            )}
          </div>
        )}

        {battle.phase === 'victory' && (
          <div style={{
            textAlign: 'center',
            padding: 20,
            animation: 'bounceIn 0.6s ease',
          }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--color-text-accent)', marginBottom: 8 }}>
              しょうり！
            </div>
            <div style={{ fontSize: 14, color: 'var(--color-text-dim)', marginBottom: 4 }}>
              EXP +{battle.monster.exp}
            </div>
            {goldEarned > 0 && (
              <div style={{ fontSize: 14, color: '#f6a800', fontWeight: 700, marginBottom: 4 }}>
                💰 +{goldEarned}G
              </div>
            )}
            {leveledUp && (
              <div style={{
                fontSize: 18,
                fontWeight: 700,
                color: 'var(--color-primary)',
                animation: 'levelUp 0.6s ease',
                marginTop: 8,
              }}>
                レベルアップ！
              </div>
            )}
            <button
              onClick={onVictory}
              style={{
                marginTop: 16,
                padding: '10px 32px',
                borderRadius: 'var(--radius)',
                background: 'var(--color-primary)',
                color: '#fff',
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              つづける
            </button>
          </div>
        )}

        {battle.phase === 'defeat' && (
          <div style={{
            textAlign: 'center',
            padding: 20,
            animation: 'fadeIn 0.5s ease',
          }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--color-danger)', marginBottom: 12 }}>
              やられてしまった…
            </div>
            <button
              onClick={onDefeat}
              style={{
                padding: '10px 32px',
                borderRadius: 'var(--radius)',
                background: 'var(--color-danger)',
                color: '#fff',
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              もどる
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
