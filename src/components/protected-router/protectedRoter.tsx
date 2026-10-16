import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store';

import type React from 'react';

type ProtectedRouteProps = {
  children: React.ReactNode;
  onlyUnAuth?: boolean;
};

type TLocationState = {
  from?: { pathname?: string };
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
}: ProtectedRouteProps): React.ReactNode => {
  const { isAuthChecked, user } = useSelector((state) => state.user);
  const location = useLocation();
  const state = location.state as TLocationState | null;

  if (!isAuthChecked) {
    return <Preloader />;
  }

  const isAuthenticated = !!user;

  if (onlyUnAuth && isAuthenticated) {
    return <Navigate to={state?.from?.pathname ?? '/'} replace />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
