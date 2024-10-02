import type { ParentComponent } from '@/types/general';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export const Page: ParentComponent = ({children}) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (!queryClient.isFetching()) {
      window.placeholderData = undefined;
    }
  }, [])
  return children;
}