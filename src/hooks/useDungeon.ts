import { useState, useCallback } from 'react';
import type { DungeonState, Direction, PlayerState, Monster } from '../data/types.ts';
import { getMap } from '../data/maps/index.ts';
import { getMonster } from '../data/monsters.ts';
import { getFloor } from '../data/floors.ts';
import { move, findStart, getTile, getEnemyKey } from '../lib/gameEngine.ts';

interface UseDungeonReturn {
  dungeon: DungeonState;
  movePlayer: (dir: Direction) => void;
  encounterMonster: Monster | null;
  clearEncounter: () => void;
  defeatEnemy: () => void;
  openDoor: () => void;
  checkClear: () => boolean;
  resetDungeon: (floorId: number) => void;
}

export function useDungeon(floorId: number, player: PlayerState): UseDungeonReturn {
  const map = getMap(floorId)!;
  const floor = getFloor(floorId)!;

  const [dungeon, setDungeon] = useState<DungeonState>(() => ({
    floorId,
    playerPos: findStart(map),
    phase: 'explore',
    defeatedEnemies: new Set<string>(),
    doorOpen: false,
    chestsOpened: new Set<string>(),
  }));

  const [encounterMonster, setEncounterMonster] = useState<Monster | null>(null);

  const movePlayer = useCallback((dir: Direction) => {
    if (dungeon.phase !== 'explore') return;

    const newPos = move(map, dungeon.playerPos, dir, dungeon.doorOpen);
    if (newPos.x === dungeon.playerPos.x && newPos.y === dungeon.playerPos.y) return;

    const tile = getTile(map, newPos.x, newPos.y);
    const enemyKey = getEnemyKey(newPos.x, newPos.y);

    setDungeon(d => ({ ...d, playerPos: newPos }));

    // Check for enemy encounter
    if ((tile === 'E' || tile === 'B') && !dungeon.defeatedEnemies.has(enemyKey)) {
      const monsterIds = tile === 'B' ? [floor.bossId] : floor.monsterIds;
      const monsterId = monsterIds[Math.floor(Math.random() * monsterIds.length)];
      const monster = getMonster(tile === 'B' ? floor.bossId : monsterId);
      if (monster) {
        setEncounterMonster(monster);
        setDungeon(d => ({ ...d, phase: 'battle' }));
      }
    }

    // Check for door
    if (tile === 'D' && dungeon.doorOpen) {
      setDungeon(d => ({ ...d, phase: 'clear' }));
    }
  }, [dungeon, map, floor]);

  const clearEncounter = useCallback(() => {
    setEncounterMonster(null);
    setDungeon(d => ({ ...d, phase: 'explore' }));
  }, []);

  const defeatEnemy = useCallback(() => {
    const key = getEnemyKey(dungeon.playerPos.x, dungeon.playerPos.y);
    setDungeon(d => {
      const newDefeated = new Set(d.defeatedEnemies);
      newDefeated.add(key);

      // Check if all enemies defeated → open door
      let allDefeated = true;
      for (let y = 0; y < map.height; y++) {
        for (let x = 0; x < map.width; x++) {
          const t = getTile(map, x, y);
          if ((t === 'E' || t === 'B') && !newDefeated.has(getEnemyKey(x, y))) {
            allDefeated = false;
          }
        }
      }

      return {
        ...d,
        defeatedEnemies: newDefeated,
        doorOpen: allDefeated ? true : d.doorOpen,
      };
    });
  }, [dungeon.playerPos, map]);

  const openDoor = useCallback(() => {
    setDungeon(d => ({ ...d, doorOpen: true }));
  }, []);

  const checkClear = useCallback((): boolean => {
    return dungeon.phase === 'clear';
  }, [dungeon.phase]);

  const resetDungeon = useCallback((newFloorId: number) => {
    const newMap = getMap(newFloorId)!;
    setDungeon({
      floorId: newFloorId,
      playerPos: findStart(newMap),
      phase: 'explore',
      defeatedEnemies: new Set(),
      doorOpen: false,
      chestsOpened: new Set(),
    });
    setEncounterMonster(null);
  }, []);

  return {
    dungeon,
    movePlayer,
    encounterMonster,
    clearEncounter,
    defeatEnemy,
    openDoor,
    checkClear,
    resetDungeon,
  };
}
