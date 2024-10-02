import "@/styles/globals.css";
import type { AppProps } from "next/app";
import singletonRouter from 'next/dist/client/router';
import { prepareDirectNavigation, NextQueryGlueProvider } from 'next-query-glue';
import { DehydratedState, HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import { createRouteLoader } from 'next/dist/client/route-loader';
import { flushSync } from 'react-dom';

// Optional. Prefetch js chunks of the routes on initial load.
(() => {
  if (typeof window === 'undefined') {
    return;
  }
  const routeLoader = createRouteLoader('');
  routeLoader.prefetch('/').catch((e: string) => { throw new Error(e) });
  routeLoader.prefetch('/blog/[slug]').catch((e: string) => { throw new Error(e) });
})()

// Optional. Handle view transitions
const handleRouteChangeStart = (href: string) => {
  flushSync(() => {
    const el = document.querySelector<HTMLImageElement>(`[style*='view-transition-name']`);
    if (el) {
      el.style.viewTransitionName = '';
    }
    const image = document.querySelector<HTMLImageElement>('.transition-img');
    if (image && image.src) {
      image.style.viewTransitionName = 'transition-img';
      window.transitionImg = image.src.replace(location.origin || '', '');
      return;
    }

    const clickedLink = document.querySelector<HTMLImageElement>(`a[href$='${href}']`);
    const clickedImg = clickedLink?.querySelector<HTMLImageElement>('.transitionable-img');
    if (clickedImg) {
      window.transitionImg = clickedImg.src.replace(location.origin || '', '');
      clickedImg.style.viewTransitionName = 'transition-img';
    }
  })
}
const handleRouteChangeComplete = () => {
  if (typeof window === 'undefined') {
    return;
  }

  flushSync(() => {
    if (window.transitionImg) {
      const transitionImg = document.querySelector<HTMLImageElement>(`img[src$='${window.transitionImg}']`);
      if (transitionImg) {
        transitionImg.style.viewTransitionName = 'transition-img';
      }
    }
  })

  // Next tick
  setTimeout(() => {
    if (typeof window === 'undefined') {
      return;
    }


    if (window.pageMounted) {
      window.pageMounted();
      window.pageMounted = undefined;
    }
    window.transitionImg = undefined;
  }, 0);
}

export default function App({ Component, pageProps }: AppProps<{ dehydratedState: DehydratedState}>) {
  const router = useRouter();

  useEffect(() => {
    if (!router) {
      return;
    }
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    router.prefetch = async () => Promise.resolve(undefined);

    router.beforePopState((state) => {
      prepareDirectNavigation({
        href: state.as,
        singletonRouter,
        withTrailingSlash: Boolean(process.env.__NEXT_TRAILING_SLASH),
      });
      return true;
    });

    // Optional. Handle view transitions
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    }
  }, [router]);

  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
      }
    }
  }))

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