import type { ParentComponent } from '@/types/general';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/router';

export const WithFadeTransition: ParentComponent = ({ children }) => {
  const queryClient = useQueryClient()
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleTransitionStarted = () => {
    if (!ref.current) {
      return;
    }
    ref.current.className = 'transition-opacity ease-linear duration-150 opacity-0';
  }
  useEffect(() => {
    document.addEventListener('fadeTransitionStarted', handleTransitionStarted);

    return () => {
      document.removeEventListener('fadeTransitionStarted', handleTransitionStarted);
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (!ref.current) {
      return;
    }


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
  }, [router.pathname, router.query]);

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