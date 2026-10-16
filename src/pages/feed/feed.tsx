import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { type FC, useEffect } from 'react';

import { getFeeds, selectFeedOrders } from '../../services/feedSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { TOrder } from '@utils-types';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    void dispatch(getFeeds());
  }, [dispatch]);

  const orders: TOrder[] = useSelector(selectFeedOrders);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        void dispatch(getFeeds());
      }}
    />
  );
};
