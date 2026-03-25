import type { PlayerState } from '../data/types.ts';
import HpBar from './HpBar.tsx';
import ExpBar from './ExpBar.tsx';

interface PlayerHudProps {
  player: PlayerState;
  floorName: string;
}

export default function PlayerHud({ player, floorName }: PlayerHudProps) {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      padding: '8px 12px',
      background: 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0))',
      zIndex: 10,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 12,
        marginBottom: 4,
      }}>
        <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
          Lv.{player.level} 🧒
        </span>
        <span style={{ color: 'var(--color-text-dim)' }}>{floorName}</span>
      </div>
      <HpBar current={player.hp} max={player.maxHp} label="HP" height={12} />
      <div style={{ marginTop: 4 }}>
        <ExpBar current={player.exp} max={player.expToNext} />
      </div>
    </div>
  );
}
