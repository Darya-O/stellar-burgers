import { AppHeaderUI } from '@ui';

import { useSelector } from '../../services/store';
import { selectUser } from '../../services/userSlice';

import type { FC } from 'react';

export const AppHeader: FC = () => {
  const user = useSelector(selectUser);
  return <AppHeaderUI userName={user?.name ?? ''} />;
};
