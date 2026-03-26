/**
 * Maps monsters to Tiny Swords sprite sheets based on floor and boss status.
 * Sprites are assigned by color (faction) per floor group and class per role.
 *
 * Color mapping:
 *   Grade 1 (floor 101-106): Yellow (friendly feel)
 *   Grade 4 floors 1-4:      Red (aggressive)
 *   Grade 4 floors 5-8:      Purple (mystical)
 *   Grade 4 floors 9-12:     Black (dark/endgame)
 *
 * Class mapping:
 *   Regular enemy: Pawn (Idle)
 *   Boss:          Warrior (Idle)
 */
const A = '/assets/tiny-swords/Units';

interface SpriteInfo {
  path: string;
  frames: number;
  frameW: number;
  frameH: number;
}

function getColorForFloor(floorId: number): string {
  if (floorId >= 100) return 'Yellow Units';
  if (floorId <= 4) return 'Red Units';
  if (floorId <= 8) return 'Purple Units';
  return 'Black Units';
}

export function getMonsterSprite(floorId: number, isBoss: boolean): SpriteInfo {
  const color = getColorForFloor(floorId);
  if (isBoss) {
    return {
      path: `${A}/${color}/Warrior/Warrior_Idle.png`,
      frames: 8,
      frameW: 192,
      frameH: 192,
    };
  }
  return {
    path: `${A}/${color}/Pawn/Pawn_Idle.png`,
    frames: 8,
    frameW: 192,
    frameH: 192,
  };
}

/** Get all unique sprite paths needed for preloading */
export function getAllMonsterSpritePaths(): string[] {
  const colors = ['Red Units', 'Purple Units', 'Black Units', 'Yellow Units'];
  const paths: string[] = [];
  for (const color of colors) {
    paths.push(`${A}/${color}/Pawn/Pawn_Idle.png`);
    paths.push(`${A}/${color}/Warrior/Warrior_Idle.png`);
  }
  return paths;
}
