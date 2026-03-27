import type { FloorDef } from '../data/types.ts';

interface FloorCardProps {
  floor: FloorDef;
  cleared: boolean;
  stars: number; // 0-3
  onSelect: () => void;
}

function StarDisplay({ stars }: { stars: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3].map(i => (
        <span key={i} style={{ fontSize: 14, opacity: i <= stars ? 1 : 0.2 }}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function FloorCard({ floor, cleared, stars, onSelect }: FloorCardProps) {
  const locked = !floor.unlocked && !cleared;

  return (
    <button
      onClick={() => !locked && onSelect()}
      disabled={locked}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        padding: '12px 16px',
        borderRadius: 'var(--radius-lg)',
        background: locked
          ? 'var(--color-bg-light)'
          : stars === 3
            ? 'linear-gradient(135deg, #fff8e1, #ffecb3)'
            : cleared
              ? 'linear-gradient(135deg, #e8f5e9, #c8e6c9)'
              : 'var(--color-surface)',
        border: stars === 3
          ? '2px solid #FFD700'
          : cleared
            ? '2px solid var(--color-success)'
            : '2px solid var(--color-bg-lighter)',
        opacity: locked ? 0.4 : 1,
        transition: 'all var(--transition)',
        textAlign: 'left',
        boxShadow: locked ? 'none' : 'var(--shadow)',
      }}
    >
      <div style={{ fontSize: 32 }}>{locked ? '🔒' : floor.emoji}</div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--color-text)',
        }}>
          {floor.id}F: {floor.name}
        </div>
        <div style={{
          fontSize: 11,
          color: 'var(--color-text-dim)',
          marginTop: 2,
        }}>
          {floor.subtitle}
        </div>
      </div>
      {cleared && <StarDisplay stars={stars} />}
    </button>
  );
}
