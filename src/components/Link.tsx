import NextLink, { LinkProps } from 'next/link';
import React, { AnchorHTMLAttributes, MouseEvent, PropsWithChildren, useRef } from 'react';
import { prepareDirectNavigation } from 'next-query-glue';
import singletonRouter, { useRouter } from 'next/router';
import { transitionHelper } from '@/lib/transitionHelper';
import { handleTransitionStarted } from '@/pages/_app';
import { fadeTransitionStartedEvent } from '@/lib/fadeTransitionStartedEvent';
import { FADE_OUT_DURATION } from '@/constants/FADE_TRANSITION';

type NextLinkProps = PropsWithChildren<Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps>

type Props = NextLinkProps & {
  placeholderData?: object;
}

const startPageTransition = () => {
  if (window.transition) {
    window.transition.skipTransition();
  }

  const pageMountedPromise: Promise<void> = new Promise(resolve => {
    window.pageMounted = resolve;
  })

  transitionHelper({
    update: async () => {
      await pageMountedPromise;
    },
  });
}

export const Link = React.forwardRef<HTMLAnchorElement, Props>(function LinkComponent(props, ref) {
  const {
    placeholderData,
    onClick,
    href,
    children,
    ...restProps
  } = props;
  const localRef = useRef<HTMLAnchorElement | null>();
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (onClick) {
      onClick(e);
    }

    prepareDirectNavigation({
      singletonRouter,
    });
    window.placeholderData = placeholderData;

    if (!document.startViewTransition) {
      document.dispatchEvent(fadeTransitionStartedEvent);
      setTimeout(() => {
        try {
          // Snapshot scroll position right before navigating to a new page:
          // sessionStorage.setItem(
          //   '__next_vi_' + singletonRouter._key,
          //   JSON.stringify({ x: self.pageXOffset, y: self.pageYOffset })
          // )
        } catch {}
        return router.push(href);
      }, FADE_OUT_DURATION - 25)
      return;
    }

    handleTransitionStarted(href as string);

    startPageTransition();

    setTimeout(() => {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const viewTransitionScrollKey = '__view_transition_scroll_' + singletonRouter.router!._key
        sessionStorage.setItem(
          viewTransitionScrollKey,
          JSON.stringify({ x: pageXOffset, y: pageYOffset })
        )
      } catch {}
      return router.push(href);
    }, 16);
  }

  return (
    <NextLink
      onClick={handleClick}
      href={href}
      scroll={false}
      prefetch={false}
      ref={(node) => {
        localRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      {...restProps}
    >{children}</NextLink>
  )
})