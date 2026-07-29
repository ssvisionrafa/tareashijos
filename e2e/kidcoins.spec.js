import { test, expect } from '@playwright/test';

const clearStorage = async (page) => {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
};

const completeOnboarding = async (page, kids = [{ name: 'Lucía', age: '8', weeklyGoal: '10' }]) => {
  await page.fill('input[placeholder="Ej: Familia Aguilar"]', 'Familia Test');
  await page.getByRole('button', { name: /Siguiente/i }).click();
  await expect(page.locator('text=Añade a tus hijos')).toBeVisible({ timeout: 10000 });

  for (const kid of kids) {
    await page.fill('input[name="name"]', kid.name);
    await page.fill('input[name="age"]', kid.age);
    await page.fill('input[name="weeklyGoal"]', kid.weeklyGoal || '10');
    await page.getByRole('button', { name: 'Añadir hijo' }).click();
  }

  await page.getByRole('button', { name: 'Comenzar' }).click();
  await expect(page.locator(`text=¡Hola, ${kids[0].name}!`)).toBeVisible({ timeout: 10000 });
};

const enterParentMode = async (page) => {
  await page.getByRole('button', { name: 'Padres' }).click();
  const entrarButton = page.getByRole('button', { name: 'Entrar' });
  if (await entrarButton.isVisible().catch(() => false)) {
    await entrarButton.click();
  }
};

const addReward = async (page, { name, description, price }) => {
  await page.getByRole('button', { name: /Recompensas/i }).click();
  await page.fill('input[placeholder="Ej: Helado"]', name);
  await page.fill('input[placeholder="Breve descripción"]', description);
  await page.locator('form input[type="number"]').first().fill(price);
  await page.locator('form button:has-text("Añadir recompensa")').click();
  await page.locator('div.fixed.inset-0 button').first().click();
};

const markFirstTaskDone = async (page) => {
  await page.locator('button:has-text("Hecho")').first().click();
  await expect(page.locator('text=Esperando aprobación')).toBeVisible();
};

const approveFirstPendingTask = async (page) => {
  await enterParentMode(page);
  await page.locator('button:has-text("Aprobar y Abonar")').first().click();
};

const acceptNextDialog = (page) => {
  page.once('dialog', dialog => dialog.accept());
};

test.describe('KidCoins E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearStorage(page);
    await page.evaluate(() => {
      localStorage.setItem('kid_reward_family_id', `TEST-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    });
    await page.reload();
  });

  test('muestra onboarding al inicio sin datos', async ({ page }) => {
    await expect(page.locator('text=Bienvenido a KidCoins')).toBeVisible({ timeout: 10000 });
  });

  test('completa onboarding y crea familia con un hijo', async ({ page }) => {
    await completeOnboarding(page);
  });

  test('marca tarea como hecha y padre puede aprobarla', async ({ page }) => {
    await completeOnboarding(page);
    await markFirstTaskDone(page);
    await approveFirstPendingTask(page);

    await page.getByRole('button', { name: 'Niños' }).click();
    await expect(page.locator('text=¡Completada y Sumada!')).toBeVisible();
  });

  test('padre añade recompensa y niño puede verla en la tienda', async ({ page }) => {
    await completeOnboarding(page);
    await enterParentMode(page);
    await addReward(page, { name: 'Helado', description: 'Un helado de fresa', price: '2.00' });

    await page.getByRole('button', { name: 'Niños' }).click();
    await page.getByRole('button', { name: /Tienda/i }).click();
    await expect(page.locator('h4:has-text("Helado")')).toBeVisible();
  });

  test('cambia a vista semanal', async ({ page }) => {
    await completeOnboarding(page);
    await page.getByRole('button', { name: /Sem/i }).click();
    await expect(page.locator('text=Vista semanal:')).toBeVisible();
  });

  test('rechaza PIN incorrecto en modo padres', async ({ page }) => {
    await completeOnboarding(page);
    await page.getByRole('button', { name: 'Padres' }).click();
    await page.fill('input[type="password"]', '9999');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.locator('text=PIN Incorrecto')).toBeVisible();
  });

  test('padre añade tarea personalizada y el niño la ve', async ({ page }) => {
    await completeOnboarding(page);
    await enterParentMode(page);

    await page.locator('[data-testid="open-add-task"]').click();
    await page.fill('input[placeholder="Ej: Leer 20 minutos"]', 'Tarea personalizada');
    await page.fill('textarea[placeholder="Describe en qué consiste la tarea..."]', 'Descripción test');
    await page.locator('form input[type="number"]').first().fill('1.50');
    await page.locator('[data-testid="submit-task"]').scrollIntoViewIfNeeded();
    await page.locator('[data-testid="submit-task"]').click({ force: true });

    await page.getByRole('button', { name: 'Niños' }).click();
    await expect(page.locator('text=Tarea personalizada')).toBeVisible();
  });

  test('niño compra recompensa y padre aprueba la compra', async ({ page }) => {
    await completeOnboarding(page);

    await markFirstTaskDone(page);
    await approveFirstPendingTask(page);

    await page.getByRole('button', { name: 'Niños' }).click();
    await expect(page.locator('text=¡Completada y Sumada!')).toBeVisible();

    await enterParentMode(page);
    await addReward(page, { name: 'Chuche', description: 'Una chuche', price: '0.10' });

    await page.getByRole('button', { name: 'Niños' }).click();
    await page.getByRole('button', { name: /Tienda/i }).click();
    await page.locator('button:has-text("Pedir recompensa")').first().click();

    await page.getByRole('button', { name: 'Padres' }).click();
    await page.locator('button:has-text("Aprobar compra")').first().click();
    await expect(page.locator('text=Compra aprobada')).toBeVisible();
  });

  test('cambia entre dos perfiles de hijos y cada uno tiene su objetivo semanal', async ({ page }) => {
    await completeOnboarding(page, [
      { name: 'Lucía', age: '8', weeklyGoal: '12' },
      { name: 'Mateo', age: '6', weeklyGoal: '8' }
    ]);

    await expect(page.locator('text=¡Hola, Lucía!')).toBeVisible();
    await expect(page.locator('[data-testid="weekly-goal-display"]')).toHaveText('Objetivo semanal: 12.00 € completando tus tareas');
    await page.getByRole('button', { name: 'Mateo' }).click();
    await expect(page.locator('text=¡Hola, Mateo!')).toBeVisible();
    await expect(page.locator('[data-testid="weekly-goal-display"]')).toHaveText('Objetivo semanal: 8.00 € completando tus tareas');
  });

  test('padre reinicia la semana y las tareas vuelven a pendiente', async ({ page }) => {
    await completeOnboarding(page);
    await markFirstTaskDone(page);
    await approveFirstPendingTask(page);

    await page.getByRole('button', { name: 'Niños' }).click();
    await expect(page.locator('text=¡Completada y Sumada!')).toBeVisible();

    await enterParentMode(page);
    acceptNextDialog(page);
    await page.getByRole('button', { name: /Reiniciar semana/i }).click();

    await page.getByRole('button', { name: 'Niños' }).click();
    await expect(page.locator('button:has-text("Hecho")').first()).toBeVisible();
    await expect(page.locator('text=¡Completada y Sumada!')).not.toBeVisible();
  });

  test('padre edita una tarea por defecto incluyendo la recompensa', async ({ page }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
    await completeOnboarding(page);
    await enterParentMode(page);
    await page.getByRole('button', { name: 'Niños' }).click();

    await page.locator('[data-testid="edit-task"]').first().click();
    await expect(page.locator('text=Editar Tarea')).toBeVisible({ timeout: 5000 });
    await page.fill('input[placeholder="Ej: Leer 20 minutos"]', 'Tarea editada');
    await page.fill('textarea[placeholder="Describe en qué consiste la tarea..."]', 'Descripción editada');
    await page.locator('form input[type="number"]').first().fill('2.50');
    await page.locator('[data-testid="submit-task"]').scrollIntoViewIfNeeded();
    await page.locator('[data-testid="submit-task"]').click({ force: true });

    await expect(page.locator('text=Tarea editada')).toBeVisible();
    await expect(page.locator('text=+2.50€')).toBeVisible();
  });

  test('padre edita el objetivo semanal', async ({ page }) => {
    await completeOnboarding(page);
    await page.locator('[data-testid="edit-weekly-goal"]').click();
    await page.locator('[data-testid="weekly-goal-input"]').fill('15');
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-testid="weekly-goal-display"]')).toHaveText('Objetivo semanal: 15.00 € completando tus tareas');
  });

  test('activa y desactiva modo oscuro', async ({ page }) => {
    await completeOnboarding(page);
    await page.locator('button:has(.lucide-moon)').click();
    await expect(page.locator('.dark')).toHaveCount(1);
    await page.locator('button:has(.lucide-sun)').click();
    await expect(page.locator('.dark')).toHaveCount(0);
  });
});
