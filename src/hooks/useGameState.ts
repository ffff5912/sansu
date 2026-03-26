import { useState, useCallback, useEffect } from 'react';
import type { GameState, PlayerState, Grade, Inventory, GameDifficulty, BuildingSave, DungeonBuff } from '../data/types.ts';
import { loadSave, writeSave, DEFAULT_PLAYER, DEFAULT_INVENTORY } from '../lib/storage.ts';
import { DEFAULT_BUILDINGS } from '../data/buildings.ts';

function initState(): GameState {
  return {
    scene: 'title',
    grade: 4,
    gameDifficulty: 'normal',
    player: { ...DEFAULT_PLAYER },
    clearedFloors: [],
    currentFloor: null,
    resultType: null,
    inventory: { ...DEFAULT_INVENTORY },
    buildings: [...DEFAULT_BUILDINGS],
    buildingLevels: DEFAULT_BUILDINGS.map(id => ({ id, level: 1 })),
    defeatedMonsterIds: [],
    dungeonBuff: 'none' as DungeonBuff,
  };
}

export function useGameState() {
  const [state, setState] = useState<GameState>(initState);

  // Auto-save on player/clearedFloors change (skip while on title)
  useEffect(() => {
    if (state.scene === 'title') return;
    writeSave({
      version: 1,
      grade: state.grade,
      player: state.player,
      clearedFloors: state.clearedFloors,
      currentFloor: state.currentFloor,
      inventory: state.inventory,
      buildings: state.buildings,
      buildingLevels: state.buildingLevels,
      defeatedMonsterIds: state.defeatedMonsterIds,
      timestamp: Date.now(),
    });
  }, [state.player, state.clearedFloors, state.currentFloor, state.scene, state.grade, state.inventory, state.buildings, state.buildingLevels, state.defeatedMonsterIds]);

  const goToTitle = useCallback(() => {
    setState(s => ({ ...s, scene: 'title', currentFloor: null, resultType: null }));
  }, []);

  const goToBase = useCallback((grade: Grade) => {
    const save = loadSave(grade);
    setState(s => ({
      scene: 'base',
      grade,
      gameDifficulty: s.gameDifficulty,
      player: save.player,
      clearedFloors: save.clearedFloors,
      currentFloor: null,
      resultType: null,
      inventory: save.inventory,
      buildings: save.buildings,
      buildingLevels: save.buildingLevels,
      defeatedMonsterIds: save.defeatedMonsterIds,
      dungeonBuff: 'none' as DungeonBuff,
    }));
  }, []);

  const goToWorldMap = useCallback(() => {
    setState(s => ({ ...s, scene: 'worldmap', currentFloor: null, resultType: null }));
  }, []);

  const setDifficulty = useCallback((diff: GameDifficulty) => {
    setState(s => ({ ...s, gameDifficulty: diff }));
  }, []);

  const enterDungeon = useCallback((floorId: number) => {
    setState(s => ({ ...s, scene: 'dungeon', currentFloor: floorId }));
  }, []);

  const finishDungeon = useCallback((resultType: 'clear' | 'gameover') => {
    setState(s => {
      const clearedFloors = resultType === 'clear' && s.currentFloor !== null
        ? [...new Set([...s.clearedFloors, s.currentFloor])]
        : s.clearedFloors;
      return { ...s, scene: 'result', resultType, clearedFloors };
    });
  }, []);

  const updatePlayer = useCallback((player: PlayerState) => {
    setState(s => ({ ...s, player }));
  }, []);

  const updateInventory = useCallback((inventory: Inventory) => {
    setState(s => ({ ...s, inventory }));
  }, []);

  const updateBuildings = useCallback((buildings: string[]) => {
    setState(s => ({ ...s, buildings }));
  }, []);

  const updateBuildingLevels = useCallback((buildingLevels: BuildingSave[]) => {
    setState(s => ({ ...s, buildingLevels }));
  }, []);

  const addDefeatedMonster = useCallback((monsterId: string) => {
    setState(s => ({
      ...s,
      defeatedMonsterIds: [...new Set([...s.defeatedMonsterIds, monsterId])],
    }));
  }, []);

  const setDungeonBuff = useCallback((buff: DungeonBuff) => {
    setState(s => ({ ...s, dungeonBuff: buff }));
  }, []);

  const resetGame = useCallback(() => {
    setState(initState());
  }, []);

  return {
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
    setDungeonBuff,
    resetGame,
  };
}
