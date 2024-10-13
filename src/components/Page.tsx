import type { ParentComponent } from '@/types/general';
import { useQueryClient } from '@tanstack/react-query';
import { useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export const Page: ParentComponent = ({children}) => {
  const queryClient = useQueryClient()
  const ref = useRef<HTMLDivElement>(null);
  const [isInvisible] = useState(typeof window !== 'undefined' && !window.pageMounted);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (!queryClient.isFetching()) {
      window.placeholderData = undefined;
    }
    if (!ref.current) {
      return;
    }
    ref.current.style.opacity = '1';
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-opacity ease-in duration-500',
        isInvisible ? 'opacity-0' : 'opacity-1'
      )}
    >
      {children}
    </div>
  );
}