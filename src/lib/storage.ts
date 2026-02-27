import type { SaveData, PlayerState } from '../data/types.ts';

const SAVE_KEY = 'sansu-dungeon-save';
const CURRENT_VERSION = 1;

export const DEFAULT_PLAYER: PlayerState = {
  level: 1,
  maxHp: 100,
  hp: 100,
  attack: 10,
  exp: 0,
  expToNext: 30,
};

function defaultSave(): SaveData {
  return {
    version: CURRENT_VERSION,
    player: { ...DEFAULT_PLAYER },
    clearedFloors: [],
    currentFloor: null,
    timestamp: Date.now(),
  };
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultSave();
    const data = JSON.parse(raw) as Partial<SaveData>;
    // Deep merge for forward compatibility
    const base = defaultSave();
    return {
      ...base,
      ...data,
      player: { ...base.player, ...(data.player ?? {}) },
      clearedFloors: data.clearedFloors ?? base.clearedFloors,
      version: CURRENT_VERSION,
    };
  } catch {
    return defaultSave();
  }
}

export function writeSave(data: SaveData): void {
  const toSave: SaveData = {
    ...data,
    version: CURRENT_VERSION,
    timestamp: Date.now(),
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(toSave));
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
}
