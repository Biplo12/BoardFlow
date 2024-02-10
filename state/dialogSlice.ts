import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '@/store/store';

import IDialogReducerInterface from '@/interfaces/IDialogReducerInterface';

import TDialog from '@/types/TDialog';

const initialState: IDialogReducerInterface = {
  currentDialog: null,
  isOpen: false,
  dialogProps: null,
};

const slice = createSlice({
  name: 'dialogSlice',
  initialState,
  reducers: {
    openDialog: (
      state,
      action: { payload: { currentDialog: TDialog; dialogProps?: unknown } }
    ) => {
      state.currentDialog = action.payload.currentDialog;
      state.isOpen = true;
      state.dialogProps = action.payload.dialogProps || null;
    },
    closeDialog: (state) => {
      state.currentDialog = null;
      state.isOpen = false;
      state.dialogProps = null;
    },
  },
});

const { actions, reducer } = slice;
export const { openDialog, closeDialog } = actions;
export const selectDialog = (state: RootState) => state;
export default reducer;
