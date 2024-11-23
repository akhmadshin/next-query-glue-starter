import '@/styles/globals.css'
import '@/styles/view-transitions.css'

import type { DehydratedState } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import singletonRouter from 'next/router';
import { useRouter } from 'next/router';
import { Layout } from '@/components/Layout';
import { createRouteLoader } from 'next/dist/client/route-loader';
import { WithFadeTransition } from '@/hocs/WithFadeTransition';
import { Providers } from '@/components/Providers';
import { bpsViewTransitions, useTransitionRouterEvents } from 'next-rich-view-transitions';
import { prepareDirectNavigation } from 'next-query-glue';
import { fadeTransitionStartedEvent } from '@/lib/fadeTransitionStartedEvent';
import { scrollToWithYCheck } from '@/lib/scrollToWithYCheck';
import { FADE_OUT_DURATION } from '@/constants/FADE_TRANSITION';

(() => {
  if (typeof window === 'undefined') {
    return;
  }
  const routeLoader = createRouteLoader('');
  routeLoader.loadRoute('/').catch((e: string) => { throw new Error(e) });
  routeLoader.loadRoute('/demo').catch((e: string) => { throw new Error(e) });
  routeLoader.loadRoute('/demo/[slug]').catch((e: string) => { throw new Error(e) });
  routeLoader.loadRoute('/blog/[slug]').catch((e: string) => { throw new Error(e) });
})();

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

export default function MyApp({Component, pageProps }: AppProps<{ dehydratedState: DehydratedState}>) {
  const router = useRouter();

  useTransitionRouterEvents(singletonRouter);

  useEffect(() => {
    router.prefetch = async () => Promise.resolve(undefined);

    router.beforePopState((props) => {
      const key = (props as unknown as { key: string }).key;
      const { url, as, options } = props;

      let forcedScroll = { x: 0, y: 0 };
      try {
        const v = sessionStorage.getItem('__next_scroll_' + key);
        forcedScroll = JSON.parse(v!);
      } catch {
        forcedScroll = { x: 0, y: 0 };
      }

      forcedScroll = forcedScroll || { x: 0, y: 0 };
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

      if (!document.startViewTransition) {
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

      bpsViewTransitions(props, router)
      return false;
    });
  }, [router]);

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