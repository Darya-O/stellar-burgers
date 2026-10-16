import { type FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { selectIngredients } from '../../services/ingredientsSlice';
import { fetchOrderByNumber, selectViewedOrder } from '../../services/orderSlice';
import { useDispatch, useSelector } from '../../services/store';
import { OrderInfoUI } from '../ui/order-info';
import { Preloader } from '../ui/preloader';

import type { TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  useEffect((): void => {
    void dispatch(fetchOrderByNumber(Number(number)));
  }, [number, dispatch]);

  const orderData = useSelector(selectViewedOrder);
  const ingredients = useSelector(selectIngredients);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string | number) => {
        if (!acc[item]) {
          const ingredient = ingredients.find(
            (ing: { _id: string | number }) => ing._id === item
          );
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
