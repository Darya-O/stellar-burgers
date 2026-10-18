import { BurgerIngredientUI } from '@ui';
import { type FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { addBun, addIngredient } from '../../services/constructorSlice';
import { useDispatch } from '../../services/store';

import type { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  function BurgerIngredient({ ingredient, count }) {
    const dispatch = useDispatch();
    const location = useLocation();

    const handleAdd = (): void => {
      if (ingredient.type === 'bun') {
        dispatch(addBun(ingredient));
      } else {
        dispatch(addIngredient(ingredient));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
