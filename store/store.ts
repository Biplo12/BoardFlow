import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';

import { isLocal } from '@/constant/env';
import boardOpeningSlice from '@/state/boardOpeningSlice';
import dialogSlice from '@/state/dialogSlice';

export const store = configureStore({
  reducer: {
    boardOpening: boardOpeningSlice,
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
