import { test, expect } from '@playwright/test'

test('[WEB-LOGIN-001] Entrar com email e senha válidos', { tag: ['@p0', '@smoke'] }, async ({ page }) => {
  await page.goto('/login')
  await page.getByTestId('login-email').fill('qa@acme.test')
  await page.getByTestId('login-password').fill(process.env.TEST_PASSWORD)
  await page.getByTestId('login-submit').click()

  await expect(page).toHaveURL('/')
  await expect(page.getByTestId('dashboard-title')).toHaveText('Dashboard')
  await expect(page.getByTestId('current-user')).toHaveText('QA Acme')
  await expect(page.getByTestId('current-tenant-name')).toHaveText('Acme Corporation')
})
