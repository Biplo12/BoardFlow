import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '@/store/store';

import IBoardOpeningReducerInterface from '@/constant/interfaces/IBoardOpeningReducerInterface';

const initialState: IBoardOpeningReducerInterface = {
  isOpening: false,
};

const slice = createSlice({
  name: 'boardOpeningSlice',
  initialState,
  reducers: {
    startOpeningBoard: (state) => {
      state.isOpening = true;
    },
    stopOpeningBoard: (state) => {
      state.isOpening = false;
    },
  },
});

const { actions, reducer } = slice;
export const { startOpeningBoard, stopOpeningBoard } = actions;
export const selectIsOpeningBoard = (state: RootState) =>
  state.boardOpening.isOpening;
export default reducer;
