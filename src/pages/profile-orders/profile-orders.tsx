import { ProfileOrdersUI } from '@ui-pages';
import type{ TOrder } from '@utils-types';
import { type FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { selectUserOrders, getOrders } from '../../services/orderSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const orders: TOrder[] = useSelector(selectUserOrders);

  return <ProfileOrdersUI orders={orders} />;
};