import type { Question } from '../data/types.ts';
import ClockFace from './ClockFace.tsx';

interface QuestionPanelProps {
  question: Question;
  timeLeft: number;
  onAnswer: (index: number) => void;
  disabled?: boolean;
  selectedIndex?: number | null;
}

export default function QuestionPanel({
  question,
  timeLeft,
  onAnswer,
  disabled = false,
  selectedIndex = null,
}: QuestionPanelProps) {
  const urgent = timeLeft <= 5;

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

      {/* 4 choices */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8,
      }}>
        {question.choices.map((choice, i) => {
          const isSelected = selectedIndex === i;
          const isCorrect = i === question.answerIndex;
          let bg = 'var(--color-bg-lighter)';
          if (disabled && isCorrect) bg = 'var(--color-success)';
          else if (disabled && isSelected && !isCorrect) bg = 'var(--color-danger)';
          else if (!disabled) bg = 'var(--color-bg-lighter)';

          return (
            <button
              key={i}
              onClick={() => !disabled && onAnswer(i)}
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
