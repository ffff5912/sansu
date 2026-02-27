interface ExpBarProps {
  current: number;
  max: number;
}

export default function ExpBar({ current, max }: ExpBarProps) {
  const pct = max > 0 ? Math.min(100, (current / max) * 100) : 0;

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 10,
        marginBottom: 1,
        color: 'var(--color-text-dim)',
      }}>
        <span>EXP</span>
        <span>{current}/{max}</span>
      </div>
      <div style={{
        width: '100%',
        height: 8,
        background: 'var(--color-exp-bg)',
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: 'var(--color-exp-bar)',
          borderRadius: 4,
          transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  );
}
