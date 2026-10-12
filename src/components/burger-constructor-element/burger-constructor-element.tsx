import{ memo, type FC } from 'react';
import { useDispatch } from '../../services/store';
import { BurgerConstructorElementUI } from '@ui';
import type { BurgerConstructorElementProps } from './type';
import {
  removeIngredient,
  moveIngredient
} from '../../services/constructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

   const handleMoveDown = () => {
    dispatch(moveIngredient({ index, direction: 'down' }));
};

const handleMoveUp = () => {
    dispatch(moveIngredient({ index, direction: 'up' }));
};

    const handleClose = () => {
    dispatch(removeIngredient(ingredient.id));
};

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
