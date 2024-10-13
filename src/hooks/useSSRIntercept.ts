import PageRouter from 'next/router';
import { useEffect } from 'react';

export const useSSRIntercept = () => {
  useEffect(() => {
    if (!PageRouter.router?.components) return;

    const pageLoader = PageRouter.router.pageLoader;
    if (!pageLoader) return;

    for (const key in PageRouter.router.components) {
      if (key !== '/_app') delete PageRouter.router.components[key];
    }

    const {loadPage: originalLoadPage} = pageLoader;
    pageLoader.loadPage = (...args) => (
      originalLoadPage
        .apply(pageLoader, args)
        .then((pageCache) => ({
          ...pageCache,
          mod: {
            ...pageCache.mod,
            __N_SSP: false,
          },
        })))

    return () => {
      pageLoader.loadPage = originalLoadPage;
    };
  }, []);
};