import { DehydratedState, useQuery, useQueryClient } from '@tanstack/react-query';
import { getQueryFn, getQueryKey } from 'next-query-glue';
import { useRouter } from 'next/router';
import singletonRouter from 'next/dist/client/router';

export const usePageData = <T>() => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const placeholderData = typeof window === 'undefined' ? undefined : window.placeholderData;
  const queryKey = [getQueryKey(router, Boolean(process.env.__NEXT_TRAILING_SLASH))]

  const res =  useQuery<unknown, unknown, T>({
    queryKey,
    queryFn: async () => {
      const serverData = queryClient.getQueryData([...queryKey]);
      if (serverData && !res.isStale) {
        return serverData;
      }
      return getQueryFn(router, Boolean(process.env.__NEXT_TRAILING_SLASH), singletonRouter).then((props) => {
        const res = props as { dehydratedState: DehydratedState};
        return res?.dehydratedState ? res.dehydratedState.queries[0].state.data : props;
      })
    },
    placeholderData,
  });
  return res;
}