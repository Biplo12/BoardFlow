import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { useApiMutation } from '@/hooks/useApiMutation';

import { api } from '@/convex/_generated/api';

interface NewBoardButtonProps {
  orgId: string;
  disabled?: boolean;
}

const NewBoardButton: React.FC<NewBoardButtonProps> = ({
  orgId,
  disabled,
}): JSX.Element => {
  const router = useRouter();
  const { mutate, pending } = useApiMutation(api.board.create);

  const handleCreateBoard = async () => {
    try {
      const boardId = await mutate({
        orgId,
        title: 'New Board',
      });
      toast.success('Board created successfully');
      router.push(`/board/${boardId}`);
    } catch (error) {
      toast.error('Failed to create board');
      console.error(error);
    }
  };
  return (
    <button
      disabled={pending || disabled}
      onClick={handleCreateBoard}
      className={cn(
        'col-span-1 flex aspect-[100/127] flex-col items-center justify-center rounded-lg bg-blue-950 py-6 hover:bg-blue-900',
        (pending || disabled) &&
          'cursor-not-allowed opacity-75 hover:bg-blue-950'
      )}
    >
      <div />
      <Plus className='h-12 w-12 stroke-1 text-white' />
      <p className='text-sm font-light text-white'>New board</p>
    </button>
  );
};
export default NewBoardButton;
