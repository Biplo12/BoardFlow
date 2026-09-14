'use client';

import { useQuery } from 'convex/react';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { useApiMutation } from '@/hooks/useApiMutation';

import SectionHeading from '@/components/Layout/Dashboard/Organizations/AdminDialog/Partials/SectionHeading';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface BoardsSectionProps {
  orgId: Id<'organizations'>;
}

const BoardsSection: React.FC<BoardsSectionProps> = ({
  orgId,
}): JSX.Element => {
  const boards = useQuery(api.boards.get, { orgId });
  const { mutate: removeBoard } = useApiMutation(api.board.remove);

  const [confirming, setConfirming] = useState<string | null>(null);

  const handleDelete = async (id: Id<'boards'>, title: string) => {
    try {
      await removeBoard({ id });
      toast.success(`${title} was deleted`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Could not delete it'
      );
    }
  };

  return (
    <section className='flex flex-col gap-3'>
      <SectionHeading
        label='Boards'
        count={boards?.length}
        hint='Deleting one takes its contents with it and cannot be undone.'
      />

      {boards?.length === 0 && (
        <p
          className='text-[14px] font-medium'
          style={{ color: 'var(--candy-muted)' }}
        >
          No boards here yet.
        </p>
      )}

      <ul className='flex flex-col gap-1'>
        {boards?.map((board) => (
          <li
            key={board._id}
            className='flex items-center gap-3 rounded-[14px] px-1 py-2'
          >
            <span
              className='relative h-9 w-12 shrink-0 overflow-hidden rounded-[10px] border-2'
              style={{ borderColor: 'rgba(0,18,52,0.16)' }}
            >
              <Image
                src={board.imageUrl}
                alt=''
                aria-hidden
                fill
                sizes='48px'
                className='object-cover'
              />
            </span>
            <span className='min-w-0 flex-1'>
              <span
                className='block truncate text-[15px] font-semibold'
                style={{ color: 'var(--candy-ink)' }}
              >
                {board.title}
              </span>
              <span
                className='block truncate text-[13px] font-medium'
                style={{ color: 'var(--candy-muted)' }}
              >
                by {board.authorName}
              </span>
            </span>

            {board.canManage && (
              <button
                onClick={() => {
                  if (confirming === board._id) {
                    setConfirming(null);
                    void handleDelete(board._id, board.title);
                    return;
                  }

                  setConfirming(board._id);
                }}
                onBlur={() => setConfirming(null)}
                aria-label={`Delete ${board.title}`}
                className='flex h-8 shrink-0 items-center gap-1.5 rounded-[10px] border-2 px-2 text-[12px] font-bold'
                style={{
                  borderColor:
                    confirming === board._id
                      ? 'var(--candy-pink)'
                      : 'var(--candy-ink)',
                  color:
                    confirming === board._id
                      ? 'var(--candy-pink)'
                      : 'var(--candy-ink)',
                }}
              >
                <Trash2 className='h-4 w-4' />
                {confirming === board._id && 'Sure?'}
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};
export default BoardsSection;
