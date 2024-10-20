import type { ParentComponent } from '@/types/general';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { FADE_IN_DURATION, FADE_IN_OPACITY, FADE_OUT_DURATION } from '@/constants/FADE_TRANSITION';

export const WithFadeTransition: ParentComponent = ({ children }) => {
  const queryClient = useQueryClient()
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleTransitionStarted = () => {
    if (!ref.current) {
      return;
    }
    ref.current.style.transitionDuration = String(FADE_IN_DURATION);
    ref.current.style.opacity = String(FADE_IN_OPACITY);
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
      ref.current.style.removeProperty('transition-duration');
      ref.current.style.opacity = String(1);
    }
    setTimeout(() => {
      if (!ref.current) {
        return;
      }
      ref.current.style.transitionDuration = String(FADE_OUT_DURATION);
      ref.current.style.opacity = String(1);
    }, 50)
  }, [router.pathname, router.query]);

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: String(FADE_OUT_DURATION),
        opacity: 0,
      }}
      className={"transition-opacity ease-linear"}
    >
      {children}
    </div>
  );
}