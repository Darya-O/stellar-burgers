import {
    selectFeedOrders,
    selectFeedTotal,
    selectFeedTotalToday,
} from '../../services/feedSlice';
import { useSelector } from '../../services/store';
import { FeedInfoUI } from '../ui/feed-info';

import type { TOrder } from '@utils-types';
import type { FC } from 'react';

const getOrders = (orders: TOrder[], status: string): number[] =>
    orders
        .filter((item) => item.status === status)
        .map((item) => item.number)
        .slice(0, 20);

export const FeedInfo: FC = () => {
    const orders = useSelector(selectFeedOrders);
    const total = useSelector(selectFeedTotal);
    const totalToday = useSelector(selectFeedTotalToday);

    const readyOrders = getOrders(orders, 'done');
    const pendingOrders = getOrders(orders, 'pending');

    return (
        <FeedInfoUI
            readyOrders={readyOrders}
            pendingOrders={pendingOrders}
            feed={{ total, totalToday, orders }}
        />
    );
};