interface HpBarProps {
  current: number;
  max: number;
  label?: string;
  color?: string;
  height?: number;
}

export default function HpBar({
  current,
  max,
  label,
  color = 'var(--color-hp-bar)',
  height = 16,
}: HpBarProps) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const low = pct <= 25;

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 11,
          marginBottom: 2,
          color: 'var(--color-text-dim)',
        }}>
          <span>{label}</span>
          <span>{current}/{max}</span>
        </div>
      )}
      <div style={{
        width: '100%',
        height,
        background: 'var(--color-hp-bg)',
        borderRadius: height / 2,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: low ? 'var(--color-danger)' : color,
          borderRadius: height / 2,
          transition: 'width 0.4s ease, background 0.3s',
          boxShadow: low ? '0 0 8px var(--color-danger)' : 'none',
        }} />
      </div>
    </div>
  );
}
