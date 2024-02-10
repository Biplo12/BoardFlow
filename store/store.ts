import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';

import { isLocal } from '@/constant/env';
import dialogSlice from '@/state/dialogSlice';

export const store = configureStore({
  reducer: {
    dialog: dialogSlice,
  },
  devTools: isLocal,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
