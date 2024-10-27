import { ParentComponent } from '@/types/general';
import React, { useCallback } from 'react';
import { NextQueryGlueProvider } from 'next-query-glue';
import singletonRouter from 'next/router';
import { ThemeProvider } from 'next-themes';
import WithQueryClientProvider from '@/hocs/WithQueryClientProvider';
import { type DehydratedState, HydrationBoundary } from '@tanstack/react-query';

interface Props {
  dehydratedState: DehydratedState;
}
export const Providers: ParentComponent<Props> = ({ children, dehydratedState }) => {
  const pathModifier = useCallback((route: string) => {
    return route;
  }, []);

  return (
    <WithQueryClientProvider>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <HydrationBoundary
        state={dehydratedState} options={{
        defaultOptions: {},
      }}>
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
      </HydrationBoundary>
    </WithQueryClientProvider>

  );
}