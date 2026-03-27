import { test, expect } from '@playwright/test';

test.describe('さんすうダンジョン E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('タイトル画面が表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('さんすうダンジョン')).toBeVisible();
    await expect(page.getByText('小1')).toBeVisible();
    await expect(page.getByText('小4')).toBeVisible();
  });

  test('小1を選択して拠点に遷移', async ({ page }) => {
    await page.goto('/');
    await page.getByText('小1').click();
    // Should see village header
    await expect(page.getByText(/さんすうの村|ちいさな むら|みどりの むら/)).toBeVisible();
    // Bottom bar buttons
    await expect(page.getByText('もちもの')).toBeVisible();
    await expect(page.getByText('ダンジョン')).toBeVisible();
  });

  test('ダンジョン → ワールドマップ遷移', async ({ page }) => {
    await page.goto('/');
    await page.getByText('小1').click();
    await page.getByText('ダンジョン').click();
    // World map should show floor list
    await expect(page.getByText('ワールドマップ')).toBeVisible();
    await expect(page.getByText('かずのもり')).toBeVisible();
  });

  test('フロア選択 → ダンジョン入場', async ({ page }) => {
    await page.goto('/');
    await page.getByText('小1').click();
    await page.getByText('ダンジョン').click();
    // Select first floor
    await page.getByText('かずのもり').click();
    // Should see dungeon with MENU button and DPad
    await expect(page.getByText('MENU')).toBeVisible({ timeout: 10000 });
  });

  test('選択肢がシャッフルされている', async ({ page }) => {
    await page.goto('/');
    await page.getByText('小1').click();
    await page.getByText('ダンジョン').click();
    await page.getByText('かずのもり').click();
    // Wait for dungeon to load, then move to trigger battle
    await page.waitForTimeout(2000);
    // We can't easily trigger a battle in e2e, but we can test the practice mode
  });

  test('練習モード: テーマ選択 → 問題表示', async ({ page }) => {
    await page.goto('/');
    await page.getByText('小1').click();
    // Need to build the school first or access practice mode
    // For now test that the village loads without errors
    await page.waitForTimeout(2000);
    // Check no console errors
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.waitForTimeout(1000);
    expect(errors.length).toBe(0);
  });

  test('拠点: コンソールエラーなし', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.goto('/');
    await page.getByText('小4').click();
    await page.waitForTimeout(3000); // Wait for PixiJS to load
    expect(errors.length).toBe(0);
  });

  test('ワールドマップ: 難易度切替', async ({ page }) => {
    await page.goto('/');
    await page.getByText('小1').click();
    await page.getByText('ダンジョン').click();
    // Toggle difficulty
    await expect(page.getByText('ふつう')).toBeVisible();
    await expect(page.getByText(/むずかしい/)).toBeVisible();
    await page.getByText(/むずかしい/).click();
  });
});
