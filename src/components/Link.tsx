import NextLink, { LinkProps } from 'next/link';
import React, { AnchorHTMLAttributes, MouseEvent, PropsWithChildren, useRef } from 'react';
import { prepareDirectNavigation } from 'next-query-glue';
import singletonRouter, { useRouter } from 'next/router';
import { transitionHelper } from '@/lib/transitionHelper';
import { handleTransitionStarted } from '@/pages/_app';

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

const navigationStarted = new CustomEvent("navigationStarted", {
  detail: {},
});

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
    if (onClick) {
      onClick(e);
    }
    document.dispatchEvent(navigationStarted);

    e.preventDefault();

    handleTransitionStarted(href as string);
    prepareDirectNavigation({
      href,
      singletonRouter,
    });
    window.placeholderData = placeholderData;

    startPageTransition();

    setTimeout(() => {
      return router.push(href)
    }, !document.startViewTransition ? 150 : 13)
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