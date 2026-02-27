import type { Grade } from '../data/types.ts';

interface TitlePageProps {
  onStart: (grade: Grade) => void;
}

export default function TitlePage({ onStart }: TitlePageProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: 24,
      padding: 32,
      background: 'radial-gradient(ellipse at center, var(--color-bg-light) 0%, var(--color-bg) 70%)',
      animation: 'fadeIn 0.5s ease',
    }}>
      <div style={{ fontSize: 60, animation: 'pulse 3s ease infinite' }}>
        🏰
      </div>
      <h1 style={{
        fontSize: 28,
        fontWeight: 900,
        color: 'var(--color-text-accent)',
        textAlign: 'center',
        textShadow: '0 0 20px rgba(255,215,0,0.3)',
      }}>
        さんすうダンジョン
      </h1>
      <p style={{
        fontSize: 13,
        color: 'var(--color-text-dim)',
        textAlign: 'center',
      }}>
        がくねんを えらんで ぼうけんにでよう！
      </p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => onStart(1)}
          style={{
            padding: '14px 32px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, #43a047, #66bb6a)',
            color: '#fff',
            fontSize: 17,
            fontWeight: 700,
            boxShadow: '0 0 12px rgba(67,160,71,0.4)',
            animation: 'pulse 2.5s ease infinite',
          }}
        >
          小1
        </button>
        <button
          onClick={() => onStart(4)}
          style={{
            padding: '14px 32px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
            color: '#fff',
            fontSize: 17,
            fontWeight: 700,
            boxShadow: 'var(--shadow-glow)',
            animation: 'pulse 2.5s ease infinite',
          }}
        >
          小4
        </button>
      </div>
    </div>
  );
}
