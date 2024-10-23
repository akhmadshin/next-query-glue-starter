import type { ParentComponent } from '@/types/general';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { FADE_OUT_DURATION, FADE_IN_DURATION } from '@/constants/FADE_TRANSITION';

export const WithFadeTransition: ParentComponent = ({ children }) => {
  const queryClient = useQueryClient()
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleTransitionStarted = () => {
    if (!ref.current) {
      return;
    }
    ref.current!.style.setProperty('transition-duration', `${FADE_OUT_DURATION}ms`);
    ref.current!.style.opacity = String(0);
  }

  useEffect(() => {
    document.addEventListener('fadeTransitionStarted', handleTransitionStarted);

    return () => {
      document.removeEventListener('fadeTransitionStarted', handleTransitionStarted);
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) {
      return;
    }

    if (!queryClient.isFetching()) {
      window.placeholderData = undefined;
    }

    if (window.transition) {
      ref.current.style.opacity = String(1);
      ref.current.style.removeProperty('transition-duration');
      return;
    }

    ref.current!.style.opacity = String(1);
    ref.current!.style.setProperty('transition-duration', `${FADE_IN_DURATION}ms`);
  }, [router.pathname, router.query]);

  return (
    <div
      ref={ref}
      className={"transition-opacity ease-linear"}
    >
      {children}
    </div>
  );
}