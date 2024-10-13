import type { ParsedUrlQuery } from 'querystring';
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';

function removeTrailingSlash(route: string) {
  return route.replace(/\/$/, '') || '/'
}

const normalizeResolvedUrl = (resolvedUrl: string) => {
  const pathnameAndQuery = resolvedUrl.split('?') as [string, string];
  const pathname = removeTrailingSlash(pathnameAndQuery[0]);
  let query = pathnameAndQuery[1];
  if (query) {
    const params = new URLSearchParams(query);
    params.forEach((value, key) => {
      if (key.startsWith('nxtP')) {
        params.delete(key);
      }
    });
    query = params.toString();
    if (query)
      return `${pathname}?${query}`
  }
  return pathname;
}

export const withSSRTanStackQuery = <T extends object, Q extends ParsedUrlQuery = ParsedUrlQuery>(getServerSideProps: GetServerSideProps<T, Q>) => async (
  props: GetServerSidePropsContext<Q>,
) => {
  const queryKey = normalizeResolvedUrl(props.resolvedUrl);
  let result: GetServerSidePropsResult<T> | undefined = undefined;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      result = await getServerSideProps(props) as { props: T | Promise<T> };
      return result?.props;
    }
  })

  if (!result) {
    return;
  }

  if (!(result as { props: T | Promise<T> }).props) {
    return result;
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}