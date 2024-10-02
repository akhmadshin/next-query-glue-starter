import NextLink, { LinkProps } from 'next/link';
import React, { AnchorHTMLAttributes, MouseEvent, PropsWithChildren, useRef } from 'react';
import { prepareDirectNavigation } from 'next-query-glue';
import singletonRouter from 'next/router';
import { transitionHelper } from '@/lib/transitionHelper';

type NextLinkProps = PropsWithChildren<Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps>

type Props = NextLinkProps & {
  placeholderData?: object;
}

const startPageTransition = () => {
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
  const localRef = useRef<HTMLImageElement>();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }

    prepareDirectNavigation({
      href,
      singletonRouter,
      withTrailingSlash: Boolean(process.env.__NEXT_TRAILING_SLASH),
    });
    window.placeholderData = placeholderData;

    // Optional. Start view transition
    startPageTransition();
  }

  return (
    <NextLink
      onClick={handleClick}
      href={href}
      prefetch={false}
      ref={(node) => {
        // @ts-ignore
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