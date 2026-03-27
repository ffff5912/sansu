import { useState, useCallback } from 'react';
import type { Grade } from '../data/types.ts';
import { getFloorsByGrade } from '../data/floors.ts';
import { getRandomQuestion } from '../data/questions/index.ts';
import QuestionPanel from '../components/QuestionPanel.tsx';
import Layout from '../components/Layout.tsx';

interface PracticePageProps {
  grade: Grade;
  onBack: () => void;
}

export default function PracticePage({ grade, onBack }: PracticePageProps) {
  const floors = getFloorsByGrade(grade);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [currentQ, setCurrentQ] = useState<ReturnType<typeof getRandomQuestion>>(null);
  const [answered, setAnswered] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const askedIds = useState(() => new Set<string>())[0];

  const nextQuestion = useCallback((floorId: number) => {
    const q = getRandomQuestion(floorId, undefined, askedIds);
    if (q) askedIds.add(q.id);
    setCurrentQ(q);
    setAnswered(false);
    setLastCorrect(null);
  }, [askedIds]);

  const startPractice = (floorId: number) => {
    setSelectedFloor(floorId);
    setStats({ correct: 0, total: 0 });
    askedIds.clear();
    nextQuestion(floorId);
  };

  const handleAnswer = (choiceIndex: number) => {
    if (!currentQ || answered) return;
    setAnswered(true);
    const correct = choiceIndex === currentQ.answerIndex;
    setLastCorrect(correct);
    setStats(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
  };

  const handleNext = () => {
    if (selectedFloor !== null) nextQuestion(selectedFloor);
  };

  // Floor selection view
  if (selectedFloor === null) {
    return (
      <Layout title="れんしゅうモード" onBack={onBack}>
        <div style={{
          height: '100%', overflowY: 'auto', padding: '12px 16px',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{ fontSize: 13, color: 'var(--color-text-dim)', textAlign: 'center', padding: 8 }}>
            れんしゅうしたい テーマを えらぼう！
          </div>
          {floors.map(f => (
            <button key={f.id} onClick={() => startPractice(f.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12, width: '100%',
              padding: '12px 16px', borderRadius: 'var(--radius-lg)',
              background: 'var(--color-surface)', border: '2px solid var(--color-bg-lighter)',
              textAlign: 'left', boxShadow: 'var(--shadow)',
            }}>
              <span style={{ fontSize: 28 }}>{f.emoji}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{f.name}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>{f.subtitle}</div>
              </div>
            </button>
          ))}
        </div>
      </Layout>
    );
  }

  // Practice view
  const floor = floors.find(f => f.id === selectedFloor);
  return (
    <Layout title={`れんしゅう: ${floor?.name ?? ''}`} onBack={() => setSelectedFloor(null)}>
      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: 16,
      }}>
        {/* Stats bar */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 16,
          fontSize: 14, fontWeight: 700, marginBottom: 12,
        }}>
          <span style={{ color: 'var(--color-success)' }}>⭕ {stats.correct}</span>
          <span style={{ color: 'var(--color-danger)' }}>❌ {stats.total - stats.correct}</span>
          <span style={{ color: 'var(--color-text-dim)' }}>
            {stats.total > 0 ? `${Math.round(stats.correct / stats.total * 100)}%` : '—'}
          </span>
        </div>

        {currentQ ? (
          <>
            <QuestionPanel
              question={currentQ}
              timeLeft={0}
              onAnswer={handleAnswer}
              disabled={answered}
              selectedIndex={answered ? currentQ.answerIndex : null}
            />
            {answered && (
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <div style={{
                  fontSize: 20, fontWeight: 700, marginBottom: 12,
                  color: lastCorrect ? 'var(--color-success)' : 'var(--color-danger)',
                }}>
                  {lastCorrect ? 'せいかい！ 🎉' : 'ざんねん… 😢'}
                </div>
                <button onClick={handleNext} style={{
                  padding: '10px 32px', borderRadius: 'var(--radius)',
                  background: 'var(--color-primary)', color: '#fff',
                  fontSize: 16, fontWeight: 700,
                }}>
                  つぎのもんだい
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', fontSize: 16, color: 'var(--color-text-dim)' }}>
            もんだいが ありません
          </div>
        )}
      </div>
    </Layout>
  );
}
