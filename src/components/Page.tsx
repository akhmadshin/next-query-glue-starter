import type { ParentComponent } from '@/types/general';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export const Page: ParentComponent = ({children}) => {
  const queryClient = useQueryClient()
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    document.addEventListener('navigationStarted', () => {
      if (!ref.current) {
        return;
      }
      ref.current.className = 'transition-opacity ease-linear duration-150 opacity-0';
    })

    if (!queryClient.isFetching()) {
      window.placeholderData = undefined;
    }
    setTimeout(() => {
      if (!ref.current || window.transition) {
        return;
      }
      ref.current.className = 'transition-opacity ease-linear duration-300 opacity-1';
    }, 50)
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-opacity ease-linear duration-300 opacity-0',
      )}
    >
      {children}
    </div>
  );
}