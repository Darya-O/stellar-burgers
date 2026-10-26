import { test, expect, type Page } from '@playwright/test';
import ingredientsData from './hars/ingredients.json' with { type: 'json' };
import type { TIngredient } from '../src/utils/types';

const ingredients = ingredientsData.data as TIngredient[];
const byType = (type: string) => ingredients.find((i) => i.type === type)!;

// Ищем карточку ингредиента
const addIngredient = (page: Page, name: string) => {
  const card = page.locator('.Burger-ingredient').filter({ hasText: name });
  return card.getByRole('button', { name: 'Добавить' }).click();
};

const openIngredientModal = async (page: Page, ingredient: TIngredient) => {
  const card = page.locator('.Burger-ingredient').filter({ hasText: ingredient.name });
  await card.click();
  await expect(page.locator('.Modal_modal__container__1aE8y')).toBeVisible(); 
};

const BUN = byType('bun');
const MAIN = byType('main');
const SAUCE = byType('sauce');

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false
  });

  await page.routeFromHAR('tests/hars/order.har', {
    url: '**/api/orders',
    update: false
  });

  await page.goto('/');
  await expect(page.getByText('Соберите бургер')).toBeVisible();
});

test.describe('Добавление ингредиентов в конструктор', () => {
  test('булка добавляется в верхнюю и нижнюю позиции', async ({ page }) => {
    await expect(page.getByText('Выберите булки')).toHaveCount(2);

    await addIngredient(page, BUN.name);

    // Ищем текст названия булки в конструкторе 
    const constructorArea = page.locator('.constructor-element'); 
    await expect(constructorArea.getByText(`${BUN.name} (верх)`)).toBeVisible();
    await expect(constructorArea.getByText(`${BUN.name} (низ)`)).toBeVisible();
    
    await expect(page.getByText('Выберите булки')).toHaveCount(0);
  });

  test('начинка и соус добавляются в список', async ({ page }) => {
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await addIngredient(page, MAIN.name);
    await addIngredient(page, SAUCE.name);

    // Проверяем, что названия появились на странице в блоке конструктора
    const constructorArea = page.locator('.constructor-element');
    await expect(constructorArea.getByText(MAIN.name)).toBeVisible();
    await expect(constructorArea.getByText(SAUCE.name)).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeHidden();
  });

  test('итоговая цена пересчитывается', async ({ page }) => {
    await addIngredient(page, BUN.name);
    await addIngredient(page, MAIN.name);

    // Ищем блок с ценой 
    const totalPrice = page.locator('.constructor-element__price');
    await expect(totalPrice).toContainText(String(BUN.price * 2 + MAIN.price));
  });
});

test.describe('Модальное окно ингредиента', () => {
  test('открывается и показывает данные выбранного ингредиента', async ({ page }) => {
    await openIngredientModal(page, MAIN);
    const modal = page.locator('.Modal_modal__container__1aE8y');

    await expect(modal).toContainText('Детали ингредиента');
    await expect(modal).toContainText(MAIN.name);
    await expect(modal).toContainText(String(MAIN.calories));
    await expect(modal).toContainText(String(MAIN.proteins));
    await expect(modal).toContainText(String(MAIN.fat));
    await expect(modal).toContainText(String(MAIN.carbohydrates));
    await expect(modal).not.toContainText(SAUCE.name);
  });

  test('показывает данные другого ингредиента при клике по нему', async ({ page }) => {
    await openIngredientModal(page, SAUCE);
    const modal = page.locator('.Modal_modal__container__1aE8y');

    await expect(modal).toContainText(SAUCE.name);
    await expect(modal).toContainText(String(SAUCE.calories));
    await expect(modal).not.toContainText(MAIN.name);
  });

  test('закрывается по клику на крестик', async ({ page }) => {
    await openIngredientModal(page, MAIN);

    await page.locator('.Modal_modal__close__1p5m_').click(); 

    await expect(page.locator('.Modal_modal__container__1aE8y')).toBeHidden();
  });
});

test.describe('Оформление заказа', () => {
  test('заказ создаётся, конструктор очищается, модалка закрывается', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTdlNTA4NmExNzJkMDAxYjk5NGYwMSIsImlhdCI6MTc4OTQ4MTE5MywiZXhwIjoxNzg5NDgyMzkzfQ.9oDq0JfdnDtkFJZkIM6V9gK5SyuZKYItXLFHcSI-9LI',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.addInitScript(() =>
      localStorage.setItem('refreshToken', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTdlNTA4NmExNzJkMDAxYjk5NGYwMSIsImlhdCI6MTc4OTQ4MTE5MywiZXhwIjoxNzg5NDgyMzkzfQ.9oDq0JfdnDtkFJZkIM6V9gK5SyuZKYItXLFHcSI-9LI')
    );

    await page.routeFromHAR('tests/hars/user.har', {
      url: '**/api/auth/user',
      update: true
    });

    await page.goto('/');

    await addIngredient(page, BUN.name);
    await addIngredient(page, MAIN.name);
    await addIngredient(page, SAUCE.name);

    // Кнопка оформления заказа 
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.locator('.Modal_modal__container__1aE8y');
    await expect(modal).toBeVisible();
    
    // Проверяем номер заказа 
    await expect(modal).toContainText('110253', { timeout: 30000 });

    await page.locator('.Modal_modal__close__1p5m_').click();
    await expect(modal).toBeHidden();

    // Проверяем, что конструктор пуст
    await expect(page.getByText('Выберите булки')).toHaveCount(2);
    await expect(page.getByText('Выберите начинку')).toBeVisible();
    await expect(page.locator('.constructor-element__price')).toHaveText('0');
  });
});