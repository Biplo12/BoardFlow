'use client';

import React from 'react';

import RenameDialog from '@/components/Dialogs/RenameDialog';
import SetUrlDialog from '@/components/Dialogs/SetUrlDialog';

import { useAppSelector } from '@/store/store-hooks';

const CanvasDialogController: React.FC = (): JSX.Element => {
  const currentDialog = useAppSelector((state) => state.dialog.currentDialog);

  const renderCurrentDialog = () => {
    switch (currentDialog) {
      case 'RENAME_BOARD_TITLE_DIALOG':
        return <RenameDialog />;
      case 'SET_URL_DIALOG':
        return <SetUrlDialog />;
      default:
        return null;
    }
  };

  return <>{renderCurrentDialog()}</>;
};
export default CanvasDialogController;
