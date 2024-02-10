'use client';

import React from 'react';

import RenameDialog from '@/components/Dialogs/RenameDialog';

import { useAppSelector } from '@/store/store-hooks';

const DialogController: React.FC = (): JSX.Element => {
  const currentDialog = useAppSelector((state) => state.dialog.currentDialog);

  const renderCurrentDialog = () => {
    switch (currentDialog) {
      case 'RENAME_BOARD_TITLE_DIALOG':
        return <RenameDialog />;
      default:
        return null;
    }
  };

  return <>{renderCurrentDialog()}</>;
};
export default DialogController;
