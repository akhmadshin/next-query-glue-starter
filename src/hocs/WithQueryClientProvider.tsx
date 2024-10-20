import React from 'react';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const client = new QueryClient();

function WithQueryClientProvider({children}: React.PropsWithChildren) {
  const [queryClient] = React.useState(() => client)
  return (
    <QueryClientProvider
      client={queryClient}
    >
      {children}
      {/*<ReactQueryDevtools initialIsOpen={false} />*/}
    </QueryClientProvider>
  );
}

export default WithQueryClientProvider;
