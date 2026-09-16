'use client';

import React, { useEffect } from 'react';

import BoardSkeleton from '@/components/common/BoardSkeleton';

import { useAppDispatch, useAppSelector } from '@/store/store-hooks';

import {
  selectIsOpeningBoard,
  stopOpeningBoard,
} from '@/state/boardOpeningSlice';

/* Lives above the board list so it survives the list swapping from the empty
   state to the grid the moment the new board lands in the query. */
const BoardOpeningOverlay: React.FC = (): JSX.Element | null => {
  const isOpening = useAppSelector(selectIsOpeningBoard);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(stopOpeningBoard());
    };
  }, [dispatch]);

  if (!isOpening) return null;

  return <BoardSkeleton fixed />;
};
export default BoardOpeningOverlay;
