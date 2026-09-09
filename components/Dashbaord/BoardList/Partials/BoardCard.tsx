import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import Overlay from '@/components/common/Overlay';
import BoardFooter from '@/components/Dashbaord/BoardList/Partials/BoardFooter';
import MoreButton from '@/components/Dashbaord/BoardList/Partials/MoreButton';

import Board from '@/constant/interfaces/Board';

interface BoardCardProps {
  board: Board;
}

const BoardCard: React.FC<BoardCardProps> = ({ board }): JSX.Element => {
  return (
    <Link href={`/board/${board._id}`}>
      <div className='board-tile group flex aspect-[100/127] flex-col justify-between overflow-hidden bg-white'>
        <div className='relative flex-1' style={{ backgroundColor: '#f2fafe' }}>
          <Image
            src={board.imageUrl}
            alt={board.title}
            fill
            className='object-cover'
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
