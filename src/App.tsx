import { useCallback } from 'react';
import type { MaterialBag } from './data/types.ts';
import { useGameState } from './hooks/useGameState.ts';
import TitlePage from './pages/TitlePage.tsx';
import BasePage from './pages/BasePage.tsx';
import WorldMapPage from './pages/WorldMapPage.tsx';
import DungeonPage from './pages/DungeonPage.tsx';
import ResultPage from './pages/ResultPage.tsx';

export default function App() {
  const {
    state,
    goToTitle,
    goToBase,
    goToWorldMap,
    setDifficulty,
    enterDungeon,
    finishDungeon,
    updatePlayer,
    updateInventory,
    updateBuildings,
    updateBuildingLevels,
    addDefeatedMonster,
    updateMaterials,
    updateCrafting,
    setDungeonBuff,
  } = useGameState();

  const handleRetry = useCallback(() => {
    if (state.currentFloor !== null) {
      // Reset HP for retry
      updatePlayer({ ...state.player, hp: state.player.maxHp });
      enterDungeon(state.currentFloor);
    }
  }, [state.currentFloor, state.player, updatePlayer, enterDungeon]);

  const handleMaterialsGained = useCallback((drops: MaterialBag) => {
    const current = { ...state.materials };
    for (const [matId, count] of Object.entries(drops)) {
      current[matId] = (current[matId] ?? 0) + count;
    }
    updateMaterials(current);
  }, [state.materials, updateMaterials]);

  const handleBackToBase = useCallback(() => {
    goToBase(state.grade);
  }, [goToBase, state.grade]);

  switch (state.scene) {
    case 'title':
      return <TitlePage onStart={goToBase} />;

    case 'base':
      return (
        <BasePage
          player={state.player}
          inventory={state.inventory}
          buildings={state.buildings}
          buildingLevels={state.buildingLevels}
          defeatedMonsterIds={state.defeatedMonsterIds}
          grade={state.grade}
          clearedFloors={state.clearedFloors}
          onUpdatePlayer={updatePlayer}
          onUpdateInventory={updateInventory}
          onUpdateBuildings={updateBuildings}
          onUpdateBuildingLevels={updateBuildingLevels}
          materials={state.materials}
          craftedEquipment={state.craftedEquipment}
          equipment={state.equipment}
          onUpdateMaterials={updateMaterials}
          onUpdateCrafting={updateCrafting}
          dungeonBuff={state.dungeonBuff}
          onSetBuff={setDungeonBuff}
          onGoDungeon={goToWorldMap}
          onGoTitle={goToTitle}
        />
      );

    case 'worldmap':
      return (
        <WorldMapPage
          grade={state.grade}
          clearedFloors={state.clearedFloors}
          difficulty={state.gameDifficulty}
          onSetDifficulty={setDifficulty}
          onSelectFloor={enterDungeon}
          onBack={handleBackToBase}
        />
      );

    case 'dungeon':
      if (state.currentFloor === null) return null;
      return (
        <DungeonPage
          floorId={state.currentFloor}
          player={state.player}
          gameDifficulty={state.gameDifficulty}
          equipment={state.equipment}
          dungeonBuff={state.dungeonBuff}
          onClear={() => finishDungeon('clear')}
          onGameOver={() => finishDungeon('gameover')}
          onUpdatePlayer={updatePlayer}
          onMonsterDefeated={addDefeatedMonster}
          onMaterialsGained={handleMaterialsGained}
          onBack={handleBackToBase}
        />
      );

    case 'result':
      return (
        <ResultPage
          floorId={state.currentFloor ?? 1}
          resultType={state.resultType ?? 'gameover'}
          player={state.player}
          onContinue={handleBackToBase}
          onRetry={handleRetry}
        />
      );

    default:
      return null;
  }
}
