import { useState, useEffect, useCallback } from 'react';
import type { PlayerState, GameDifficulty, MaterialBag, EquipmentSlots, DungeonBuff } from '../data/types.ts';
import { getMap } from '../data/maps/index.ts';
import { getFloor } from '../data/floors.ts';
import { useDungeon } from '../hooks/useDungeon.ts';
import { useBattle } from '../hooks/useBattle.ts';
import { useInput } from '../hooks/useInput.ts';
import DungeonCanvas from '../components/DungeonCanvas.tsx';
import DPad from '../components/DPad.tsx';
import PlayerHud from '../components/PlayerHud.tsx';
import BattleOverlay from '../components/BattleOverlay.tsx';

interface DungeonPageProps {
  floorId: number;
  player: PlayerState;
  gameDifficulty: GameDifficulty;
  equipment: EquipmentSlots;
  dungeonBuff: DungeonBuff;
  onClear: () => void;
  onGameOver: () => void;
  onUpdatePlayer: (player: PlayerState) => void;
  onMonsterDefeated: (monsterId: string) => void;
  onBossDefeated: (bossId: string) => void;
  onMaterialsGained: (materials: MaterialBag) => void;
  onBack: () => void;
}

export default function DungeonPage({
  floorId,
  player,
  gameDifficulty,
  equipment,
  dungeonBuff,
  onClear,
  onGameOver,
  onUpdatePlayer,
  onMonsterDefeated,
  onBossDefeated,
  onMaterialsGained,
  onBack,
}: DungeonPageProps) {
  const map = getMap(floorId)!;
  const floor = getFloor(floorId)!;

  const {
    dungeon,
    movePlayer,
    encounterMonster,
    clearEncounter,
    defeatEnemy,
  } = useDungeon(floorId);

  // Apply HP buff on dungeon entry
  useEffect(() => {
    if (dungeonBuff === 'hp') {
      const boostedMax = Math.round(player.maxHp * 1.2);
      if (player.hp === player.maxHp) {
        onUpdatePlayer({ ...player, maxHp: boostedMax, hp: boostedMax });
      }
    }
  // Only on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    battle,
    timer,
    startBattle,
    submitAnswer,
    endBattle,
    playerUpdate,
    leveledUp,
    goldEarned,
    droppedMaterials,
  } = useBattle(floorId, player, gameDifficulty, equipment, dungeonBuff);

  // Start battle when encounter happens
  useEffect(() => {
    if (encounterMonster && !battle) {
      startBattle(encounterMonster);
    }
  }, [encounterMonster, battle, startBattle]);

  // Sync player updates from battle
  useEffect(() => {
    if (playerUpdate) {
      onUpdatePlayer(playerUpdate);
    }
  }, [playerUpdate, onUpdatePlayer]);

  // Check dungeon clear
  useEffect(() => {
    if (dungeon.phase === 'clear') {
      onClear();
    }
  }, [dungeon.phase, onClear]);

  const handleVictory = useCallback(() => {
    if (battle?.monster) {
      onMonsterDefeated(battle.monster.id);
      if (battle.monster.isBoss) {
        onBossDefeated(battle.monster.id);
      }
    }
    // Collect dropped materials
    if (Object.keys(droppedMaterials).length > 0) {
      onMaterialsGained(droppedMaterials);
    }
    defeatEnemy();
    clearEncounter();
    endBattle();
  }, [defeatEnemy, clearEncounter, endBattle, battle, onMonsterDefeated, onBossDefeated, droppedMaterials, onMaterialsGained]);

  const handleDefeat = useCallback(() => {
    endBattle();
    clearEncounter();
    onGameOver();
  }, [endBattle, clearEncounter, onGameOver]);

  const handleAnswer = useCallback((index: number) => {
    // Map -1 (timeout) to an invalid index
    submitAnswer(index < 0 ? -1 : index);
  }, [submitAnswer]);

  const [showMenu, setShowMenu] = useState(false);

  const { handleDPad } = useInput({
    onDirection: movePlayer,
    enabled: dungeon.phase === 'explore' && !showMenu,
  });

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
    }}>
      {/* Map area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <PlayerHud player={player} floorName={`${floor.id}F ${floor.name}`} />
        <DungeonCanvas
          map={map}
          playerPos={dungeon.playerPos}
          defeatedEnemies={dungeon.defeatedEnemies}
          doorOpen={dungeon.doorOpen}
        />
        {/* Menu button */}
        {dungeon.phase === 'explore' && !battle && (
          <button
            onClick={() => setShowMenu(true)}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 20,
              padding: '6px 12px',
              borderRadius: 8,
              background: 'var(--color-surface)',
              border: '2px solid var(--color-primary)',
              color: 'var(--color-primary)',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow)',
            }}
          >
            MENU
          </button>
        )}
      </div>

      {/* DPad */}
      <div style={{
        flexShrink: 0,
        background: 'var(--color-surface)',
        borderTop: '2px solid var(--color-bg-light)',
        padding: '4px 0 12px',
      }}>
        <DPad onDirection={handleDPad} />
      </div>

      {/* Menu overlay */}
      {showMenu && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 100,
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: 'var(--color-surface)',
            border: '2px solid var(--color-primary)',
            borderRadius: 16,
            padding: '24px 32px',
            textAlign: 'center',
            minWidth: 220,
            boxShadow: 'var(--shadow)',
          }}>
            <p style={{ color: 'var(--color-text)', fontSize: 15, marginBottom: 20, fontWeight: 700 }}>
              ダンジョンからでますか？
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={onBack}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  background: 'var(--color-danger)',
                  border: 'none',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                でる
              </button>
              <button
                onClick={() => setShowMenu(false)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  background: 'var(--color-bg-light)',
                  border: '2px solid var(--color-bg-lighter)',
                  color: 'var(--color-text)',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                もどる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Battle overlay */}
      {battle && (
        <BattleOverlay
          battle={battle}
          player={player}
          timeLeft={timer.timeLeft}
          onAnswer={handleAnswer}
          onVictory={handleVictory}
          onDefeat={handleDefeat}
          leveledUp={leveledUp}
          goldEarned={goldEarned}
          droppedMaterials={droppedMaterials}
        />
      )}
    </div>
  );
}
