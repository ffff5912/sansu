interface TitlePageProps {
  onStart: () => void;
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
        小4算数の年間総復習！<br />
        ダンジョンを攻略して算数マスターになろう！
      </p>
      <button
        onClick={onStart}
        style={{
          padding: '14px 48px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
          color: '#fff',
          fontSize: 18,
          fontWeight: 700,
          boxShadow: 'var(--shadow-glow)',
          animation: 'pulse 2s ease infinite',
        }}
      >
        ぼうけんにでる
      </button>
    </div>
  );
}
