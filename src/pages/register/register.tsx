import { RegisterUI } from '@ui-pages';
import { type FC, type SyntheticEvent, useState } from 'react';

import { useDispatch } from '../../services/store';
import { registerUser } from '../../services/userSlice';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const [name, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(registerUser({ name, email, password }));
  };

  return (
    <RegisterUI
      errorText=""
      email={email}
      userName={name}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
