import { ResetPasswordUI } from '@ui-pages';
import { type FC, type SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '../../services/store';
import { clearError, resetPassword, selectUserError } from '../../services/userSlice';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const error = useSelector(selectUserError);
  const dispatch = useDispatch();

  useEffect(() => {
    void dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    dispatch(resetPassword({ password, token }))
      .unwrap()
      .then(() => {
        localStorage.removeItem('resetRequested');
        navigate('/login', { replace: true });
      })
      .catch((err) => {
        console.error('Ошибка сброса пароля:', err);
      });
  };

  useEffect((): void => {
    if (!localStorage.getItem('resetRequested')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error ?? undefined}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
