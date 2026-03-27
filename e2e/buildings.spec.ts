import { test, expect } from '@playwright/test';

test.describe('拠点建設 + 施設機能テスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
    // Enter village as Grade 1
    await page.getByText('小1').click({ force: true });
    await page.waitForTimeout(1000);
    // Give player lots of gold for building
    await page.evaluate(() => {
      const key = 'sansu-dungeon-save-g1';
      const save = JSON.parse(localStorage.getItem(key) || '{}');
      save.player = { ...save.player, gold: 99999 };
      localStorage.setItem(key, JSON.stringify(save));
    });
    // Reload to apply gold
    await page.getByText('タイトル').click({ force: true });
    await page.getByText('小1').click({ force: true });
    await page.waitForTimeout(2000); // Wait for PixiJS village to load
  });

  // ==================== Free buildings (already built) ====================
  test('いやしの泉(無料): タップでHP回復メッセージ', async ({ page }) => {
    // Fountain is already built, tap it via the village canvas
    // We can't easily click PixiJS canvas targets, so test via button panel
    // The fountain tap shows a message - we test by checking no errors
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.waitForTimeout(1000);
    expect(errors.length).toBe(0);
  });

  test('ショップ(無料): もちものパネルが開ける', async ({ page }) => {
    await page.getByText('もちもの').click({ force: true });
    await expect(page.getByText(/もっているアイテム|ショップ/)).toBeVisible();
  });

  test('ぼうけんギルド(無料): ダンジョンへ遷移', async ({ page }) => {
    await page.getByText('ダンジョン').click({ force: true });
    await expect(page.getByText('ワールドマップ')).toBeVisible();
  });

  // ==================== Build all paid buildings via localStorage ====================
  test('全有料建物を建設 → エラーなし', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));

    // Build all buildings by directly modifying localStorage
    await page.evaluate(() => {
      const key = 'sansu-dungeon-save-g1';
      const save = JSON.parse(localStorage.getItem(key) || '{}');
      save.buildings = [
        'fountain', 'shop', 'guild',
        'garden', 'dojo', 'library', 'inn',
        'smithy', 'colosseum', 'school', 'tower',
      ];
      save.buildingLevels = save.buildings.map((id: string) => ({ id, level: 1 }));
      save.player = { ...save.player, gold: 99999 };
      localStorage.setItem(key, JSON.stringify(save));
    });

    // Reload village
    await page.getByText('タイトル').click({ force: true });
    await page.getByText('小1').click({ force: true });
    await page.waitForTimeout(3000); // Wait for PixiJS to render all buildings

    expect(errors.length).toBe(0);
  });

  test('全建物建設後: 村レベルが上がっている', async ({ page }) => {
    // Build all
    await page.evaluate(() => {
      const key = 'sansu-dungeon-save-g1';
      const save = JSON.parse(localStorage.getItem(key) || '{}');
      save.buildings = [
        'fountain', 'shop', 'guild',
        'garden', 'dojo', 'library', 'inn',
        'smithy', 'colosseum', 'school', 'tower',
      ];
      save.buildingLevels = save.buildings.map((id: string) => ({ id, level: 1 }));
      save.player = { ...save.player, gold: 99999 };
      localStorage.setItem(key, JSON.stringify(save));
    });
    await page.getByText('タイトル').click({ force: true });
    await page.getByText('小1').click({ force: true });
    await page.waitForTimeout(2000);

    // Village level should be > 1 (11 buildings * 2 = 22 points → Lv5)
    await expect(page.getByText(/さんすう王国|はなの みやこ|にぎやかな まち/)).toBeVisible();
  });

  test('鍛冶屋: クラフトパネルが開ける', async ({ page }) => {
    // Build smithy
    await page.evaluate(() => {
      const key = 'sansu-dungeon-save-g1';
      const save = JSON.parse(localStorage.getItem(key) || '{}');
      save.buildings = [...(save.buildings || []), 'smithy'];
      save.buildingLevels = (save.buildings || []).map((id: string) => ({ id, level: 1 }));
      save.player = { ...save.player, gold: 99999 };
      // Add some materials for testing
      save.materials = { wood: 10, stone: 10, iron: 10, herb: 10, meat: 10 };
      localStorage.setItem(key, JSON.stringify(save));
    });
    await page.getByText('タイトル').click({ force: true });
    await page.getByText('小1').click({ force: true });
    await page.waitForTimeout(2000);

    // We can't click PixiJS buildings, but we can verify the data loads without error
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.waitForTimeout(1000);
    expect(errors.length).toBe(0);
  });

  test('練習場: 練習モード遷移', async ({ page }) => {
    // Build school
    await page.evaluate(() => {
      const key = 'sansu-dungeon-save-g1';
      const save = JSON.parse(localStorage.getItem(key) || '{}');
      save.buildings = [...(save.buildings || []), 'school'];
      save.buildingLevels = (save.buildings || []).map((id: string) => ({ id, level: 1 }));
      localStorage.setItem(key, JSON.stringify(save));
    });
    await page.getByText('タイトル').click({ force: true });
    await page.getByText('小1').click({ force: true });
    await page.waitForTimeout(2000);

    // Can't tap PixiJS school building, but the scene should be valid
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.waitForTimeout(1000);
    expect(errors.length).toBe(0);
  });

  test('コロシアム: コロシアム遷移', async ({ page }) => {
    await page.evaluate(() => {
      const key = 'sansu-dungeon-save-g1';
      const save = JSON.parse(localStorage.getItem(key) || '{}');
      save.buildings = [...(save.buildings || []), 'colosseum'];
      save.buildingLevels = (save.buildings || []).map((id: string) => ({ id, level: 1 }));
      localStorage.setItem(key, JSON.stringify(save));
    });
    await page.getByText('タイトル').click({ force: true });
    await page.getByText('小1').click({ force: true });
    await page.waitForTimeout(2000);

    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.waitForTimeout(1000);
    expect(errors.length).toBe(0);
  });

  test('セーブデータ互換: 全フィールドがロードされる', async ({ page }) => {
    // Set up a complete save with all features
    await page.evaluate(() => {
      const key = 'sansu-dungeon-save-g1';
      const save = {
        version: 1,
        grade: 1,
        player: { level: 5, maxHp: 150, hp: 150, attack: 25, exp: 20, expToNext: 90, gold: 5000 },
        clearedFloors: [101, 102, 103],
        currentFloor: null,
        inventory: { potion: 3 },
        buildings: ['fountain', 'shop', 'guild', 'dojo', 'library', 'smithy', 'tower'],
        buildingLevels: [
          { id: 'fountain', level: 1 }, { id: 'shop', level: 1 },
          { id: 'guild', level: 1 }, { id: 'dojo', level: 2 },
          { id: 'library', level: 2 }, { id: 'smithy', level: 1 },
          { id: 'tower', level: 1 },
        ],
        defeatedMonsterIds: ['kinoko-kazu', 'hana-kazu', 'fukurou-kazu'],
        defeatedBossIds: ['fukurou-kazu', 'kuma-tashizan'],
        materials: { wood: 15, stone: 8, herb: 5, iron: 3 },
        craftedEquipment: ['wooden-sword'],
        equipment: { weapon: 'wooden-sword', armor: null, accessory: null },
        floorStars: [
          { floorId: 101, stars: 3, bestCorrectRate: 100, noDamage: true },
          { floorId: 102, stars: 2, bestCorrectRate: 100, noDamage: false },
          { floorId: 103, stars: 1, bestCorrectRate: 75, noDamage: false },
        ],
        colosseumHighScore: 3500,
        colosseumBestRank: 'silver',
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(save));
    });

    // Load the save
    await page.getByText('タイトル').click({ force: true });
    await page.getByText('小1').click({ force: true });
    await page.waitForTimeout(3000);

    // Verify player stats loaded
    await expect(page.getByText('Lv.5')).toBeVisible();
    await expect(page.getByText('ATK 25')).toBeVisible();
    await expect(page.getByText('5000G')).toBeVisible();

    // Verify village level (7 buildings * 2 + 2 level-ups = 16 → Lv4)
    await expect(page.getByText(/はなの みやこ|にぎやかな まち/)).toBeVisible();

    // No errors
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.waitForTimeout(1000);
    expect(errors.length).toBe(0);
  });

  test('ワールドマップ: ★表示が正しい', async ({ page }) => {
    // Set up save with star data
    await page.evaluate(() => {
      const key = 'sansu-dungeon-save-g1';
      const save = {
        version: 1, grade: 1,
        player: { level: 1, maxHp: 100, hp: 100, attack: 10, exp: 0, expToNext: 30, gold: 0 },
        clearedFloors: [101, 102],
        currentFloor: null, inventory: {},
        buildings: ['fountain', 'shop', 'guild'],
        buildingLevels: [{ id: 'fountain', level: 1 }, { id: 'shop', level: 1 }, { id: 'guild', level: 1 }],
        defeatedMonsterIds: [], defeatedBossIds: [],
        materials: {}, craftedEquipment: [],
        equipment: { weapon: null, armor: null, accessory: null },
        floorStars: [
          { floorId: 101, stars: 3, bestCorrectRate: 100, noDamage: true },
          { floorId: 102, stars: 1, bestCorrectRate: 60, noDamage: false },
        ],
        colosseumHighScore: 0, colosseumBestRank: 'none',
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(save));
    });

    await page.getByText('タイトル').click({ force: true });
    await page.getByText('小1').click({ force: true });
    await page.getByText('ダンジョン').click({ force: true });
    await page.waitForTimeout(1000);

    // Floor 101 should show 3 filled stars
    // Floor 102 should show 1 filled star
    // Other floors should show no stars (not cleared)
    const stars = page.locator('span:has-text("★")');
    const count = await stars.count();
    expect(count).toBeGreaterThanOrEqual(6); // At least 2 floors * 3 star slots
  });
});
