import { test, expect } from '@playwright/test';

test.describe('さんすうダンジョン E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  // ==================== Title ====================
  test('タイトル画面が表示される', async ({ page }) => {
    await expect(page.getByText('さんすうダンジョン')).toBeVisible();
    await expect(page.getByText('小1')).toBeVisible();
    await expect(page.getByText('小4')).toBeVisible();
  });

  // ==================== Base (Village) ====================
  test('小1 → 拠点に遷移', async ({ page }) => {
    await page.getByText('小1').click({ force: true });
    await expect(page.getByText(/Lv\.\d/)).toBeVisible();
    await expect(page.getByText('もちもの')).toBeVisible();
    await expect(page.getByText('ダンジョン')).toBeVisible();
    await expect(page.getByText('タイトル')).toBeVisible();
  });

  test('小4 → 拠点に遷移', async ({ page }) => {
    await page.getByText('小4').click({ force: true });
    await expect(page.getByText(/Lv\.\d/)).toBeVisible();
  });

  test('拠点: コンソールエラーなし', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.getByText('小1').click({ force: true });
    await page.waitForTimeout(3000);
    expect(errors.length).toBe(0);
  });

  // ==================== World Map ====================
  test('ワールドマップ遷移 + フロア表示', async ({ page }) => {
    await page.getByText('小1').click({ force: true });
    await page.getByText('ダンジョン').click({ force: true });
    await expect(page.getByText('ワールドマップ')).toBeVisible();
    await expect(page.getByText('かずのもり')).toBeVisible();
    await expect(page.getByText('たしざんのはら')).toBeVisible();
  });

  test('ワールドマップ: 難易度切替', async ({ page }) => {
    await page.getByText('小1').click({ force: true });
    await page.getByText('ダンジョン').click({ force: true });
    await expect(page.getByText('ふつう')).toBeVisible();
    await page.getByText(/むずかしい/).click({ force: true });
  });

  test('ワールドマップ: 新フロアが表示される', async ({ page }) => {
    await page.getByText('小1').click({ force: true });
    await page.getByText('ダンジョン').click({ force: true });
    await expect(page.getByText('たしざんのやま')).toBeVisible();
    await expect(page.getByText('ひきざんのそら')).toBeVisible();
    await expect(page.getByText('しきづくりのまち')).toBeVisible();
  });

  test('ワールドマップ: 小4新フロア表示', async ({ page }) => {
    await page.getByText('小4').click({ force: true });
    await page.getByText('ダンジョン').click({ force: true });
    await expect(page.getByText('筆算のくふう')).toBeVisible();
    await expect(page.getByText('かけ算のしろ')).toBeVisible();
    await expect(page.getByText('小数の計算')).toBeVisible();
  });

  // ==================== Dungeon ====================
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
    await expect(page.getByText(/Lv\.\d/)).toBeVisible();
  });

  // ==================== Shop ====================
  test('もちものパネルが開く', async ({ page }) => {
    await page.getByText('小1').click({ force: true });
    await page.getByText('もちもの').click({ force: true });
    await expect(page.getByText('もっているアイテム')).toBeVisible();
  });

  // ==================== タイトル戻り ====================
  test('タイトルに戻れる', async ({ page }) => {
    await page.getByText('小1').click({ force: true });
    await page.getByText('タイトル').click({ force: true });
    await expect(page.getByText('さんすうダンジョン')).toBeVisible();
  });

  // ==================== Star display ====================
  test('ワールドマップ: ★表示あり(クリア前は★なし)', async ({ page }) => {
    await page.getByText('小1').click({ force: true });
    await page.getByText('ダンジョン').click({ force: true });
    // All floors should show ★ at opacity 0.2 (not cleared yet)
    const stars = page.locator('span:has-text("★")');
    await expect(stars.first()).toBeVisible();
  });
});
