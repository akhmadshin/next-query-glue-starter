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


    startPageTransition();

    //
    // e.preventDefault();
    // router.push(href);
    // push.call(singletonRouter.router, href);
    // singletonRouter.router!.getRouteInfo = getRouteInfo.bind(singletonRouter.router);
  }

  const startPageTransition = () => {
    if (!window.pageMounted) {
      window.pageMountedPromise = new Promise(resolve => {
        window.pageMounted = resolve;
      })
    }

    transitionHelper({
      update: async () => {
        if (window.pageMounted) {
          await window.pageMountedPromise;
        }
      },
    });
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