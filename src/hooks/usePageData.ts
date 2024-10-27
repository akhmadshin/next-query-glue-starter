import { DehydratedState, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { getQueryKey, getQueryFn } from 'next-query-glue';
import singletonRouter from 'next/router';

export const usePageData = <T>() => {
  const router = useRouter();
  const queryKey = [getQueryKey(router)]
  const placeholderData = typeof window === 'undefined' ? undefined : window.placeholderData;

  return  useQuery<unknown, unknown, T>({
    staleTime: Infinity,
    gcTime: Infinity,
    structuralSharing: false,
    queryKey,
    queryFn: async () => {
      return getQueryFn(router, singletonRouter).then((props) => {
        const res = props as { dehydratedState: DehydratedState};
        return res?.dehydratedState ? res.dehydratedState.queries[0].state.data : props;
      })
    },
    placeholderData,
  });
}