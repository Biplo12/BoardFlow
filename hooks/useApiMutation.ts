import { useMutation } from 'convex/react';
import { FunctionReference } from 'convex/server';
import { useState } from 'react';

export const useApiMutation = (
  mutationFunction: FunctionReference<'mutation'>
) => {
  const [pending, setPending] = useState(false);
  const apiMutation = useMutation(mutationFunction);

  const mutate = async (payload: any): Promise<any> => {
    setPending(true);
    try {
      try {
        const result = await apiMutation(payload);
        return result;
      } finally {
        setPending(false);
      }
    } catch (error) {
      throw error;
    }
  };

  return {
    mutate,
    pending,
  };
};
