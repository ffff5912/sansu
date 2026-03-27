import { useState, useRef } from 'react';
import type { Grade, ColosseumRank, ColosseumResult } from '../data/types.ts';
import { getFloorsByGrade } from '../data/floors.ts';
import { getRandomQuestion } from '../data/questions/index.ts';
import QuestionPanel from '../components/QuestionPanel.tsx';
import Layout from '../components/Layout.tsx';

interface ColosseumPageProps {
  grade: Grade;
  highScore: number;
  bestRank: ColosseumRank;
  playerGold: number;
  onFinish: (result: ColosseumResult, goldEarned: number) => void;
  onBack: () => void;
}

const TOTAL_ROUNDS = 10;

const RANK_INFO: { rank: ColosseumRank; minScore: number; label: string; emoji: string; color: string }[] = [
  { rank: 'diamond', minScore: 9000, label: 'ダイヤ', emoji: '💎', color: '#B9F2FF' },
  { rank: 'platinum', minScore: 7000, label: 'プラチナ', emoji: '🏆', color: '#E5E4E2' },
  { rank: 'gold', minScore: 5000, label: 'ゴールド', emoji: '🥇', color: '#FFD700' },
  { rank: 'silver', minScore: 3000, label: 'シルバー', emoji: '🥈', color: '#C0C0C0' },
  { rank: 'bronze', minScore: 1000, label: 'ブロンズ', emoji: '🥉', color: '#CD7F32' },
  { rank: 'none', minScore: 0, label: '—', emoji: '', color: '#999' },
];

function calcRank(score: number): ColosseumRank {
  for (const r of RANK_INFO) {
    if (score >= r.minScore) return r.rank;
  }
  return 'none';
}

function getRankInfo(rank: ColosseumRank) {
  return RANK_INFO.find(r => r.rank === rank) ?? RANK_INFO[RANK_INFO.length - 1];
}

function calcGoldReward(score: number): number {
  return Math.round(score / 50);
}

type Phase = 'lobby' | 'battle' | 'result-show' | 'finished';

export default function ColosseumPage({ grade, highScore, bestRank, onFinish, onBack }: ColosseumPageProps) {
  const floors = getFloorsByGrade(grade);
  const allFloorIds = floors.map(f => f.id);

  const [phase, setPhase] = useState<Phase>('lobby');
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [currentQ, setCurrentQ] = useState<ReturnType<typeof getRandomQuestion>>(null);
  const [answered, setAnswered] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [lastPoints, setLastPoints] = useState(0);
  const askedIds = useRef(new Set<string>());

  const getDifficulty = (r: number): 'easy' | 'normal' | 'hard' => {
    if (r < 3) return 'easy';
    if (r < 7) return 'normal';
    return 'hard';
  };

  const startBattle = () => {
    askedIds.current.clear();
    setPhase('battle');
    setRound(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrect(0);
    // Trigger first question
    const floorId = allFloorIds[Math.floor(Math.random() * allFloorIds.length)];
    const q = getRandomQuestion(floorId, 'easy', askedIds.current);
    if (q) askedIds.current.add(q.id);
    setCurrentQ(q);
    setAnswered(false);
    setLastCorrect(null);
    setLastPoints(0);
  };

  const handleAnswer = (choiceIndex: number) => {
    if (!currentQ || answered) return;
    setAnswered(true);
    const isCorrect = choiceIndex === currentQ.answerIndex;
    setLastCorrect(isCorrect);

    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo(m => Math.max(m, newCombo));
      setCorrect(c => c + 1);
      // Score: base 500 + combo bonus (100 per combo, capped at 500)
      const comboBonus = Math.min(newCombo * 100, 500);
      // Difficulty multiplier
      const diffMult = getDifficulty(round) === 'hard' ? 2 : getDifficulty(round) === 'normal' ? 1.5 : 1;
      const points = Math.round((500 + comboBonus) * diffMult);
      setScore(s => s + points);
      setLastPoints(points);
    } else {
      setCombo(0);
      setLastPoints(0);
    }

    setPhase('result-show');
  };

  const handleNext = () => {
    const nextRound = round + 1;
    if (nextRound >= TOTAL_ROUNDS) {
      // Finished
      const finalScore = score;
      const rank = calcRank(finalScore);
      const gold = calcGoldReward(finalScore);
      setPhase('finished');
      onFinish({ score: finalScore, combo: maxCombo, maxCombo, correct, total: TOTAL_ROUNDS, rank }, gold);
      return;
    }
    setRound(nextRound);
    setPhase('battle');
    // Next question
    const floorId = allFloorIds[Math.floor(Math.random() * allFloorIds.length)];
    const diff = getDifficulty(nextRound);
    const q = getRandomQuestion(floorId, diff, askedIds.current);
    if (q) askedIds.current.add(q.id);
    setCurrentQ(q);
    setAnswered(false);
    setLastCorrect(null);
    setLastPoints(0);
  };

  const bestRankInfo = getRankInfo(bestRank);

  // === LOBBY ===
  if (phase === 'lobby') {
    return (
      <Layout title="⚔️ さんすうコロシアム" onBack={onBack}>
        <div style={{
          height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24,
        }}>
          <div style={{ fontSize: 48 }}>🏟️</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--color-text)' }}>
            さんすうコロシアム
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text-dim)', textAlign: 'center', lineHeight: 1.6 }}>
            10もん れんぞく チャレンジ！<br />
            れんぞく せいかいで コンボボーナス！<br />
            もんだいが すすむと むずかしくなるぞ！
          </div>

          {/* Records */}
          <div style={{
            background: 'var(--color-surface)', borderRadius: 'var(--radius)',
            padding: '12px 24px', textAlign: 'center', boxShadow: 'var(--shadow)',
          }}>
            <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>ハイスコア</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--color-text-accent)' }}>
              {highScore.toLocaleString()}
            </div>
            {bestRank !== 'none' && (
              <div style={{ fontSize: 14, fontWeight: 700, color: bestRankInfo.color, marginTop: 4 }}>
                {bestRankInfo.emoji} {bestRankInfo.label}ランク
              </div>
            )}
          </div>

          {/* Rank table */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
            {RANK_INFO.filter(r => r.rank !== 'none').map(r => (
              <div key={r.rank} style={{
                padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700,
                background: 'var(--color-bg-light)', color: r.color,
              }}>
                {r.emoji} {r.minScore}+
              </div>
            ))}
          </div>

          <button onClick={startBattle} style={{
            padding: '14px 48px', borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, #E74C3C, #C0392B)',
            color: '#fff', fontSize: 18, fontWeight: 900,
            boxShadow: '0 4px 12px rgba(231,76,60,0.4)',
          }}>
            チャレンジ！
          </button>
        </div>
      </Layout>
    );
  }

  // === BATTLE / RESULT-SHOW ===
  if (phase === 'battle' || phase === 'result-show') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', height: '100%',
        background: 'linear-gradient(180deg, #1a1a2e, #16213e)',
      }}>
        {/* Header bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 16px', background: 'rgba(0,0,0,0.3)',
        }}>
          <div style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>
            ⚔️ {round + 1}/{TOTAL_ROUNDS}
          </div>
          <div style={{ color: '#FFD700', fontSize: 16, fontWeight: 900 }}>
            {score.toLocaleString()} pts
          </div>
          {combo > 0 && (
            <div style={{
              color: '#FF6B6B', fontSize: 14, fontWeight: 900,
              animation: 'pulse 0.5s ease infinite',
            }}>
              🔥 {combo} COMBO
            </div>
          )}
        </div>

        {/* Difficulty indicator */}
        <div style={{
          textAlign: 'center', padding: '4px', fontSize: 11, fontWeight: 700,
          color: getDifficulty(round) === 'hard' ? '#FF6B6B' : getDifficulty(round) === 'normal' ? '#FFD700' : '#69F0AE',
        }}>
          {getDifficulty(round) === 'hard' ? '★★★ むずかしい' : getDifficulty(round) === 'normal' ? '★★ ふつう' : '★ かんたん'}
        </div>

        {/* Question */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          {currentQ && (
            <div style={{
              background: 'rgba(255,255,255,0.95)', borderRadius: 16,
              margin: '0 12px', padding: '16px 0',
            }}>
              <QuestionPanel
                question={currentQ}
                timeLeft={0}
                onAnswer={handleAnswer}
                disabled={answered}
                selectedIndex={answered ? currentQ.answerIndex : null}
              />
            </div>
          )}

          {phase === 'result-show' && (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              {lastCorrect ? (
                <div>
                  <div style={{ color: '#69F0AE', fontSize: 22, fontWeight: 900 }}>
                    せいかい！ ✨
                  </div>
                  <div style={{ color: '#FFD700', fontSize: 16, fontWeight: 700, marginTop: 4 }}>
                    +{lastPoints.toLocaleString()} pts
                  </div>
                </div>
              ) : (
                <div style={{ color: '#FF6B6B', fontSize: 22, fontWeight: 900 }}>
                  ざんねん… 💔
                </div>
              )}
              <button onClick={handleNext} style={{
                marginTop: 16, padding: '10px 32px', borderRadius: 'var(--radius)',
                background: 'var(--color-primary)', color: '#fff',
                fontSize: 16, fontWeight: 700,
              }}>
                {round + 1 >= TOTAL_ROUNDS ? 'けっかを みる' : 'つぎへ'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // === FINISHED ===
  const finalRank = calcRank(score);
  const finalRankInfo = getRankInfo(finalRank);
  const goldReward = calcGoldReward(score);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100%', gap: 16, padding: 24,
      background: 'linear-gradient(180deg, #1a1a2e, #16213e)',
      animation: 'fadeIn 0.5s ease',
    }}>
      <div style={{ fontSize: 48 }}>{finalRankInfo.emoji || '🏟️'}</div>
      <div style={{ fontSize: 24, fontWeight: 900, color: finalRankInfo.color }}>
        {finalRank !== 'none' ? `${finalRankInfo.label}ランク！` : 'チャレンジ おわり！'}
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius)',
        padding: '16px 32px', textAlign: 'center',
      }}>
        <div style={{ color: '#FFD700', fontSize: 28, fontWeight: 900 }}>
          {score.toLocaleString()} pts
        </div>
        <div style={{ color: '#fff', fontSize: 13, marginTop: 8 }}>
          せいかい {correct}/{TOTAL_ROUNDS} | さいだいコンボ {maxCombo}
        </div>
        <div style={{ color: '#FFD700', fontSize: 14, fontWeight: 700, marginTop: 8 }}>
          💰 +{goldReward}G
        </div>
        {score > highScore && (
          <div style={{
            color: '#FF6B6B', fontSize: 16, fontWeight: 900, marginTop: 8,
            animation: 'pulse 1s ease infinite',
          }}>
            🎉 ハイスコア こうしん！
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button onClick={startBattle} style={{
          padding: '12px 28px', borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, #E74C3C, #C0392B)',
          color: '#fff', fontSize: 16, fontWeight: 700,
        }}>
          もういちど
        </button>
        <button onClick={onBack} style={{
          padding: '12px 28px', borderRadius: 'var(--radius-lg)',
          background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.3)',
          color: '#fff', fontSize: 16, fontWeight: 700,
        }}>
          村にもどる
        </button>
      </div>
    </div>
  );
}
