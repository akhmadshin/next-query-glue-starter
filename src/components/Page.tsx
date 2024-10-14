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
    if (!ref.current) {
      return;
    }

    document.addEventListener('navigationStarted', () => {
      if (!ref.current) {
        return;
      }
      ref.current.className = 'transition-opacity ease-in duration-150 opacity-0';
    })

    if (!queryClient.isFetching()) {
      window.placeholderData = undefined;
    }

    if (window.transition) {
      ref.current.className = 'opacity-1';
    }
    setTimeout(() => {
      if (!ref.current) {
        return;
      }
      ref.current!.className = 'transition-opacity ease-linear duration-500 opacity-1';
    }, 50)
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-opacity ease-linear duration-500 opacity-0',
      )}
    >
      {children}
    </div>
  );
}