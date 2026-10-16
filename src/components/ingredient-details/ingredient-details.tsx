import { useLocation, useParams } from 'react-router-dom';

import { useSelector } from '../../services/store';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { Preloader } from '../ui/preloader';

import type { FC } from 'react';

export const IngredientDetails: FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const ingredients = useSelector((state) => state.ingredients.ingredients);

  const ingredientData =
    location.state?.ingredient ||
    ingredients.find((item: { _id: string | undefined }) => item._id === id) ||
    null;

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
