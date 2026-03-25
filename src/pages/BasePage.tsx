import { useState } from 'react';
import type { PlayerState, Inventory, Grade } from '../data/types.ts';
import { ITEMS, getItem } from '../data/items.ts';
import { applyExp } from '../lib/battleEngine.ts';
import HpBar from '../components/HpBar.tsx';
import ExpBar from '../components/ExpBar.tsx';

interface BasePageProps {
  player: PlayerState;
  inventory: Inventory;
  grade: Grade;
  clearedFloors: number[];
  onUpdatePlayer: (player: PlayerState) => void;
  onUpdateInventory: (inventory: Inventory) => void;
  onGoDungeon: () => void;
  onGoTitle: () => void;
}

type Tab = 'home' | 'shop' | 'items';

export default function BasePage({
  player,
  inventory,
  grade,
  clearedFloors,
  onUpdatePlayer,
  onUpdateInventory,
  onGoDungeon,
  onGoTitle,
}: BasePageProps) {
  const [tab, setTab] = useState<Tab>('home');
  const [message, setMessage] = useState<string | null>(null);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 1500);
  };

  const handleHeal = () => {
    if (player.hp >= player.maxHp) {
      showMessage('HPはまんたんだよ！');
      return;
    }
    onUpdatePlayer({ ...player, hp: player.maxHp });
    showMessage('HPがまんたんになった！');
  };

  const handleBuy = (itemId: string) => {
    const item = getItem(itemId);
    if (!item) return;
    if (player.gold < item.price) {
      showMessage('ゴールドがたりないよ…');
      return;
    }
    onUpdatePlayer({ ...player, gold: player.gold - item.price });
    const newInv = { ...inventory };
    newInv[itemId] = (newInv[itemId] ?? 0) + 1;
    onUpdateInventory(newInv);
    showMessage(`${item.emoji} ${item.name}をかったよ！`);
  };

  const handleUseItem = (itemId: string) => {
    const item = getItem(itemId);
    if (!item) return;
    const count = inventory[itemId] ?? 0;
    if (count <= 0) return;

    let newPlayer = { ...player };
    switch (item.effect) {
      case 'heal': {
        if (player.hp >= player.maxHp) {
          showMessage('HPはまんたんだよ！');
          return;
        }
        newPlayer.hp = Math.min(newPlayer.maxHp, newPlayer.hp + item.value);
        showMessage(`HPが${item.value}かいふくした！`);
        break;
      }
      case 'atkUp': {
        newPlayer.attack += item.value;
        showMessage(`こうげき力が${item.value}アップ！`);
        break;
      }
      case 'expUp': {
        const result = applyExp(newPlayer, item.value);
        newPlayer = result.newPlayer;
        if (result.leveled) {
          showMessage(`レベルアップ！ Lv.${newPlayer.level}になった！`);
        } else {
          showMessage(`けいけんち+${item.value}！`);
        }
        break;
      }
    }

    onUpdatePlayer(newPlayer);
    const newInv = { ...inventory };
    newInv[itemId] = count - 1;
    if (newInv[itemId] <= 0) delete newInv[itemId];
    onUpdateInventory(newInv);
  };

  const tabStyle = (t: Tab): React.CSSProperties => ({
    flex: 1,
    padding: '10px 0',
    borderRadius: '12px 12px 0 0',
    background: tab === t ? 'var(--color-surface)' : 'var(--color-bg-light)',
    color: tab === t ? 'var(--color-primary)' : 'var(--color-text-dim)',
    fontSize: 14,
    fontWeight: 700,
    borderBottom: tab === t ? '3px solid var(--color-primary)' : '3px solid transparent',
  });

  const floorCount = grade === 1 ? 6 : 12;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'linear-gradient(180deg, #e8f4ff 0%, var(--color-bg) 50%)',
      animation: 'fadeIn 0.4s ease',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 16px 12px',
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-bg-light)',
        boxShadow: 'var(--shadow)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--color-text)' }}>
            🏠 さんすうの村
          </div>
          <div style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#f6a800',
            background: '#fff8e0',
            padding: '4px 12px',
            borderRadius: 20,
          }}>
            💰 {player.gold}G
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13 }}>
          <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
            Lv.{player.level} 🧒
          </span>
          <span style={{ color: 'var(--color-text-dim)' }}>
            ATK {player.attack}
          </span>
          <span style={{ color: 'var(--color-text-dim)' }}>
            クリア {clearedFloors.length}/{floorCount}
          </span>
        </div>
        <div style={{ marginTop: 6 }}>
          <HpBar current={player.hp} max={player.maxHp} label="HP" height={12} />
        </div>
        <div style={{ marginTop: 4 }}>
          <ExpBar current={player.exp} max={player.expToNext} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: 'var(--color-bg-light)' }}>
        <button style={tabStyle('home')} onClick={() => setTab('home')}>ひろば</button>
        <button style={tabStyle('shop')} onClick={() => setTab('shop')}>ショップ</button>
        <button style={tabStyle('items')} onClick={() => setTab('items')}>もちもの</button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        {tab === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Heal spot */}
            <button
              onClick={handleHeal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, #e0f7fa, #b2ebf2)',
                border: '2px solid #80deea',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 36 }}>⛲</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#00838f' }}>いやしの泉</div>
                <div style={{ fontSize: 12, color: '#4db6ac' }}>HPをまんたんにする（むりょう）</div>
              </div>
            </button>

            {/* Go to dungeon */}
            <button
              onClick={onGoDungeon}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, #e8eaf6, #c5cae9)',
                border: '2px solid #9fa8da',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 36 }}>🗺️</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#3949ab' }}>ダンジョンへ</div>
                <div style={{ fontSize: 12, color: '#7986cb' }}>ぼうけんに出発する</div>
              </div>
            </button>

            {/* Back to title */}
            <button
              onClick={onGoTitle}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-surface)',
                border: '2px solid var(--color-bg-lighter)',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 36 }}>🏫</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>がくねん選択</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>タイトルにもどる</div>
              </div>
            </button>
          </div>
        )}

        {tab === 'shop' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 14, color: 'var(--color-text-dim)', marginBottom: 4 }}>
              🛒 アイテムをかおう！
            </div>
            {ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => handleBuy(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius)',
                  background: player.gold >= item.price ? 'var(--color-surface)' : 'var(--color-bg-light)',
                  border: '2px solid var(--color-bg-lighter)',
                  opacity: player.gold >= item.price ? 1 : 0.5,
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 28 }}>{item.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>{item.description}</div>
                </div>
                <div style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#f6a800',
                  whiteSpace: 'nowrap',
                }}>
                  {item.price}G
                </div>
              </button>
            ))}
          </div>
        )}

        {tab === 'items' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 14, color: 'var(--color-text-dim)', marginBottom: 4 }}>
              🎒 もっているアイテム
            </div>
            {Object.keys(inventory).length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: 32,
                color: 'var(--color-text-dim)',
                fontSize: 14,
              }}>
                アイテムがないよ。ショップで買おう！
              </div>
            ) : (
              Object.entries(inventory).filter(([, count]) => count > 0).map(([itemId, count]) => {
                const item = getItem(itemId);
                if (!item) return null;
                return (
                  <button
                    key={itemId}
                    onClick={() => handleUseItem(itemId)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius)',
                      background: 'var(--color-surface)',
                      border: '2px solid var(--color-bg-lighter)',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: 28 }}>{item.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>{item.description}</div>
                    </div>
                    <div style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                    }}>
                      x{count}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Message toast */}
      {message && (
        <div style={{
          position: 'fixed',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--color-surface)',
          border: '2px solid var(--color-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '12px 24px',
          fontSize: 15,
          fontWeight: 700,
          color: 'var(--color-text)',
          boxShadow: 'var(--shadow)',
          animation: 'bounceIn 0.3s ease',
          zIndex: 200,
          whiteSpace: 'nowrap',
        }}>
          {message}
        </div>
      )}
    </div>
  );
}
