import type { MaterialDef, EquipmentDef } from './types.ts';

const A = '/assets/tiny-swords';

/* ====== Materials ====== */
export const MATERIALS: MaterialDef[] = [
  { id: 'wood', name: 'もくざい', icon: `${A}/Terrain/Resources/Wood/Wood Resource/Wood Resource.png`, description: 'きのぼうや たてに つかう' },
  { id: 'stone', name: 'いし', icon: `${A}/Terrain/Decorations/Rocks/Rock1.png`, description: 'かたい いし。ぶきに つかう' },
  { id: 'iron', name: 'てっこうせき', icon: `${A}/Terrain/Resources/Gold/Gold Stones/Gold Stone 1.png`, description: 'つよい ぶきの ざいりょう' },
  { id: 'crystal', name: 'まほうの石', icon: `${A}/Terrain/Resources/Gold/Gold Stones/Gold Stone 3.png`, description: 'まほうの ちからが こもった いし' },
  { id: 'scale', name: 'りゅうのうろこ', icon: `${A}/Terrain/Resources/Gold/Gold Stones/Gold Stone 5.png`, description: 'つよい モンスターから おちる' },
  { id: 'herb', name: 'やくそう', icon: `${A}/Terrain/Decorations/Bushes/Bushe1.png`, description: 'かいふくアイテムの ざいりょう' },
  { id: 'meat', name: 'にく', icon: `${A}/Terrain/Resources/Meat/Meat Resource/Meat Resource.png`, description: 'ちからが でる たべもの' },
];

export function getMaterial(id: string): MaterialDef | undefined {
  return MATERIALS.find(m => m.id === id);
}

/**
 * Drop table: floorId → list of { materialId, chance (0-1) }
 * Grade 1 floors drop more frequently (higher chances, more variety)
 */
export function getDropTable(floorId: number): { materialId: string; chance: number }[] {
  if (floorId >= 101 && floorId <= 103) {
    // Early Grade 1: wood, herb, meat — HIGH drop rate
    return [
      { materialId: 'wood', chance: 0.7 },
      { materialId: 'herb', chance: 0.5 },
      { materialId: 'meat', chance: 0.4 },
      { materialId: 'stone', chance: 0.3 },
    ];
  }
  if (floorId >= 104 && floorId <= 106) {
    // Late Grade 1: all basic + some iron
    return [
      { materialId: 'wood', chance: 0.6 },
      { materialId: 'stone', chance: 0.5 },
      { materialId: 'herb', chance: 0.5 },
      { materialId: 'meat', chance: 0.4 },
      { materialId: 'iron', chance: 0.3 },
    ];
  }
  if (floorId <= 4) {
    // Grade 4 early
    return [
      { materialId: 'stone', chance: 0.5 },
      { materialId: 'iron', chance: 0.4 },
      { materialId: 'wood', chance: 0.3 },
      { materialId: 'herb', chance: 0.2 },
    ];
  }
  if (floorId <= 8) {
    // Grade 4 mid
    return [
      { materialId: 'iron', chance: 0.5 },
      { materialId: 'crystal', chance: 0.3 },
      { materialId: 'stone', chance: 0.3 },
      { materialId: 'meat', chance: 0.2 },
    ];
  }
  // Grade 4 late (9-12)
  return [
    { materialId: 'crystal', chance: 0.5 },
    { materialId: 'scale', chance: 0.3 },
    { materialId: 'iron', chance: 0.3 },
    { materialId: 'meat', chance: 0.2 },
  ];
}

/** Roll drops for a defeated monster */
export function rollDrops(floorId: number, isBoss: boolean): { materialId: string; count: number }[] {
  const table = getDropTable(floorId);
  const drops: { materialId: string; count: number }[] = [];
  for (const entry of table) {
    // Boss doubles chance and gives 2
    const chance = isBoss ? Math.min(1, entry.chance * 1.5) : entry.chance;
    if (Math.random() < chance) {
      drops.push({ materialId: entry.materialId, count: isBoss ? 2 : 1 });
    }
  }
  return drops;
}

/* ====== Equipment ====== */
export const EQUIPMENT: EquipmentDef[] = [
  // Weapons
  {
    id: 'wooden-sword', name: 'きのけん', icon: `${A}/UI Elements/UI Elements/Icons/Icon_05.png`,
    description: 'ATK+5', slot: 'weapon', atkBonus: 5, defBonus: 0, expBonus: 0,
    recipe: [{ materialId: 'wood', count: 3 }], craftGold: 30,
  },
  {
    id: 'stone-sword', name: 'いしのけん', icon: `${A}/UI Elements/UI Elements/Icons/Icon_05.png`,
    description: 'ATK+10', slot: 'weapon', atkBonus: 10, defBonus: 0, expBonus: 0,
    recipe: [{ materialId: 'stone', count: 3 }, { materialId: 'wood', count: 2 }], craftGold: 60,
  },
  {
    id: 'iron-sword', name: 'はがねのけん', icon: `${A}/UI Elements/UI Elements/Icons/Icon_05.png`,
    description: 'ATK+18', slot: 'weapon', atkBonus: 18, defBonus: 0, expBonus: 0,
    recipe: [{ materialId: 'iron', count: 5 }, { materialId: 'stone', count: 3 }], craftGold: 120,
  },
  {
    id: 'dragon-sword', name: 'りゅうのけん', icon: `${A}/UI Elements/UI Elements/Icons/Icon_05.png`,
    description: 'ATK+30', slot: 'weapon', atkBonus: 30, defBonus: 0, expBonus: 0,
    recipe: [{ materialId: 'scale', count: 5 }, { materialId: 'crystal', count: 3 }, { materialId: 'iron', count: 3 }], craftGold: 250,
  },
  // Armor
  {
    id: 'wooden-shield', name: 'きのたて', icon: `${A}/UI Elements/UI Elements/Icons/Icon_06.png`,
    description: 'ダメージ-3', slot: 'armor', atkBonus: 0, defBonus: 3, expBonus: 0,
    recipe: [{ materialId: 'wood', count: 4 }], craftGold: 40,
  },
  {
    id: 'iron-shield', name: 'はがねのたて', icon: `${A}/UI Elements/UI Elements/Icons/Icon_06.png`,
    description: 'ダメージ-8', slot: 'armor', atkBonus: 0, defBonus: 8, expBonus: 0,
    recipe: [{ materialId: 'iron', count: 4 }, { materialId: 'stone', count: 2 }], craftGold: 100,
  },
  {
    id: 'dragon-shield', name: 'りゅうのたて', icon: `${A}/UI Elements/UI Elements/Icons/Icon_06.png`,
    description: 'ダメージ-15', slot: 'armor', atkBonus: 0, defBonus: 15, expBonus: 0,
    recipe: [{ materialId: 'scale', count: 4 }, { materialId: 'iron', count: 3 }], craftGold: 200,
  },
  // Accessories
  {
    id: 'herb-charm', name: 'やくそうのおまもり', icon: `${A}/UI Elements/UI Elements/Icons/Icon_11.png`,
    description: 'EXP+20%', slot: 'accessory', atkBonus: 0, defBonus: 0, expBonus: 20,
    recipe: [{ materialId: 'herb', count: 5 }, { materialId: 'wood', count: 2 }], craftGold: 50,
  },
  {
    id: 'crystal-charm', name: 'まほうのおまもり', icon: `${A}/UI Elements/UI Elements/Icons/Icon_11.png`,
    description: 'EXP+50%', slot: 'accessory', atkBonus: 0, defBonus: 0, expBonus: 50,
    recipe: [{ materialId: 'crystal', count: 4 }, { materialId: 'herb', count: 3 }], craftGold: 150,
  },
  {
    id: 'meat-ring', name: 'にくのゆびわ', icon: `${A}/UI Elements/UI Elements/Icons/Icon_11.png`,
    description: 'ATK+8 ダメージ-4', slot: 'accessory', atkBonus: 8, defBonus: 4, expBonus: 0,
    recipe: [{ materialId: 'meat', count: 5 }, { materialId: 'iron', count: 2 }], craftGold: 80,
  },
];

export function getEquipment(id: string): EquipmentDef | undefined {
  return EQUIPMENT.find(e => e.id === id);
}
