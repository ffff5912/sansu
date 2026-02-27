import type { PlayerState } from '../data/types.ts';
import { getFloor } from '../data/floors.ts';

interface ResultPageProps {
  floorId: number;
  resultType: 'clear' | 'gameover';
  player: PlayerState;
  onContinue: () => void;
  onRetry: () => void;
}

export default function ResultPage({
  floorId,
  resultType,
  player,
  onContinue,
  onRetry,
}: ResultPageProps) {
  const floor = getFloor(floorId);
  const isClear = resultType === 'clear';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: 20,
      padding: 32,
      background: isClear
        ? 'radial-gradient(ellipse at center, rgba(0,200,83,0.15), var(--color-bg) 70%)'
        : 'radial-gradient(ellipse at center, rgba(255,68,68,0.15), var(--color-bg) 70%)',
      animation: 'fadeIn 0.5s ease',
    }}>
      <div style={{ fontSize: 64, animation: 'bounceIn 0.6s ease' }}>
        {isClear ? '🎉' : '💀'}
      </div>
      <h1 style={{
        fontSize: 24,
        fontWeight: 900,
        color: isClear ? 'var(--color-text-accent)' : 'var(--color-danger)',
      }}>
        {isClear ? 'フロアクリア！' : 'ゲームオーバー'}
      </h1>
      {floor && (
        <div style={{
          fontSize: 14,
          color: 'var(--color-text-dim)',
        }}>
          {floor.id}F: {floor.name}
        </div>
      )}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius)',
        padding: '12px 24px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 13, color: 'var(--color-text-dim)' }}>Lv.{player.level}</div>
        <div style={{ fontSize: 13, color: 'var(--color-text-dim)', marginTop: 4 }}>
          HP {player.hp}/{player.maxHp} | ATK {player.attack}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        {isClear ? (
          <button
            onClick={onContinue}
            style={{
              padding: '12px 36px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-primary)',
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            マップにもどる
          </button>
        ) : (
          <>
            <button
              onClick={onRetry}
              style={{
                padding: '12px 28px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-danger)',
                color: '#fff',
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              リトライ
            </button>
            <button
              onClick={onContinue}
              style={{
                padding: '12px 28px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-surface-light)',
                color: 'var(--color-text)',
                fontSize: 16,
                fontWeight: 700,
                border: '1px solid var(--color-bg-lighter)',
              }}
            >
              マップへ
            </button>
          </>
        )}
      </div>
    </div>
  );
}
