import "@/styles/globals.css";
import type { AppProps } from "next/app";
import singletonRouter from 'next/dist/client/router';
import { prepareDirectNavigation, NextQueryGlueProvider } from 'next-query-glue';
import { DehydratedState, HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from '@/components/Layout';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import { createRouteLoader } from 'next/dist/client/route-loader';

// Prefetch js chunks of the routes
(() => {
  if (typeof window === 'undefined') {
    return;
  }
  const routeLoader = createRouteLoader('');
  routeLoader.prefetch('/').catch((e: string) => { throw new Error(e) });
  routeLoader.prefetch('/blog/[slug]').catch((e: string) => { throw new Error(e) });
})()


export default function App({ Component, pageProps }: AppProps<{ dehydratedState: DehydratedState}>) {
  const router = useRouter();

  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
      }
    }
  }))

  useIsomorphicLayoutEffect(() => {
    // disable router prefetch completely
    router.prefetch = async () => Promise.resolve(undefined);

    // makes navigation through history faster
    router.beforePopState((state) => {
      prepareDirectNavigation({
        href: state.as,
        singletonRouter,
        withTrailingSlash: Boolean(process.env.__NEXT_TRAILING_SLASH),
      });
      return true;
    });
  }, [router])

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
