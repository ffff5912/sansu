interface MonsterSpriteProps {
  emoji: string;
  name: string;
  phase: 'appear' | 'idle' | 'hit' | 'defeat';
}

export default function MonsterSprite({ emoji, name, phase }: MonsterSpriteProps) {
  const animStyle = (): React.CSSProperties => {
    switch (phase) {
      case 'appear':
        return { animation: 'monsterAppear 0.6s ease forwards' };
      case 'hit':
        return { animation: 'shakeHit 0.5s ease' };
      case 'defeat':
        return { animation: 'monsterDefeat 0.8s ease forwards' };
      default:
        return { animation: 'pulse 2s ease infinite' };
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      ...animStyle(),
    }}>
      <div style={{ fontSize: 80, lineHeight: 1 }}>{emoji}</div>
      <div style={{
        fontSize: 14,
        fontWeight: 700,
        color: 'var(--color-text)',
      }}>
        {name}
      </div>
    </div>
  );
}
