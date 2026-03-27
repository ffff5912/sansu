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

  test('小1を選択して拠点に遷移', async ({ page }) => {
    // force:true to bypass pulse animation stability check
    await page.getByText('小1').click({ force: true });
    await expect(page.getByText(/さんすうの村|ちいさな むら|みどりの むら/)).toBeVisible();
    await expect(page.getByText('もちもの')).toBeVisible();
    await expect(page.getByText('ダンジョン')).toBeVisible();
  });

  test('ダンジョン → ワールドマップ遷移', async ({ page }) => {
    await page.getByText('小1').click({ force: true });
    await page.getByText('ダンジョン').click({ force: true });
    await expect(page.getByText('ワールドマップ')).toBeVisible();
    await expect(page.getByText('かずのもり')).toBeVisible();
  });

  test('フロア選択 → ダンジョン入場', async ({ page }) => {
    await page.getByText('小1').click({ force: true });
    await page.getByText('ダンジョン').click({ force: true });
    await page.getByText('かずのもり').click({ force: true });
    await expect(page.getByText('MENU')).toBeVisible({ timeout: 10000 });
  });

  test('小4を選択して拠点に遷移', async ({ page }) => {
    await page.getByText('小4').click({ force: true });
    await expect(page.getByText(/さんすうの村|ちいさな むら|みどりの むら/)).toBeVisible();
  });

  test('拠点: コンソールエラーなし', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.getByText('小4').click({ force: true });
    await page.waitForTimeout(3000);
    expect(errors.length).toBe(0);
  });

  test('ワールドマップ: 難易度切替', async ({ page }) => {
    await page.getByText('小1').click({ force: true });
    await page.getByText('ダンジョン').click({ force: true });
    await expect(page.getByText('ふつう')).toBeVisible();
    await expect(page.getByText(/むずかしい/)).toBeVisible();
    await page.getByText(/むずかしい/).click({ force: true });
  });

  test('MENUからダンジョン離脱', async ({ page }) => {
    await page.getByText('小1').click({ force: true });
    await page.getByText('ダンジョン').click({ force: true });
    await page.getByText('かずのもり').click({ force: true });
    await expect(page.getByText('MENU')).toBeVisible({ timeout: 10000 });
    await page.getByText('MENU').click({ force: true });
    await expect(page.getByText('でる')).toBeVisible();
    await page.getByText('でる').click({ force: true });
    // Should return to base
    await expect(page.getByText(/さんすうの村|ちいさな むら|みどりの むら/)).toBeVisible();
  });
});
