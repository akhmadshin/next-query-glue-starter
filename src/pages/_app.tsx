import '@/styles/globals.css'
import '@/styles/view-transitions.css'

import type { DehydratedState } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { prepareDirectNavigation } from 'next-query-glue';
import singletonRouter from 'next/router';
import { Layout } from '@/components/Layout';
import { createRouteLoader } from 'next/dist/client/route-loader';
import { transitionHelper } from '@/lib/transitionHelper';
import { WithFadeTransition } from '@/hocs/WithFadeTransition';
import { fadeTransitionStartedEvent } from '@/lib/fadeTransitionStartedEvent';
import { Providers } from '@/components/Providers';
import { FADE_OUT_DURATION } from '@/constants/FADE_TRANSITION';
import { scrollToWithYCheck } from '@/lib/scrollToWithYCheck';
import { flushSync } from 'react-dom';

(() => {
  if (typeof window === 'undefined') {
    return;
  }
  const routeLoader = createRouteLoader('');
  routeLoader.loadRoute('/').catch((e: string) => { throw new Error(e) });
  routeLoader.loadRoute('/blog/[slug]').catch((e: string) => { throw new Error(e) });
})();

export const handleTransitionStarted = (href: string) => {
  const clickedLink = document.querySelector<HTMLImageElement>(`a[href$='${href}']`);
  const clickedImg = clickedLink?.querySelector<HTMLImageElement>('.transitionable-img');
  if (clickedImg) {
    window.transitionImg = clickedImg.src.replace(location.origin || '', '');
    clickedImg.style.viewTransitionName = 'transition-img';
    return;
  }


  const image = document.querySelector<HTMLImageElement>('.transition-img');
  if (image && image.src) {
    image.style.viewTransitionName = 'transition-img';
    window.transitionImg = image.src.replace(location.origin || '', '');
    return;
  }
}

const handleRouteChangeComplete = () => {
  if (typeof window === 'undefined') {
    return;
  }
  if (!window.pageMounted) {
    return;
  }
  const transitionImg = document.querySelector<HTMLImageElement>(`img[src$='${window.transitionImg}']`);

  if (transitionImg) {
    transitionImg.style.viewTransitionName = 'transition-img';
  }
  window.transitionImg = undefined;

  if (window.pageMounted) {
    window.pageMounted();
    window.pageMounted = undefined;
  }
}

const handleHashChangeStart = () => {
  if (window.transition) {
    window.transition.skipTransition();
  }
}

const onlyAHashChange = (currentAsPath: string, newAsPath: string) => {
  if (!currentAsPath) return false
  const [oldUrlNoHash, oldHash] = currentAsPath.split('#', 2)
  const [newUrlNoHash, newHash] = newAsPath.split('#', 2)

  // Makes sure we scroll to the provided hash if the url/hash are the same
  if (newHash && oldUrlNoHash === newUrlNoHash && oldHash === newHash) {
    return true
  }

  // If the urls are change, there's more than a hash change
  if (oldUrlNoHash !== newUrlNoHash) {
    return false
  }

  if (typeof oldHash === 'undefined' && typeof newHash === 'undefined') {
    return true;
  }

  // If the hash has changed, then it's a hash only change.
  // This check is necessary to handle both the enter and
  // leave hash === '' cases. The identity case falls through
  // and is treated as a next reload.
  return oldHash !== newHash
}

const isElementVisible = (elm: HTMLElement) => {
  const getViewportY = () => {
    const top = window.pageYOffset || document.documentElement.scrollTop;
    const bottom = top + document.documentElement.clientHeight;
    return { top, bottom }
  }

  const getElmCoordinates = (elm: HTMLElement) => {
    const { top, bottom } = elm.getBoundingClientRect();
    return { top, bottom }
  }

  const viewport = getViewportY();
  const elmPosition = getElmCoordinates(elm);

  const top = elmPosition.top + viewport.top;
  const bottom = elmPosition.bottom + viewport.top;
  const onScreenFlags = [
    (top >= viewport.top && top <= viewport.bottom),
    (bottom >= viewport.top && bottom <= viewport.bottom)
  ];
  const atLeastPartlyOnScreen = onScreenFlags.includes(true);

  return atLeastPartlyOnScreen;
}

export default function MyApp({Component, pageProps }: AppProps<{ dehydratedState: DehydratedState}>) {
  const router = useRouter();

  useEffect(() => {
    if (!router) {
      return;
    }
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('hashChangeStart', handleHashChangeStart);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('hashChangeStart', handleHashChangeStart);
    }
  }, []);

  useEffect(() => {
    router.prefetch = async () => Promise.resolve(undefined);

    router.beforePopState((props) => {
      if (window.transition) {
        window.transition.skipTransition();
      }
      let isViewTransitionAvailable = undefined;
      let forcedScroll = { x: 0, y: 0 };

      const { url, as, options } = props;
      flushSync(() => {
        const key = (props as unknown as { key: string }).key;

        let viewTransitionScroll = undefined;
        try {
          const v = sessionStorage.getItem('__view_transition_scroll_' + key)
          viewTransitionScroll = JSON.parse(v!)
        } catch {}


        try {
          const v = sessionStorage.getItem('__next_scroll_' + key);
          forcedScroll = JSON.parse(v!);
        } catch {
          forcedScroll = { x: 0, y: 0 };
        }
        isViewTransitionAvailable  = viewTransitionScroll ? window.screen.height >= Math.abs(viewTransitionScroll.y - forcedScroll.y) : undefined;
        if (typeof isViewTransitionAvailable === 'undefined' && window.screen.height >= forcedScroll.y) {
          const link = Array.from(document.querySelectorAll<HTMLAnchorElement>(`[href='${as}']`)).find(l => isElementVisible(l));
          isViewTransitionAvailable = Boolean(link);
        }
      })
      const [, newHash] = as.split('#', 2);
      const isOnlyAHashChange = onlyAHashChange(router.asPath, as);
      if (isOnlyAHashChange) {
        if (!newHash) {
          scrollTo({ top: forcedScroll.y, left: forcedScroll.x, behavior: 'smooth' });
          return false;
        }
        const target = document.querySelector(`#${newHash}`);
        if (!target) {
          return false;
        }
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        return false;
      }

      prepareDirectNavigation({
        singletonRouter,
      });

      if (!isViewTransitionAvailable || !document.startViewTransition) {
        document.dispatchEvent(fadeTransitionStartedEvent);

        setTimeout(async () => {
          forcedScroll = forcedScroll ?? { x: 0, y: 0 };
          await router.replace(url, as, { shallow: options.shallow, locale: options.locale, scroll: false });
          // Waiting 1 tick for document to update
          setTimeout(() => {
            scrollToWithYCheck(forcedScroll);
          }, 0);
        }, FADE_OUT_DURATION - 25);
        return false;
      }

      const pageMountedPromise: Promise<void> = new Promise(resolve => {
        window.pageMounted = resolve;
      })

      // Next tick
      setTimeout(() => {
        transitionHelper({
          update: async () => {
            if (window.pageMounted) {
              await pageMountedPromise;
            }
          },
        });
        handleTransitionStarted(as);
        setTimeout(async () => {
          await router.replace(url, as, { shallow: options.shallow, locale: options.locale, scroll: false });
          // Waiting 1 tick for document to update
          setTimeout(() => {
            scrollToWithYCheck(forcedScroll);
          }, 0);
        }, 13);
      })
      return false;
    });
  }, [router])

  return (
    <Providers dehydratedState={pageProps.dehydratedState}>
      <Layout>
        <WithFadeTransition>
          <Component {...pageProps} />
        </WithFadeTransition>
      </Layout>
    </Providers>
  )
}