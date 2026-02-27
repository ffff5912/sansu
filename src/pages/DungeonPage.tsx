import { useEffect, useCallback } from 'react';
import type { PlayerState } from '../data/types.ts';
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
  onClear: () => void;
  onGameOver: () => void;
  onUpdatePlayer: (player: PlayerState) => void;
}

export default function DungeonPage({
  floorId,
  player,
  onClear,
  onGameOver,
  onUpdatePlayer,
}: DungeonPageProps) {
  const map = getMap(floorId)!;
  const floor = getFloor(floorId)!;

  const {
    dungeon,
    movePlayer,
    encounterMonster,
    clearEncounter,
    defeatEnemy,
  } = useDungeon(floorId, player);

  const {
    battle,
    timer,
    startBattle,
    submitAnswer,
    endBattle,
    playerUpdate,
    leveledUp,
  } = useBattle(floorId, player);

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
    defeatEnemy();
    clearEncounter();
    endBattle();
  }, [defeatEnemy, clearEncounter, endBattle]);

  const handleDefeat = useCallback(() => {
    endBattle();
    clearEncounter();
    onGameOver();
  }, [endBattle, clearEncounter, onGameOver]);

  const handleAnswer = useCallback((index: number) => {
    // Map -1 (timeout) to an invalid index
    submitAnswer(index < 0 ? -1 : index);
  }, [submitAnswer]);

  const { handleDPad } = useInput({
    onDirection: movePlayer,
    enabled: dungeon.phase === 'explore',
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
        />
      )}
    </div>
  );
}
