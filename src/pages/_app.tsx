import '@/styles/globals.css'
import '@/styles/view-transitions.css'

import type { DehydratedState } from '@tanstack/react-query';
import { HydrationBoundary } from '@tanstack/react-query'
import React, { useCallback, useEffect } from 'react';
import type { AppProps } from 'next/app';
import WithQueryClientProvider from '@/components/WithQueryClientProvider';
import { useRouter } from 'next/router';
import { NextQueryGlueProvider, prepareDirectNavigation } from 'next-query-glue';
import singletonRouter from 'next/dist/client/router';
import { ParentComponent } from '@/types/general';
import { ThemeProvider } from 'next-themes';
import { Layout } from '@/components/Layout';
import { createRouteLoader } from 'next/dist/client/route-loader';


const navigationStarted = new CustomEvent("navigationStarted", {
  detail: {},
});

(() => {
  if (typeof window === 'undefined') {
    return;
  }
  const routeLoader = createRouteLoader('');
  routeLoader.loadRoute('/').catch((e: string) => { throw new Error(e) });
  routeLoader.loadRoute('/blog/[slug]').catch((e: string) => { throw new Error(e) });
})();

const Providers: ParentComponent = ({ children }) => {
  const pathModifier = useCallback((route: string) => {
    return route;
  }, []);

  return (
    <NextQueryGlueProvider singletonRouter={singletonRouter} pathModifier={pathModifier}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </NextQueryGlueProvider>
  );
}

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


export default function MyApp({Component, pageProps}: AppProps<{ dehydratedState: DehydratedState}>) {
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
      document.dispatchEvent(navigationStarted);

      let forcedScroll = { x: 0, y: 0 };

      try {
        const v = sessionStorage.getItem('__next_scroll_' + key);
        forcedScroll = JSON.parse(v!);
      } catch {
        forcedScroll = { x: 0, y: 0 };
      }

      setTimeout(() => {
        router.replace(url, as, { shallow: options.shallow, locale: options.locale, scroll: false });
        setTimeout(() => {
          scrollTo({ top: forcedScroll.y, left: forcedScroll.x, behavior: 'instant' });
        }, 40)
      }, 150);

      if (window.transition) {
        window.transition.skipTransition();
      }

      prepareDirectNavigation({
        href: as,
        singletonRouter,
      });




      return false;
    });
  }, [router])

  return (
    <WithQueryClientProvider>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <HydrationBoundary state={pageProps.dehydratedState} options={{
        defaultOptions: {},
      }}>
        <Providers>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Providers>
      </HydrationBoundary>
    </WithQueryClientProvider>
  )
}