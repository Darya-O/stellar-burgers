import { BurgerConstructorElementUI } from '@ui';
import { memo, type FC } from 'react';

import { removeIngredient, moveIngredient } from '../../services/constructorSlice';
import { useDispatch } from '../../services/store';

import type { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  function BurgerConstructorElement({ ingredient, index, totalItems }) {
    const dispatch = useDispatch();

    const handleMoveDown = (): void => {
      dispatch(moveIngredient({ index, direction: 'down' }));
    };

    const handleMoveUp = (): void => {
      dispatch(moveIngredient({ index, direction: 'up' }));
    };

    const handleClose = (): void => {
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
