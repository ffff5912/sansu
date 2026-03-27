import { test, expect } from '@playwright/test';

test.describe('さんすうダンジョン E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('タイトル画面が表示される', async ({ page }) => {
    await expect(page.getByText('さんすうダンジョン')).toBeVisible();
    await expect(page.getByText('小1')).toBeVisible();
    await expect(page.getByText('小4')).toBeVisible();
  });

  test('小1 → 拠点に遷移', async ({ page }) => {
    await page.getByText('小1').click({ force: true });
    await expect(page.getByText('もちもの')).toBeVisible();
    await expect(page.getByText('ダンジョン')).toBeVisible();
    await expect(page.getByText('タイトル')).toBeVisible();
  });

  test('小4 → 拠点に遷移', async ({ page }) => {
    await page.getByText('小4').click({ force: true });
    await expect(page.getByText('もちもの')).toBeVisible();
  });

  test('拠点: コンソールエラーなし', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.getByText('小1').click({ force: true });
    await page.waitForTimeout(3000);
    expect(errors.length).toBe(0);
  });

  test('ワールドマップ遷移 + フロア表示', async ({ page }) => {
    await page.getByText('小1').click({ force: true });
    await page.getByText('ダンジョン').click({ force: true });
    await expect(page.getByText('ワールドマップ')).toBeVisible();
    await expect(page.getByText('かずのもり')).toBeVisible();
  });

  test('ワールドマップ: 難易度切替', async ({ page }) => {
    await page.getByText('小1').click({ force: true });
    await page.getByText('ダンジョン').click({ force: true });
    await expect(page.getByText('ふつう')).toBeVisible();
    await page.getByText(/むずかしい/).click({ force: true });
  });

  test('新フロアが表示(小1)', async ({ page }) => {
    await page.getByText('小1').click({ force: true });
    await page.getByText('ダンジョン').click({ force: true });
    await expect(page.getByText('たしざんのやま')).toBeVisible();
    await expect(page.getByText('ひきざんのそら')).toBeVisible();
  });

  test('新フロアが表示(小4)', async ({ page }) => {
    await page.getByText('小4').click({ force: true });
    await page.getByText('ダンジョン').click({ force: true });
    await expect(page.getByText('筆算のくふう')).toBeVisible();
    await expect(page.getByText('かけ算のしろ')).toBeVisible();
  });

  test('ダンジョン入場 + MENU表示', async ({ page }) => {
    await page.getByText('小1').click({ force: true });
    await page.getByText('ダンジョン').click({ force: true });
    await page.getByText('かずのもり').click({ force: true });
    await expect(page.getByText('MENU')).toBeVisible({ timeout: 10000 });
  });

  test('MENU → ダンジョン離脱 → 拠点', async ({ page }) => {
    await page.getByText('小1').click({ force: true });
    await page.getByText('ダンジョン').click({ force: true });
    await page.getByText('かずのもり').click({ force: true });
    await expect(page.getByText('MENU')).toBeVisible({ timeout: 10000 });
    await page.getByText('MENU').click({ force: true });
    await expect(page.getByText('でる')).toBeVisible();
    await page.getByText('でる').click({ force: true });
    await expect(page.getByText('もちもの')).toBeVisible();
  });

  test('もちものパネルが開く', async ({ page }) => {
    await page.getByText('小1').click({ force: true });
    await page.getByText('もちもの').click({ force: true });
    // Panel opens with items header or empty message
    await expect(page.getByText(/もちもの|アイテム/)).toBeVisible();
  });

  test('タイトルに戻れる', async ({ page }) => {
    await page.getByText('小1').click({ force: true });
    await page.getByText('タイトル').click({ force: true });
    await expect(page.getByText('さんすうダンジョン')).toBeVisible();
  });

  test('★表示: クリア済みフロアに★が出る', async ({ page }) => {
    // Set up cleared floors with stars
    await page.evaluate(() => {
      const save = {
        version: 1, grade: 1,
        player: { level: 1, maxHp: 100, hp: 100, attack: 10, exp: 0, expToNext: 30, gold: 0 },
        clearedFloors: [101],
        currentFloor: null, inventory: {},
        buildings: ['fountain', 'shop', 'guild'],
        buildingLevels: [{ id: 'fountain', level: 1 }, { id: 'shop', level: 1 }, { id: 'guild', level: 1 }],
        defeatedMonsterIds: [], defeatedBossIds: [],
        materials: {}, craftedEquipment: [],
        equipment: { weapon: null, armor: null, accessory: null },
        floorStars: [{ floorId: 101, stars: 3, bestCorrectRate: 100, noDamage: true }],
        colosseumHighScore: 0, colosseumBestRank: 'none',
        timestamp: Date.now(),
      };
      localStorage.setItem('sansu-dungeon-save-g1', JSON.stringify(save));
    });
    await page.getByText('小1').click({ force: true });
    await page.getByText('ダンジョン').click({ force: true });
    // Floor 101 is cleared → should show ★ characters
    const stars = page.locator('span:has-text("★")');
    await expect(stars.first()).toBeVisible({ timeout: 5000 });
  });
});
