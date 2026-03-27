import type { PlayerState } from '../data/types.ts';
import { getFloor } from '../data/floors.ts';

interface ResultPageProps {
  floorId: number;
  resultType: 'clear' | 'gameover';
  player: PlayerState;
  stars?: number;
  onContinue: () => void;
  onRetry: () => void;
}

export default function ResultPage({
  floorId,
  resultType,
  player,
  stars = 0,
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
        ? 'linear-gradient(180deg, #e8f5e9, var(--color-bg) 70%)'
        : 'linear-gradient(180deg, #ffebee, var(--color-bg) 70%)',
      animation: 'fadeIn 0.5s ease',
    }}>
      <div style={{ fontSize: 64, animation: 'bounceIn 0.6s ease' }}>
        {isClear ? '🎉' : '😢'}
      </div>
      <h1 style={{
        fontSize: 24,
        fontWeight: 900,
        color: isClear ? 'var(--color-success)' : 'var(--color-danger)',
      }}>
        {isClear ? 'フロアクリア！' : 'ゲームオーバー'}
      </h1>
      {isClear && stars > 0 && (
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center', fontSize: 28 }}>
          {[1, 2, 3].map(i => (
            <span key={i} style={{
              opacity: i <= stars ? 1 : 0.2,
              animation: i <= stars ? `bounceIn ${0.3 + i * 0.15}s ease` : 'none',
            }}>★</span>
          ))}
        </div>
      )}
      {isClear && stars === 3 && (
        <div style={{ fontSize: 13, color: '#FFD700', fontWeight: 700 }}>パーフェクト！</div>
      )}
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
        boxShadow: 'var(--shadow)',
      }}>
        <div style={{ fontSize: 13, color: 'var(--color-text-dim)' }}>Lv.{player.level}</div>
        <div style={{ fontSize: 13, color: 'var(--color-text-dim)', marginTop: 4 }}>
          HP {player.hp}/{player.maxHp} | ATK {player.attack} | 💰 {player.gold}G
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
            村にもどる
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
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                fontSize: 16,
                fontWeight: 700,
                border: '2px solid var(--color-bg-lighter)',
              }}
            >
              村へ
            </button>
          </>
        )}
      </div>
    </div>
  );
}
