import { useState, useCallback, useEffect } from 'react';
import type { GameState, PlayerState } from '../data/types.ts';
import { loadSave, writeSave, DEFAULT_PLAYER } from '../lib/storage.ts';

function initState(): GameState {
  const save = loadSave();
  return {
    scene: 'title',
    player: save.player,
    clearedFloors: save.clearedFloors,
    currentFloor: null,
    resultType: null,
  };
}

export function useGameState() {
  const [state, setState] = useState<GameState>(initState);

  // Auto-save on player/clearedFloors change
  useEffect(() => {
    writeSave({
      version: 1,
      player: state.player,
      clearedFloors: state.clearedFloors,
      currentFloor: state.currentFloor,
      timestamp: Date.now(),
    });
  }, [state.player, state.clearedFloors, state.currentFloor]);

  const goToTitle = useCallback(() => {
    setState(s => ({ ...s, scene: 'title', currentFloor: null, resultType: null }));
  }, []);

  const goToWorldMap = useCallback(() => {
    setState(s => ({ ...s, scene: 'worldmap', resultType: null }));
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
    setState({
      scene: 'title',
      player: { ...DEFAULT_PLAYER },
      clearedFloors: [],
      currentFloor: null,
      resultType: null,
    });
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
