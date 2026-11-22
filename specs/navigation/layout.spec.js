import { expect, test } from '@playwright/test'

test('[WEB-NAV-001] Cada item do menu abre a tela correta', { tag: ['@p1'] }, async ({ page }) => {
    await page.goto('/login')
    await page.getByTestId('login-email').fill('qa@acme.test')
    await page.getByTestId('login-password').fill(process.env.TEST_PASSWORD)
    await page.getByTestId('login-submit').click()
    await expect(page.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeVisible()
    await expect(page.locator('[aria-current="page"]')).toHaveText('Dashboard')

    await page.goto('/tasks')
    await expect(page.getByRole('heading', { name: 'Tarefas', level: 1 })).toBeVisible()
    await expect(page.locator('[aria-current="page"]')).toHaveText('Tarefas')

    await page.goto('/users')
    await expect(page.getByRole('heading', { name: 'Usuários', level: 1 })).toBeVisible()
    await expect(page.locator('[aria-current="page"]')).toHaveText('Usuários')

    await page.goto('/products')
    await expect(page.getByRole('heading', { name: 'Produtos', level: 1 })).toBeVisible()
    await expect(page.locator('[aria-current="page"]')).toHaveText('Produtos')

    await page.goto('/orders')
    await expect(page.getByRole('heading', { name: 'Pedidos', level: 1 })).toBeVisible()
    await expect(page.locator('[aria-current="page"]')).toHaveText('Pedidos')

    await page.goto('/notifications')
    await expect(page.getByRole('heading', { name: 'Notificações', level: 1 })).toBeVisible()
    await expect(page.locator('[aria-current="page"]')).toHaveText('Notificações')

    await page.goto('/settings')
    await expect(page.getByRole('heading', { name: 'Configurações', level: 1 })).toBeVisible()
    await expect(page.locator('[aria-current="page"]')).toHaveText('Configurações')

})