import { ProfileOrdersUI } from '@ui-pages';
import { type FC, useEffect } from 'react';

import { selectUserOrders, getOrders } from '../../services/orderSlice';
import { useSelector, useDispatch } from '../../services/store';

import type { TOrder } from '@utils-types';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrders()).catch((err) => {
      console.error('Ошибка загрузки заказов:', err);
    });
  }, [dispatch]);

  const orders: TOrder[] = useSelector(selectUserOrders);

  return <ProfileOrdersUI orders={orders} />;
};
