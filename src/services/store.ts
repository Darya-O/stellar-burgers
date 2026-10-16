import { configureStore, combineSlices } from '@reduxjs/toolkit';
import {
  type TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook,
} from 'react-redux';

import { constructorSlice } from './constructorSlice';
import { feedSlice } from './feedSlice';
import { ingredientsSlice } from './ingredientsSlice';
import { orderSlice } from './orderSlice';
import { userSlice } from './userSlice';

const rootReducer = combineSlices(
  ingredientsSlice,
  userSlice,
  constructorSlice,
  orderSlice,
  feedSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
