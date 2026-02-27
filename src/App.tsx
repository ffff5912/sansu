import { useCallback } from 'react';
import { useGameState } from './hooks/useGameState.ts';
import { DEFAULT_PLAYER } from './lib/storage.ts';
import TitlePage from './pages/TitlePage.tsx';
import WorldMapPage from './pages/WorldMapPage.tsx';
import DungeonPage from './pages/DungeonPage.tsx';
import ResultPage from './pages/ResultPage.tsx';

export default function App() {
  const {
    state,
    goToTitle,
    goToWorldMap,
    enterDungeon,
    finishDungeon,
    updatePlayer,
  } = useGameState();

  const handleRetry = useCallback(() => {
    if (state.currentFloor !== null) {
      // Reset HP for retry
      updatePlayer({ ...state.player, hp: state.player.maxHp });
      enterDungeon(state.currentFloor);
    }
  }, [state.currentFloor, state.player, updatePlayer, enterDungeon]);

  switch (state.scene) {
    case 'title':
      return <TitlePage onStart={goToWorldMap} />;

    case 'worldmap':
      return (
        <WorldMapPage
          clearedFloors={state.clearedFloors}
          onSelectFloor={enterDungeon}
          onBack={goToTitle}
        />
      );

    case 'dungeon':
      if (state.currentFloor === null) return null;
      return (
        <DungeonPage
          floorId={state.currentFloor}
          player={state.player}
          onClear={() => finishDungeon('clear')}
          onGameOver={() => finishDungeon('gameover')}
          onUpdatePlayer={updatePlayer}
          onBack={goToWorldMap}
        />
      );

    case 'result':
      return (
        <ResultPage
          floorId={state.currentFloor ?? 1}
          resultType={state.resultType ?? 'gameover'}
          player={state.player}
          onContinue={goToWorldMap}
          onRetry={handleRetry}
        />
      );

    default:
      return null;
  }
}
