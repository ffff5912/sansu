interface DamageNumberProps {
  value: number;
  isPlayerDamage?: boolean;
}

export default function DamageNumber({ value, isPlayerDamage = false }: DamageNumberProps) {
  if (value === 0) return null;

  return (
    <div style={{
      position: 'absolute',
      top: isPlayerDamage ? '60%' : '20%',
      left: '50%',
      transform: 'translateX(-50%)',
      animation: 'damageFloat 1s ease forwards',
      fontSize: 32,
      fontWeight: 900,
      color: isPlayerDamage ? 'var(--color-danger)' : 'var(--color-text-accent)',
      textShadow: `0 2px 8px ${isPlayerDamage ? 'rgba(255,0,0,0.6)' : 'rgba(255,215,0,0.6)'}`,
      pointerEvents: 'none',
      zIndex: 20,
    }}>
      {isPlayerDamage ? `-${value}` : value}
    </div>
  );
}
