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
import { getSelector } from '@/components/Link';
import { isObserved } from '@/lib/rectangleCollide';
import { getElementAbsolutePosition } from '@/lib/get-element-absolute-position';

(() => {
  if (typeof window === 'undefined') {
    return;
  }
  const routeLoader = createRouteLoader('');
  routeLoader.loadRoute('/').catch((e: string) => { throw new Error(e) });
  routeLoader.loadRoute('/blog/[slug]').catch((e: string) => { throw new Error(e) });
})();

const isTransitionAvailable = (routerKey: string) => {
  let isViewTransitionAvailable = true;
  let forcedScroll = null;
  let viewTransitionScroll = null;
  try {
    const v = sessionStorage.getItem('__view_transition_scroll_' + routerKey)
    viewTransitionScroll = JSON.parse(v!)
  } catch {}

  try {
    const v = sessionStorage.getItem('__next_scroll_' + routerKey);
    forcedScroll = JSON.parse(v!);
  } catch {
    forcedScroll = { x: 0, y: 0 };
  }

  if (viewTransitionScroll) {
    const isImgObserved = isObserved(viewTransitionScroll, forcedScroll?.x || 0, forcedScroll?.y || 0);
    isViewTransitionAvailable  = forcedScroll === null ? true : isImgObserved;
  } else {
    isViewTransitionAvailable = true;
  }

  return isViewTransitionAvailable;
}
export const handleTransitionStarted = (href: string, currentHref: string, routerKey: string, isDirect: boolean) => {
  const imgSelector = sessionStorage.getItem(`__view_transition_selector_${routerKey}`);
  const isViewTransitionAvailable = isDirect ? true : isTransitionAvailable(routerKey);

  window.transitionHref = currentHref;
  if (imgSelector) {
    const clickedImg = document.querySelector<HTMLImageElement>(imgSelector);
    if (clickedImg && clickedImg.src) {
      window.transitionImg = clickedImg.src.replace(location.origin || '', '');
      clickedImg.style.viewTransitionName = isViewTransitionAvailable ? 'transition-img' : '';
      return;
    }
  }
  const image = document.querySelector<HTMLImageElement>('.transition-img');
  if (image && image.src) {
    image.style.viewTransitionName = isViewTransitionAvailable ? 'transition-img' : '';
    window.transitionImg = image.src.replace(location.origin || '', '');
    return;
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

export default function MyApp({Component, pageProps }: AppProps<{ dehydratedState: DehydratedState}>) {
  const router = useRouter();

  const handleRouteChangeComplete = () => {
    if (typeof window === 'undefined') {
      return;
    }
    if (!window.pageMounted) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const routerKey = singletonRouter.router!._key;
    const isViewTransitionAvailable = isTransitionAvailable(routerKey);

    const imgSelector = window.imageSelectorByPathName ? window.imageSelectorByPathName[router.pathname] : undefined;
    const img = imgSelector ? document.querySelector<HTMLImageElement>(imgSelector) : undefined;
    if (img) {
      const rect = getElementAbsolutePosition(img);
      sessionStorage.setItem(
        `__view_transition_scroll_${routerKey}`,
        JSON.stringify(rect)
      );
      img.style.viewTransitionName = isViewTransitionAvailable ? 'transition-img' : '';
    } else {
      const transitionImg = document.querySelector<HTMLImageElement>(`img[src$='${window.transitionImg}']`);
      const rect = getElementAbsolutePosition(transitionImg);
      sessionStorage.setItem(
        `__view_transition_scroll_${routerKey}`,
        JSON.stringify(rect)
      );

      if (transitionImg) {
        transitionImg.style.viewTransitionName = isViewTransitionAvailable ? 'transition-img' : '';
      }
    }

    window.transitionImg = undefined;
    if (window.pageMounted) {
      window.pageMounted();
      window.pageMounted = undefined;
    }
  }


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

      const key = (props as unknown as { key: string }).key;
      const { url, as, options } = props;
      let transitionImgSelector =  sessionStorage.getItem(`__view_transition_selector_${key}`);

      if (!transitionImgSelector) {
        const matchedLinks = Array.from(document.querySelectorAll<HTMLImageElement>(`a[href$='${as}']`));
        const clickedImg = matchedLinks.reduce((acc: HTMLImageElement | undefined, link) => {
          if (!acc) {
            const image = link.querySelector<HTMLImageElement>('.transitionable-img');
            acc = image ?? undefined;
          }
          return acc;
        }, undefined);
        if (clickedImg) {
          transitionImgSelector = getSelector(clickedImg);
          sessionStorage.setItem(`__view_transition_selector_${key}`, transitionImgSelector);
        }
      }

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
        handleTransitionStarted(as, router.asPath, key, false);
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