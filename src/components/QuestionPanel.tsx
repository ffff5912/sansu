import { useMemo } from 'react';
import type { Question } from '../data/types.ts';
import ClockFace from './ClockFace.tsx';

interface QuestionPanelProps {
  question: Question;
  timeLeft: number;
  onAnswer: (index: number) => void;
  disabled?: boolean;
  selectedIndex?: number | null;
}

/** Shuffle choices while tracking which shuffled index maps to which original index */
function shuffleChoices(choices: readonly string[], answerIndex: number, seed: string): {
  shuffled: string[];
  /** Maps shuffled index → original index */
  indexMap: number[];
  /** The shuffled index of the correct answer */
  correctShuffledIndex: number;
} {
  const indices = [0, 1, 2, 3];
  // Deterministic shuffle based on question id (seed)
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  for (let i = indices.length - 1; i > 0; i--) {
    hash = ((hash << 5) - hash + i) | 0;
    const j = ((hash >>> 0) % (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return {
    shuffled: indices.map(i => choices[i]),
    indexMap: indices,
    correctShuffledIndex: indices.indexOf(answerIndex),
  };
}

export default function QuestionPanel({
  question,
  timeLeft,
  onAnswer,
  disabled = false,
  selectedIndex = null,
}: QuestionPanelProps) {
  const urgent = timeLeft <= 5;

  // Shuffle choices once per question (stable via useMemo keyed by question.id)
  const { shuffled, indexMap, correctShuffledIndex } = useMemo(
    () => shuffleChoices(question.choices, question.answerIndex, question.id),
    [question.id, question.choices, question.answerIndex],
  );

  // When user taps a shuffled choice, map back to the original index for answer checking
  const handleChoice = (shuffledIdx: number) => {
    if (disabled) return;
    onAnswer(indexMap[shuffledIdx]);
  };

  // Map selectedIndex (original) to shuffled for display
  const selectedShuffled = selectedIndex !== null ? indexMap.indexOf(selectedIndex) : null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      padding: '0 16px 16px',
    }}>
      {/* Timer (hidden when no limit, i.e. timeLeft stays at 0) */}
      {timeLeft > 0 && (
        <div style={{
          textAlign: 'center',
          fontSize: 28,
          fontWeight: 900,
          color: urgent ? 'var(--color-danger)' : 'var(--color-text-accent)',
          animation: urgent ? 'timerUrgent 0.5s ease infinite' : 'none',
        }}>
          {Math.ceil(timeLeft)}
        </div>
      )}

      {/* Clock display for time questions */}
      {question.clockTime && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
          <ClockFace hour={question.clockTime.hour} minute={question.clockTime.minute} size={130} />
        </div>
      )}

      {/* Question text */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius)',
        padding: '12px 16px',
        fontSize: 16,
        fontWeight: 500,
        textAlign: 'center',
        lineHeight: 1.5,
        border: '1px solid var(--color-bg-lighter)',
      }}>
        {question.text}
      </div>

      {/* 4 choices (shuffled) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8,
      }}>
        {shuffled.map((choice, i) => {
          const isSelected = selectedShuffled === i;
          const isCorrect = i === correctShuffledIndex;
          let bg = 'var(--color-bg-lighter)';
          if (disabled && isCorrect) bg = 'var(--color-success)';
          else if (disabled && isSelected && !isCorrect) bg = 'var(--color-danger)';
          else if (!disabled) bg = 'var(--color-bg-lighter)';

          return (
            <button
              key={i}
              onClick={() => handleChoice(i)}
              disabled={disabled}
              style={{
                padding: '12px 8px',
                borderRadius: 'var(--radius)',
                background: bg,
                color: disabled ? '#fff' : 'var(--color-text)',
                fontSize: 15,
                fontWeight: 600,
                border: isSelected
                  ? '2px solid var(--color-primary-light)'
                  : '2px solid transparent',
                opacity: disabled && !isSelected && !isCorrect ? 0.5 : 1,
                transition: 'all var(--transition)',
              }}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}
