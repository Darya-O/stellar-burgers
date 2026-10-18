import { useLocation, useParams } from 'react-router-dom';

import { selectIngredients } from '../../services/ingredientsSlice';
import { useSelector } from '../../services/store';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { Preloader } from '../ui/preloader';

import type { TIngredient } from '@utils-types';
import type { FC } from 'react';
import type { Location } from 'react-router-dom';

type TLocationState = {
  background?: Location;
  ingredient?: TIngredient;
};

export const IngredientDetails: FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const state = location.state as TLocationState | null;

  const ingredients = useSelector(selectIngredients);

  const ingredientData =
    state?.ingredient ?? ingredients.find((item) => item._id === id) ?? null;

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
