import { useState } from 'react';
import type { PlayerState, Inventory, Grade, BuildingSave, MaterialBag, EquipmentSlots, DungeonBuff } from '../data/types.ts';
import { ITEMS, getItem } from '../data/items.ts';
import { BUILDINGS, getBuilding } from '../data/buildings.ts';
import { MONSTERS } from '../data/monsters.ts';
import { MATERIALS, getMaterial, EQUIPMENT, getEquipment } from '../data/crafting.ts';
import { applyExp } from '../lib/battleEngine.ts';
import { getMonsterSprite } from '../lib/monsterSprites.ts';
import { calcVillageLevel, getVillageLevelInfo, getUnlockedVillagers, getUnlockedMonuments } from '../data/villageProgression.ts';
import HpBar from '../components/HpBar.tsx';
import ExpBar from '../components/ExpBar.tsx';
import VillageCanvas from '../components/VillageCanvas.tsx';

interface BasePageProps {
  player: PlayerState;
  inventory: Inventory;
  buildings: string[];
  buildingLevels: BuildingSave[];
  defeatedMonsterIds: string[];
  grade: Grade;
  clearedFloors: number[];
  onUpdatePlayer: (player: PlayerState) => void;
  onUpdateInventory: (inventory: Inventory) => void;
  onUpdateBuildings: (buildings: string[]) => void;
  onUpdateBuildingLevels: (levels: BuildingSave[]) => void;
  defeatedBossIds: string[];
  materials: MaterialBag;
  craftedEquipment: string[];
  equipment: EquipmentSlots;
  onUpdateMaterials: (materials: MaterialBag) => void;
  onUpdateCrafting: (crafted: string[], equip: EquipmentSlots) => void;
  dungeonBuff: DungeonBuff;
  onSetBuff: (buff: DungeonBuff) => void;
  onGoDungeon: () => void;
  onGoTitle: () => void;
}

type Panel = null | 'shop' | 'items' | 'building' | 'encyclopedia' | 'smithy' | 'equip' | 'inn' | 'villager';

export default function BasePage({
  player,
  inventory,
  buildings,
  buildingLevels,
  defeatedMonsterIds,
  grade,
  clearedFloors,
  onUpdatePlayer,
  onUpdateInventory,
  onUpdateBuildings,
  onUpdateBuildingLevels,
  defeatedBossIds,
  materials,
  craftedEquipment,
  equipment,
  onUpdateMaterials,
  onUpdateCrafting,
  dungeonBuff,
  onSetBuff,
  onGoDungeon,
  onGoTitle,
}: BasePageProps) {
  const [panel, setPanel] = useState<Panel>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 1800);
  };

  const getBuildingLevel = (id: string): number => {
    const entry = buildingLevels.find(b => b.id === id);
    return entry?.level ?? 1;
  };

  const levelUpBuilding = (id: string) => {
    const current = buildingLevels.find(b => b.id === id);
    if (current) {
      onUpdateBuildingLevels(buildingLevels.map(b => b.id === id ? { ...b, level: b.level + 1 } : b));
    } else {
      onUpdateBuildingLevels([...buildingLevels, { id, level: 2 }]);
    }
  };

  const handleTapBuilding = (id: string) => {
    const building = getBuilding(id);
    if (!building) return;

    if (buildings.includes(id)) {
      // Already built — activate
      switch (id) {
        case 'fountain':
          if (player.hp >= player.maxHp) {
            showMessage('HPはまんたんだよ！');
          } else {
            onUpdatePlayer({ ...player, hp: player.maxHp });
            showMessage('HPがまんたんになった！');
          }
          break;
        case 'shop':
          setPanel('shop');
          break;
        case 'guild':
          onGoDungeon();
          break;
        case 'dojo': {
          const lvl = getBuildingLevel(id);
          if (lvl < 3) {
            const cost = lvl * 100;
            if (player.gold >= cost) {
              onUpdatePlayer({ ...player, gold: player.gold - cost, maxHp: player.maxHp + 10, hp: player.hp + 10 });
              levelUpBuilding(id);
              showMessage(`たいりょくどうじょう Lv${lvl + 1}！ HP+10！`);
            } else {
              showMessage(`レベルアップに ${cost}G ひつよう`);
            }
          } else {
            showMessage('たいりょくどうじょう MAX！');
          }
          break;
        }
        case 'library': {
          const lvl = getBuildingLevel(id);
          if (lvl < 3) {
            const cost = lvl * 120;
            if (player.gold >= cost) {
              onUpdatePlayer({ ...player, gold: player.gold - cost, attack: player.attack + 3 });
              levelUpBuilding(id);
              showMessage(`まほうとしょかん Lv${lvl + 1}！ ATK+3！`);
            } else {
              showMessage(`レベルアップに ${cost}G ひつよう`);
            }
          } else {
            showMessage('まほうとしょかん MAX！');
          }
          break;
        }
        case 'smithy':
          setPanel('smithy');
          break;
        case 'inn':
          setPanel('inn');
          break;
        case 'tower':
          setPanel('encyclopedia');
          break;
        case 'garden':
          showMessage('きれいな おはながさいている！');
          break;
        default:
          break;
      }
    } else {
      // Not built — show build dialog
      setSelectedBuilding(id);
      setPanel('building');
    }
  };

  const handleBuild = () => {
    if (!selectedBuilding) return;
    const building = getBuilding(selectedBuilding);
    if (!building) return;
    if (player.gold < building.cost) {
      showMessage('ゴールドがたりないよ…');
      return;
    }

    const newPlayer = { ...player, gold: player.gold - building.cost };

    // Apply building effects
    switch (building.id) {
      case 'dojo':
        newPlayer.maxHp += 20;
        newPlayer.hp += 20;
        break;
      case 'library':
        newPlayer.attack += 5;
        break;
    }

    onUpdatePlayer(newPlayer);
    onUpdateBuildings([...buildings, building.id]);
    showMessage(`${building.emoji} ${building.name}をけんせつした！`);
    setPanel(null);
    setSelectedBuilding(null);
  };

  const handleBuy = (itemId: string) => {
    const item = getItem(itemId);
    if (!item) return;
    if (player.gold < item.price) {
      showMessage('ゴールドがたりないよ…');
      return;
    }
    onUpdatePlayer({ ...player, gold: player.gold - item.price });
    const newInv = { ...inventory };
    newInv[itemId] = (newInv[itemId] ?? 0) + 1;
    onUpdateInventory(newInv);
    showMessage(`${item.emoji} ${item.name}をかったよ！`);
  };

  const handleUseItem = (itemId: string) => {
    const item = getItem(itemId);
    if (!item) return;
    const count = inventory[itemId] ?? 0;
    if (count <= 0) return;

    let newPlayer = { ...player };
    switch (item.effect) {
      case 'heal': {
        if (player.hp >= player.maxHp) {
          showMessage('HPはまんたんだよ！');
          return;
        }
        newPlayer.hp = Math.min(newPlayer.maxHp, newPlayer.hp + item.value);
        showMessage(`HPが${item.value}かいふくした！`);
        break;
      }
      case 'atkUp': {
        newPlayer.attack += item.value;
        showMessage(`こうげき力が${item.value}アップ！`);
        break;
      }
      case 'expUp': {
        const result = applyExp(newPlayer, item.value);
        newPlayer = result.newPlayer;
        if (result.leveled) {
          showMessage(`レベルアップ！ Lv.${newPlayer.level}になった！`);
        } else {
          showMessage(`けいけんち+${item.value}！`);
        }
        break;
      }
    }

    onUpdatePlayer(newPlayer);
    const newInv = { ...inventory };
    newInv[itemId] = count - 1;
    if (newInv[itemId] <= 0) delete newInv[itemId];
    onUpdateInventory(newInv);
  };

  const handleCraft = (equipId: string) => {
    const equip = getEquipment(equipId);
    if (!equip) return;
    if (craftedEquipment.includes(equipId)) {
      // Already crafted — equip it
      const newEquip = { ...equipment };
      if (newEquip[equip.slot] === equipId) {
        newEquip[equip.slot] = null; // unequip
        showMessage(`${equip.name}をはずした`);
      } else {
        newEquip[equip.slot] = equipId;
        showMessage(`${equip.name}をそうびした！`);
      }
      onUpdateCrafting(craftedEquipment, newEquip);
      return;
    }
    // Check materials
    for (const req of equip.recipe) {
      if ((materials[req.materialId] ?? 0) < req.count) {
        const mat = getMaterial(req.materialId);
        showMessage(`${mat?.name ?? req.materialId}が たりないよ`);
        return;
      }
    }
    if (player.gold < equip.craftGold) {
      showMessage('ゴールドが たりないよ…');
      return;
    }
    // Consume materials and gold
    const newMats = { ...materials };
    for (const req of equip.recipe) {
      newMats[req.materialId] = (newMats[req.materialId] ?? 0) - req.count;
      if (newMats[req.materialId] <= 0) delete newMats[req.materialId];
    }
    onUpdateMaterials(newMats);
    onUpdatePlayer({ ...player, gold: player.gold - equip.craftGold });
    // Auto-equip
    const newEquip = { ...equipment, [equip.slot]: equipId };
    onUpdateCrafting([...craftedEquipment, equipId], newEquip);
    showMessage(`${equip.name}を つくった！ そうびした！`);
  };

  const floorCount = grade === 1 ? 6 : 12;
  const buildingDef = selectedBuilding ? getBuilding(selectedBuilding) : null;
  const villageLv = calcVillageLevel(buildings, buildingLevels);
  const villageLvInfo = getVillageLevelInfo(villageLv);
  const villagers = getUnlockedVillagers(villageLv, clearedFloors);
  const monuments = getUnlockedMonuments(defeatedBossIds);
  const [selectedVillager, setSelectedVillager] = useState<string | null>(null);
  const activeVillager = villagers.find(v => v.id === selectedVillager);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
      background: 'var(--color-bg)',
      animation: 'fadeIn 0.4s ease',
    }}>
      {/* Compact header */}
      <div style={{
        padding: '10px 16px 8px',
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-bg-light)',
        boxShadow: 'var(--shadow)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--color-text)' }}>
              🏠 {villageLvInfo.name} <span style={{ fontSize: 11, color: 'var(--color-primary)' }}>Lv.{villageLv}</span>
            </span>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 13, fontWeight: 700, color: '#f6a800',
              background: '#fff8e0', padding: '2px 10px', borderRadius: 20,
            }}>
              <img src="/assets/tiny-swords/UI Elements/UI Elements/Icons/Icon_03.png" alt="" style={{ width: 18, height: 18, imageRendering: 'pixelated' }} />
              {player.gold}G
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--color-text-dim)' }}>
            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>Lv.{player.level}</span>
            <span>ATK {player.attack}</span>
            <span>クリア {clearedFloors.length}/{floorCount}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <div style={{ flex: 1 }}><HpBar current={player.hp} max={player.maxHp} height={10} /></div>
            <div style={{ flex: 1 }}><ExpBar current={player.exp} max={player.expToNext} /></div>
          </div>
        </div>
      </div>

      {/* Village canvas */}
      <div style={{ flex: 1, padding: '8px 12px', overflow: 'hidden' }}>
        <VillageCanvas
          builtIds={buildings}
          villageLv={villageLv}
          villagers={villagers}
          monuments={monuments}
          onTapBuilding={handleTapBuilding}
          onTapVillager={(id) => { setSelectedVillager(id); setPanel('villager'); }}
        />
      </div>

      {/* Bottom bar */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '8px 12px 12px',
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-bg-light)',
        flexShrink: 0,
      }}>
        <button onClick={() => setPanel('items')} style={bottomBtn}>🎒 もちもの</button>
        <button onClick={onGoDungeon} style={{ ...bottomBtn, background: 'var(--color-primary)', color: '#fff' }}>
          ⚔️ ダンジョン
        </button>
        <button onClick={onGoTitle} style={bottomBtn}>🏫 タイトル</button>
      </div>

      {/* Panel overlay */}
      {panel && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }}>
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: '16px 16px 0 0',
            width: '100%', maxHeight: '60%',
            display: 'flex', flexDirection: 'column',
            animation: 'slideUp 0.3s ease',
          }}>
            {/* Panel header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', borderBottom: '1px solid var(--color-bg-light)',
            }}>
              <span style={{ fontSize: 16, fontWeight: 700 }}>
                {panel === 'shop' && '🏪 ショップ'}
                {panel === 'items' && '🎒 もちもの'}
                {panel === 'building' && '🔨 けんせつ'}
                {panel === 'encyclopedia' && '📖 モンスターずかん'}
                {panel === 'smithy' && '🔨 かじや'}
                {panel === 'equip' && '⚔️ そうび'}
                {panel === 'inn' && '🏨 やどや'}
                {panel === 'villager' && activeVillager && `💬 ${activeVillager.name}`}
              </span>
              <button onClick={() => { setPanel(null); setSelectedBuilding(null); }}
                style={{ fontSize: 20, padding: '4px 8px', color: 'var(--color-text-dim)' }}>✕</button>
            </div>

            {/* Panel content */}
            <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
              {panel === 'shop' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {ITEMS.map(item => (
                    <button key={item.id} onClick={() => handleBuy(item.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                        padding: '12px 16px', borderRadius: 'var(--radius)',
                        background: player.gold >= item.price ? 'var(--color-bg-light)' : 'var(--color-bg)',
                        border: '2px solid var(--color-bg-lighter)',
                        opacity: player.gold >= item.price ? 1 : 0.5, textAlign: 'left',
                      }}>
                      {item.icon
                      ? <img src={item.icon} alt="" style={{ width: 36, height: 36, imageRendering: 'pixelated' }} />
                      : <span style={{ fontSize: 28 }}>{item.emoji}</span>}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>{item.description}</div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#f6a800' }}>{item.price}G</div>
                    </button>
                  ))}
                </div>
              )}

              {panel === 'items' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {Object.keys(inventory).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 24, color: 'var(--color-text-dim)', fontSize: 14 }}>
                      アイテムがないよ。ショップで買おう！
                    </div>
                  ) : (
                    Object.entries(inventory).filter(([, count]) => count > 0).map(([itemId, count]) => {
                      const item = getItem(itemId);
                      if (!item) return null;
                      return (
                        <button key={itemId} onClick={() => handleUseItem(itemId)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                            padding: '12px 16px', borderRadius: 'var(--radius)',
                            background: 'var(--color-bg-light)', border: '2px solid var(--color-bg-lighter)',
                            textAlign: 'left',
                          }}>
                          {item.icon
                      ? <img src={item.icon} alt="" style={{ width: 36, height: 36, imageRendering: 'pixelated' }} />
                      : <span style={{ fontSize: 28 }}>{item.emoji}</span>}
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 700 }}>{item.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>{item.description}</div>
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-primary)' }}>x{count}</div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}

              {panel === 'building' && buildingDef && (
                <div style={{ textAlign: 'center', padding: 16 }}>
                  <div style={{ fontSize: 48 }}>{buildingDef.emoji}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginTop: 8 }}>{buildingDef.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-dim)', marginTop: 4 }}>
                    {buildingDef.description}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#f6a800', marginTop: 12 }}>
                    💰 {buildingDef.cost}G
                  </div>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
                    <button onClick={handleBuild}
                      style={{
                        padding: '10px 28px', borderRadius: 'var(--radius-lg)',
                        background: player.gold >= buildingDef.cost ? 'var(--color-primary)' : 'var(--color-bg-lighter)',
                        color: player.gold >= buildingDef.cost ? '#fff' : 'var(--color-text-dim)',
                        fontSize: 16, fontWeight: 700,
                      }}>
                      けんせつする
                    </button>
                    <button onClick={() => { setPanel(null); setSelectedBuilding(null); }}
                      style={{
                        padding: '10px 20px', borderRadius: 'var(--radius-lg)',
                        background: 'var(--color-bg-light)', border: '2px solid var(--color-bg-lighter)',
                        fontSize: 14, fontWeight: 700,
                      }}>
                      やめる
                    </button>
                  </div>
                </div>
              )}

              {panel === 'encyclopedia' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 12, color: 'var(--color-text-dim)', marginBottom: 4 }}>
                    たおした モンスター: {defeatedMonsterIds.length} / {MONSTERS.length}
                  </div>
                  {MONSTERS.map(m => {
                    const defeated = defeatedMonsterIds.includes(m.id);
                    const spriteInfo = getMonsterSprite(m.floorId, m.isBoss);
                    return (
                      <div key={m.id} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 12px', borderRadius: 'var(--radius)',
                        background: defeated ? 'var(--color-bg-light)' : 'var(--color-bg)',
                        border: '1px solid var(--color-bg-lighter)',
                        opacity: defeated ? 1 : 0.4,
                      }}>
                        {defeated ? (
                          <img src={spriteInfo.path} alt="" style={{
                            width: 32, height: 32, imageRendering: 'pixelated',
                            objectFit: 'cover', objectPosition: '0 0',
                          }} />
                        ) : (
                          <div style={{ width: 32, height: 32, background: 'var(--color-bg-lighter)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>？</div>
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>
                            {defeated ? m.name : '？？？'}
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--color-text-dim)' }}>
                            {defeated ? `HP ${m.hp} / ATK ${m.attack} / EXP ${m.exp}` : '???'}
                            {m.isBoss && defeated && ' ★BOSS'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {panel === 'smithy' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--color-text-dim)', marginBottom: 2 }}>もっている そざい:</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                    {MATERIALS.map(mat => {
                      const count = materials[mat.id] ?? 0;
                      if (count === 0) return null;
                      return (
                        <div key={mat.id} style={{
                          display: 'flex', alignItems: 'center', gap: 3,
                          background: 'var(--color-bg-light)', borderRadius: 6,
                          padding: '2px 8px', fontSize: 11, fontWeight: 700,
                        }}>
                          <img src={mat.icon} alt="" style={{ width: 14, height: 14, imageRendering: 'pixelated' }} />
                          {mat.name} ×{count}
                        </div>
                      );
                    })}
                    {Object.keys(materials).length === 0 && (
                      <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>そざいが ないよ</div>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-dim)', marginBottom: 2 }}>つくれる そうび:</div>
                  {EQUIPMENT.map(eq => {
                    const crafted = craftedEquipment.includes(eq.id);
                    const equipped = equipment[eq.slot] === eq.id;
                    const canCraft = !crafted && eq.recipe.every(r => (materials[r.materialId] ?? 0) >= r.count) && player.gold >= eq.craftGold;
                    return (
                      <button key={eq.id} onClick={() => handleCraft(eq.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                          padding: '10px 12px', borderRadius: 'var(--radius)',
                          background: crafted ? (equipped ? '#e8f5e9' : 'var(--color-bg-light)') : (canCraft ? 'var(--color-bg-light)' : 'var(--color-bg)'),
                          border: equipped ? '2px solid var(--color-success)' : '2px solid var(--color-bg-lighter)',
                          opacity: crafted || canCraft ? 1 : 0.5, textAlign: 'left',
                        }}>
                        <img src={eq.icon} alt="" style={{ width: 28, height: 28, imageRendering: 'pixelated' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>
                            {eq.name} {crafted && (equipped ? '✅' : '（タップでそうび）')}
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--color-text-dim)' }}>{eq.description}</div>
                          {!crafted && (
                            <div style={{ fontSize: 10, color: 'var(--color-text-dim)', marginTop: 2 }}>
                              {eq.recipe.map(r => `${getMaterial(r.materialId)?.name}×${r.count}`).join(' + ')} + {eq.craftGold}G
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {panel === 'inn' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 8 }}>
                  <div style={{ fontSize: 13, color: 'var(--color-text-dim)', textAlign: 'center' }}>
                    ダンジョンに もっていく バフを えらぼう！
                  </div>
                  {([
                    { id: 'none' as DungeonBuff, label: 'なし', desc: 'バフなし', emoji: '➖' },
                    { id: 'hp' as DungeonBuff, label: 'HP+20%', desc: 'さいだいHPが 20% アップ', emoji: '❤️' },
                    { id: 'atk' as DungeonBuff, label: 'ATK+15%', desc: 'こうげき力が 15% アップ', emoji: '⚔️' },
                    { id: 'timer' as DungeonBuff, label: 'タイマー+3秒', desc: 'こたえる じかんが 3びょう ふえる', emoji: '⏱️' },
                  ]).map(buff => (
                    <button key={buff.id} onClick={() => { onSetBuff(buff.id); showMessage(`${buff.label} を セット！`); setPanel(null); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                        padding: '12px 14px', borderRadius: 'var(--radius)',
                        background: dungeonBuff === buff.id ? '#e8f5e9' : 'var(--color-bg-light)',
                        border: dungeonBuff === buff.id ? '2px solid var(--color-success)' : '2px solid var(--color-bg-lighter)',
                        textAlign: 'left',
                      }}>
                      <span style={{ fontSize: 24 }}>{buff.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{buff.label} {dungeonBuff === buff.id && '✅'}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>{buff.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {panel === 'villager' && activeVillager && (
                <div style={{ textAlign: 'center', padding: 16 }}>
                  <img src={activeVillager.sprite} alt="" style={{
                    width: 64, height: 64, imageRendering: 'pixelated',
                    objectFit: 'cover', objectPosition: '0 0',
                  }} />
                  <div style={{ fontSize: 16, fontWeight: 700, marginTop: 8 }}>{activeVillager.name}</div>
                  <div style={{
                    marginTop: 12, padding: '12px 16px',
                    background: 'var(--color-bg-light)', borderRadius: 'var(--radius)',
                    fontSize: 14, lineHeight: 1.6, textAlign: 'left',
                  }}>
                    「{activeVillager.dialogue[activeVillager.id.length % activeVillager.dialogue.length]}」
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Buildable buildings list */}
      {!panel && BUILDINGS.filter(b => b.cost > 0 && !buildings.includes(b.id)).length > 0 && (
        <div style={{
          position: 'absolute', top: 100, right: 8, zIndex: 10,
          background: 'rgba(255,255,255,0.9)', borderRadius: 12,
          padding: '6px 10px', boxShadow: 'var(--shadow)',
          fontSize: 11, color: 'var(--color-text-dim)',
        }}>
          🔨 建物をタップ！
        </div>
      )}

      {/* Message toast */}
      {message && (
        <div style={{
          position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--color-surface)', border: '2px solid var(--color-primary)',
          borderRadius: 'var(--radius-lg)', padding: '12px 24px',
          fontSize: 15, fontWeight: 700, color: 'var(--color-text)',
          boxShadow: 'var(--shadow)', animation: 'bounceIn 0.3s ease',
          zIndex: 200, whiteSpace: 'nowrap',
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

const bottomBtn: React.CSSProperties = {
  flex: 1,
  padding: '10px 4px',
  borderRadius: 'var(--radius)',
  background: 'var(--color-bg-light)',
  border: '2px solid var(--color-bg-lighter)',
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--color-text)',
};
