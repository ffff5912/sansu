import type { SaveData, PlayerState, Grade, Inventory, EquipmentSlots, MaterialBag } from '../data/types.ts';

const SAVE_KEY_PREFIX = 'sansu-dungeon-save';
const CURRENT_VERSION = 1;

export const DEFAULT_PLAYER: PlayerState = {
  level: 1,
  maxHp: 100,
  hp: 100,
  attack: 10,
  exp: 0,
  expToNext: 30,
  gold: 0,
};

import { DEFAULT_BUILDINGS } from '../data/buildings.ts';

export const DEFAULT_INVENTORY: Inventory = {};

function saveKey(grade: Grade): string {
  return `${SAVE_KEY_PREFIX}-g${grade}`;
}

function defaultSave(grade: Grade): SaveData {
  return {
    version: CURRENT_VERSION,
    grade,
    player: { ...DEFAULT_PLAYER },
    clearedFloors: [],
    currentFloor: null,
    inventory: { ...DEFAULT_INVENTORY },
    buildings: [...DEFAULT_BUILDINGS],
    buildingLevels: DEFAULT_BUILDINGS.map(id => ({ id, level: 1 })),
    defeatedMonsterIds: [],
    materials: {} as MaterialBag,
    craftedEquipment: [],
    equipment: { weapon: null, armor: null, accessory: null } as EquipmentSlots,
    defeatedBossIds: [],
    timestamp: Date.now(),
  };
}

export function loadSave(grade: Grade): SaveData {
  try {
    const raw = localStorage.getItem(saveKey(grade));
    if (!raw) return defaultSave(grade);
    const data = JSON.parse(raw) as Partial<SaveData>;
    const base = defaultSave(grade);
    return {
      ...base,
      ...data,
      grade,
      player: { ...base.player, ...(data.player ?? {}) },
      clearedFloors: data.clearedFloors ?? base.clearedFloors,
      inventory: data.inventory ?? base.inventory,
      buildings: data.buildings ?? base.buildings,
      buildingLevels: data.buildingLevels ?? base.buildingLevels,
      defeatedMonsterIds: data.defeatedMonsterIds ?? base.defeatedMonsterIds,
      materials: data.materials ?? base.materials,
      craftedEquipment: data.craftedEquipment ?? base.craftedEquipment,
      equipment: data.equipment ?? base.equipment,
      defeatedBossIds: data.defeatedBossIds ?? base.defeatedBossIds,
      version: CURRENT_VERSION,
    };
  } catch {
    return defaultSave(grade);
  }
}

export function writeSave(data: SaveData): void {
  const toSave: SaveData = {
    ...data,
    version: CURRENT_VERSION,
    timestamp: Date.now(),
  };
  localStorage.setItem(saveKey(data.grade), JSON.stringify(toSave));
}

export function clearSave(grade: Grade): void {
  localStorage.removeItem(saveKey(grade));
}
