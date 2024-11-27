import NextLink, { LinkProps } from 'next/link';
import React, { AnchorHTMLAttributes, MouseEvent, PropsWithChildren, useRef } from 'react';
import { prepareDirectNavigation } from 'next-query-glue';
import singletonRouter, { useRouter } from 'next/router';
import { fadeTransitionStartedEvent } from '@/lib/fadeTransitionStartedEvent';
import { FADE_OUT_DURATION } from '@/constants/FADE_TRANSITION';
import { formatWithValidation } from 'next/dist/shared/lib/router/utils/format-url';
import { startViewTransition } from 'next-rich-view-transitions';

type NextLinkProps = PropsWithChildren<Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps>

type Props = NextLinkProps & {
  placeholderData?: object;
  disabled?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, Props>(function LinkComponent(props, ref) {
  const {
    placeholderData,
    onClick,
    href,
    disabled,
    children,
    ...restProps
  } = props;
  const localRef = useRef<HTMLAnchorElement | null>();
  const router = useRouter();
  const urlAsString = typeof href === 'string' ? href : formatWithValidation(href);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (e?.metaKey) {
      return;
    }

    if (urlAsString.startsWith('#')) {
      prepareDirectNavigation({
        singletonRouter,
      });
      return;
    }

    e.preventDefault();

    prepareDirectNavigation({
      singletonRouter,
    });
    window.placeholderData = placeholderData;

    if (!document.startViewTransition) {
      document.dispatchEvent(fadeTransitionStartedEvent);
      setTimeout(() => {
        return router.push(href);
      }, FADE_OUT_DURATION - 25)
      return;
    }
    const transitionImg = e.currentTarget.querySelector<HTMLImageElement>('.transitionable-img') || document.querySelector('.transition-img');
    startViewTransition(transitionImg).then(() => {
      router.push(href);
    });
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