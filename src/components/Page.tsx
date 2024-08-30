import type { ParentComponent } from '@/types/general';
import { useQueryClient } from '@tanstack/react-query';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';

export const Page: ParentComponent = ({children}) => {
  const queryClient = useQueryClient()

  useIsomorphicLayoutEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (!queryClient.isFetching()) {
      window.placeholderData = undefined;
    }
    if (window.pageMounted) {
      window.pageMounted();
      window.pageMounted = undefined;
    }
  })
  return children;
}