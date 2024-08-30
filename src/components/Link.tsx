import NextLink, { LinkProps } from 'next/link';
import React, { AnchorHTMLAttributes, MouseEvent, PropsWithChildren } from 'react';
import { prepareDirectNavigation } from 'next-query-glue';
import singletonRouter from 'next/router';
import { transitionHelper } from '@/lib/transitionHelper';

type NextLinkProps = PropsWithChildren<Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps>

type Props = NextLinkProps & {
  placeholderData?: object;
  isDirect?: boolean;
  beforeTransition?: () => void;
  afterTransition?: () => void;
}
export const Link = React.forwardRef<HTMLAnchorElement, Props>(function LinkComponent(props, ref) {
  const {
    placeholderData,
    beforeTransition,
    afterTransition,
    onClick,
    isDirect = true,
    href,
    children,
    ...restProps
  } = props;
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    if (isDirect) {
      prepareDirectNavigation({
        href,
        singletonRouter,
        withTrailingSlash: Boolean(process.env.__NEXT_TRAILING_SLASH),
      });
      window.placeholderData = placeholderData;
    }
    startPageTransition();
  }

  const startPageTransition = () => {
    if (beforeTransition) {
      beforeTransition()
    }

    if (!window.pageMounted) {
      window.pageMountedPromise = new Promise(resolve => {
        window.pageMounted = resolve;
      })
    }

    transitionHelper({
      updateDOM: async () => {
        window.scroll({
          top: 0,
        });
        if (window.pageMounted) {
          if (afterTransition) {
            afterTransition();
          }
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
      ref={ref}
      {...restProps}
    >{children}</NextLink>
  )
})