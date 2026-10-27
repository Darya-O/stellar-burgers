import { test, expect, type Page } from '@playwright/test';
import ingredientsData from './hars/ingredients.json' with { type: 'json' };
import type { TIngredient } from '../src/utils/types';
import orderResponse from './hars/da6612e97891b4be0cd1d2f917b6364c8b67e71e.json' with { type: 'json' };

const ingredients = ingredientsData.data as TIngredient[];
const byType = (type: string) => ingredients.find((i) => i.type === type)!;

// 1. Ищем карточку по роли 'listitem' и тексту 
const cardByName = (page: Page, name: string) =>
  page.getByRole('listitem').filter({
    has: page.getByText(name, { exact: true }),
  });

// 2. Клик по кнопке "Добавить" внутри карточки
const addIngredient = (page: Page, name: string) => 
  cardByName(page, name).getByRole('button', { name: 'Добавить' }).click();

// 3. Открытие модалки по клику на ссылку 
const openIngredientModal = async (page: Page, ingredient: TIngredient) => {
  await cardByName(page, ingredient.name).getByRole('link').click();
  await expect(page.locator('#modals')).toBeVisible(); 
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

    const constructorArea = page.locator('.constructor-element');
    await expect(constructorArea.getByText(MAIN.name)).toBeVisible();
    await expect(constructorArea.getByText(SAUCE.name)).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeHidden();
  });

  test('итоговая цена пересчитывается', async ({ page }) => {
    await addIngredient(page, BUN.name);
    await addIngredient(page, MAIN.name);

    const totalPrice = page.getByTestId('total-price');
    await expect(totalPrice).toContainText(String(BUN.price * 2 + MAIN.price));
  });
});

test.describe('Модальное окно ингредиента', () => {
  test('открывается и показывает данные выбранного ингредиента', async ({ page }) => {
    await openIngredientModal(page, MAIN);

    const modal = page.locator('#modals > div').filter({
      has: page.getByRole('button', { name: 'Закрыть', exact: true })
    });

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
    
    const modal = page.locator('#modals > div').filter({
      has: page.getByRole('button', { name: 'Закрыть', exact: true })
    });

    await expect(modal).toContainText(SAUCE.name);
    await expect(modal).toContainText(String(SAUCE.calories));
    await expect(modal).not.toContainText(MAIN.name);
  });

  test('закрывается по клику на крестик', async ({ page }) => {
    await openIngredientModal(page, MAIN);
    
    const modal = page.locator('#modals > div').filter({
      has: page.getByRole('button', { name: 'Закрыть', exact: true })
    });

    await modal.getByRole('button', { name: 'Закрыть', exact: true }).click(); 

    await expect(modal).toBeHidden();
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

    const modal = page.locator('#modals > div').filter({
      has: page.getByRole('button', { name: 'Закрыть', exact: true })
    });
    await expect(modal).toBeVisible();
    
    // Проверяем номер заказа 
    await expect(
    modal.getByText(String(orderResponse.order.number), { exact: true })
  ).toBeVisible({ timeout: 30000 });

    await modal.getByRole('button', { name: 'Закрыть', exact: true }).click();
    await expect(modal).toBeHidden();

    // Проверяем, что конструктор пуст и цена 0
    await expect(page.getByText('Выберите булки')).toHaveCount(2);
    await expect(page.getByText('Выберите начинку')).toBeVisible();
    
    const totalPrice = page.getByTestId('total-price');
    await expect(totalPrice).toHaveText('0');
  });
});