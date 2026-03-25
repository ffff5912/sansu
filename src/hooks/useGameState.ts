import { useState, useCallback, useEffect } from 'react';
import type { GameState, PlayerState, Grade, Inventory } from '../data/types.ts';
import { loadSave, writeSave, DEFAULT_PLAYER, DEFAULT_INVENTORY } from '../lib/storage.ts';

function initState(): GameState {
  return {
    scene: 'title',
    grade: 4,
    player: { ...DEFAULT_PLAYER },
    clearedFloors: [],
    currentFloor: null,
    resultType: null,
    inventory: { ...DEFAULT_INVENTORY },
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
      timestamp: Date.now(),
    });
  }, [state.player, state.clearedFloors, state.currentFloor, state.scene, state.grade, state.inventory]);

  const goToTitle = useCallback(() => {
    setState(s => ({ ...s, scene: 'title', currentFloor: null, resultType: null }));
  }, []);

  const goToBase = useCallback((grade: Grade) => {
    const save = loadSave(grade);
    setState({
      scene: 'base',
      grade,
      player: save.player,
      clearedFloors: save.clearedFloors,
      currentFloor: null,
      resultType: null,
      inventory: save.inventory,
    });
  }, []);

  const goToWorldMap = useCallback(() => {
    setState(s => ({ ...s, scene: 'worldmap', currentFloor: null, resultType: null }));
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

  const resetGame = useCallback(() => {
    setState(initState());
  }, []);

  return {
    state,
    goToTitle,
    goToBase,
    goToWorldMap,
    enterDungeon,
    finishDungeon,
    updatePlayer,
    updateInventory,
    resetGame,
  };
}
