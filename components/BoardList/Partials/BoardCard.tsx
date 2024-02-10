import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import BoardFooter from '@/components/BoardList/Partials/BoardFooter';
import MoreButton from '@/components/BoardList/Partials/MoreButton';
import Overlay from '@/components/common/Overlay';

import Board from '@/constant/interfaces/Board';

interface BoardCardProps {
  board: Board;
}

const BoardCard: React.FC<BoardCardProps> = ({ board }): JSX.Element => {
  return (
    <Link href={`/board/${board._id}`}>
      <div className='group flex aspect-[100/127] flex-col justify-between overflow-hidden rounded-lg border'>
        <div className='relative flex-1 bg-amber-50'>
          <Image
            src={board.imageUrl}
            alt={board.title}
            fill
            className='object-fit'
          />
          <Overlay />
          <MoreButton id={board._id} title={board.title} />
        </div>
        <BoardFooter board={board} />
      </div>
    </Link>
  );
};
export default BoardCard;
