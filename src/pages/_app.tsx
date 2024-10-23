import '@/styles/globals.css'
import '@/styles/view-transitions.css'

import type { DehydratedState } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { prepareDirectNavigation } from 'next-query-glue';
import singletonRouter from 'next/dist/client/router';
import { Layout } from '@/components/Layout';
import { createRouteLoader } from 'next/dist/client/route-loader';
import { transitionHelper } from '@/lib/transitionHelper';
import { WithFadeTransition } from '@/hocs/WithFadeTransition';
import { fadeTransitionStartedEvent } from '@/lib/fadeTransitionStartedEvent';
import { Providers } from '@/components/Providers';
import { FADE_OUT_DURATION } from '@/constants/FADE_TRANSITION';

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


export default function MyApp({Component, pageProps }: AppProps<{ dehydratedState: DehydratedState}>) {
  const router = useRouter();


  useEffect(() => {
    if (!router) {
      return;
    }
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    }
  }, []);

  useEffect(() => {
    router.prefetch = async () => Promise.resolve(undefined);

    router.beforePopState((props) => {
      const { url, as, options } = props;
      const key = (props as unknown as { key: string }).key;

      let forcedScroll = { x: 0, y: 0 };

      try {
        const v = sessionStorage.getItem('__next_scroll_' + key);
        forcedScroll = JSON.parse(v!);
      } catch {
        forcedScroll = { x: 0, y: 0 };
      }

      prepareDirectNavigation({
        href: as,
        singletonRouter,
      });

      if (window.transition) {
        window.transition.skipTransition();
      }

      if (window.scrollY > window.screen.height || (forcedScroll?.y || 0) > window.screen.height || !document.startViewTransition) {
        document.dispatchEvent(fadeTransitionStartedEvent);

        setTimeout(async () => {
          await router.replace(url, as, { shallow: options.shallow, locale: options.locale, scroll: false });

          // Waiting 1 tick for document to update
          setTimeout(() => {
            const scrollMaxY = document.documentElement.scrollHeight - document.documentElement.clientHeight + 1;
            if (!forcedScroll || forcedScroll.y > scrollMaxY) {
              forcedScroll = { x: 0, y: 0 };
            }
            scrollTo({ top: forcedScroll.y, left: forcedScroll.x, behavior: 'instant' });
          }, 0);
        }, FADE_OUT_DURATION - 25);
        return false;
      }

      const pageMountedPromise: Promise<void> = new Promise(resolve => {
        window.pageMounted = resolve;
      })

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
        scrollTo({ top: forcedScroll.y, left: forcedScroll.x, behavior: 'instant' });
      }, 13);

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