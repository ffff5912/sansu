import { useState, useCallback, useEffect } from 'react';
import type { GameState, PlayerState, Grade } from '../data/types.ts';
import { loadSave, writeSave, DEFAULT_PLAYER } from '../lib/storage.ts';

function initState(): GameState {
  return {
    scene: 'title',
    grade: 4,
    player: { ...DEFAULT_PLAYER },
    clearedFloors: [],
    currentFloor: null,
    resultType: null,
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
      timestamp: Date.now(),
    });
  }, [state.player, state.clearedFloors, state.currentFloor, state.scene, state.grade]);

  const goToTitle = useCallback(() => {
    setState(s => ({ ...s, scene: 'title', currentFloor: null, resultType: null }));
  }, []);

  const goToWorldMap = useCallback((grade: Grade) => {
    const save = loadSave(grade);
    setState({
      scene: 'worldmap',
      grade,
      player: save.player,
      clearedFloors: save.clearedFloors,
      currentFloor: null,
      resultType: null,
    });
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

  const resetGame = useCallback(() => {
    setState(initState());
  }, []);

  return {
    state,
    goToTitle,
    goToWorldMap,
    enterDungeon,
    finishDungeon,
    updatePlayer,
    resetGame,
  };
}
