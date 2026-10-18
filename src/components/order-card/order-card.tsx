import { type FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { selectIngredients } from '../../services/ingredientsSlice';
import { useSelector } from '../../services/store';
import { OrderCardUI } from '../ui/order-card';

import type { OrderCardProps } from './type';
import type { TIngredient } from '@utils-types';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(function OrderCard({ order }) {
  const location = useLocation();
  const ingredients = useSelector(selectIngredients);
  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    const ingredientsInfo = order.ingredients.reduce<TIngredient[]>((acc, item) => {
      const ingredient = ingredients.find((ing) => ing._id === item);
      if (ingredient) return [...acc, ingredient];
      return acc;
    }, []);

    const total = ingredientsInfo.reduce<number>((acc, item) => acc + item.price, 0);

    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    const date = new Date(order.createdAt);
    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date,
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
