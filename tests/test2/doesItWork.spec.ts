import { test, expect } from '@playwright/test';

export default function createTests() {
    test('test 1 equal 1', async ({ page }) => {
        await expect(1).toEqual(1)
    });

    test('test 1 not equal 2', async ({ page }) => {
        await expect(1).toBeLessThanOrEqual(2)
    });
}