import "@/styles/globals.css";
import type { AppProps } from "next/app";
import singletonRouter from 'next/dist/client/router';
import { prepareDirectNavigation, NextQueryGlueProvider } from 'next-query-glue';
import { DehydratedState, HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { createRouteLoader } from 'next/dist/client/route-loader';
import { flushSync } from 'react-dom';
import { transitionHelper } from '@/lib/transitionHelper';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';

// Optional. Prefetch js chunks of the routes on initial load.
(() => {
  if (typeof window === 'undefined') {
    return;
  }
  const routeLoader = createRouteLoader('');
  routeLoader.loadRoute('/').catch((e: string) => { throw new Error(e) });
  routeLoader.loadRoute('/blog/[slug]').catch((e: string) => { throw new Error(e) });
})()

// Optional. Handle view transitions
let isTransitionEnded = false;

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

const handleRouteChangeStart = (href: string) => {
  if (!window.isTransitionAvailable) {
    return;
  }
  window.isTransitionAvailable = false;
  isTransitionEnded = false;
}

const handleRouteChangeComplete = (e: any) => {
  if (isTransitionEnded === true) {
    return;
  }
  isTransitionEnded = true;
  if (typeof window === 'undefined') {
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

export default function App({ Component, pageProps }: AppProps<{ dehydratedState: DehydratedState}>) {
  const router = useRouter();

  useIsomorphicLayoutEffect(() => {
    if (!router) {
      return;
    }
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    }
  }, []);

  useIsomorphicLayoutEffect(() => {
    router.prefetch = async () => Promise.resolve(undefined);

    router.beforePopState((props) => {
      const { url, as, options } = props;
      const key = (props as any).key;
      const v = sessionStorage.getItem('__next_scroll_' + key)
      let forcedScroll: { x: number; y: number } | undefined
      try {
        const v = sessionStorage.getItem('__next_scroll_' + key)
        forcedScroll = JSON.parse(v!)
      } catch {
        forcedScroll = { x: 0, y: 0 }
      }
      if (window.transition) {
        window.transition.skipTransition();
      }
      const pageMountedPromise: Promise<void> = new Promise(resolve => {
        window.pageMounted = resolve;
      })

      prepareDirectNavigation({
        href: as,
        singletonRouter,
        withTrailingSlash: Boolean(process.env.__NEXT_TRAILING_SLASH),
      });

      if (window.scrollY > window.screen.height || (forcedScroll?.y || 0) > window.screen.height) {
        isTransitionEnded = true;
        return true;
      }

      transitionHelper({
        update: async () => {
          if (window.pageMounted) {
            await pageMountedPromise;
          }
        },
      });
      handleTransitionStarted(as);

      setTimeout(() => {
        router.replace(url, as, { shallow: options.shallow, locale: options.locale });
      }, 13);

      return false;
    });
  }, [router])
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <NextQueryGlueProvider singletonRouter={singletonRouter}>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={pageProps.dehydratedState} options={{
          defaultOptions: {},
        }}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </HydrationBoundary>
      </QueryClientProvider>
    </NextQueryGlueProvider>
  );
}