import { type FC, type SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../services/store';
import { updateUser, clearError } from '../../services/userSlice';
import { ProfileUI } from './profile';

export const Profile: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user.user);
    const updateUserError = useSelector(
        (state: RootState) => state.user.error
    );

    // Локальное состояние формы — черновик
    const [formValue, setFormValue] = useState({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
    });

    // Синхронизируем форму, когда пользователь загрузился или изменился
    useEffect(() => {
        setFormValue({
            name: user?.name ?? '',
            email: user?.email ?? '',
            password: '',
        });
    }, [user]);

    // Очищаем ошибку при монтировании
    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    // Проверяем, изменилась ли форма
    const isFormChanged =
        formValue.name !== (user?.name ?? '') ||
        formValue.email !== (user?.email ?? '') ||
        formValue.password !== '';

    // Обработка ввода
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormValue({ ...formValue, [e.target.name]: e.target.value });
    };

    // Отправка формы
    const handleSubmit = (e: SyntheticEvent): void => {
        e.preventDefault();
        void dispatch(updateUser(formValue));
    };

    // Сброс формы к исходным данным пользователя
    const handleCancel = (): void => {
        setFormValue({
            name: user?.name ?? '',
            email: user?.email ?? '',
            password: '',
        });
        dispatch(clearError());
    };

    return (
        <ProfileUI
    formValue={formValue}
    isFormChanged={isFormChanged}
    updateUserError={updateUserError ?? undefined}
    handleSubmit={handleSubmit}
    handleCancel={handleCancel}
    handleInputChange={handleInputChange}
    />
    );
};