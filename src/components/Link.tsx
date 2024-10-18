import NextLink, { LinkProps } from 'next/link';
import React, { AnchorHTMLAttributes, MouseEvent, PropsWithChildren, useRef } from 'react';
import { prepareDirectNavigation } from 'next-query-glue';
import singletonRouter, { useRouter } from 'next/router';
import { transitionHelper } from '@/lib/transitionHelper';
import { handleTransitionStarted } from '@/pages/_app';
import { fadeTransitionStartedEvent } from '@/lib/fadeTransitionStartedEvent';
import { FADE_IN_DURATION } from '@/constants/FADE_TRANSITION';

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
      href,
      singletonRouter,
    });
    window.placeholderData = placeholderData;

    if (!document.startViewTransition) {
      document.dispatchEvent(fadeTransitionStartedEvent);
      setTimeout(() => {
        return router.push(href);
      }, FADE_IN_DURATION)
      return;
    }

    handleTransitionStarted(href as string);

    startPageTransition();

    setTimeout(() => {
      return router.push(href);
    }, 16);
  }

  return (
    <NextLink
      onClick={handleClick}
      href={href}
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