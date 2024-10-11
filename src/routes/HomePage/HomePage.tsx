import React from 'react';

import { Meta } from '@/components/Meta';
import { Container } from '@/components/Container';
import { ArticleList } from '@/components/ArticleList';
import { usePageData } from '@/hooks/usePageData';
import { HomePageProps } from '@/types/pages/homePage';


export const HomePage = () => {
  const { data: articles, isLoading, isFetching} = usePageData<HomePageProps>();

  return (
    <Container>
      <Meta
        title="Next.js site with optimistic navigation and View Transitions API"
        description="No matter how slow the user’s Internet is or how weak his hardware is, site navigation remains instantaneous"
      />
      <div className="max-w-2xl">
        <div className="prose lg:prose-xl dark:prose-invert max-w-none">
          <h1>Demo blog</h1>
          <p className="mt-10 text-lg text-zinc-600 dark:text-zinc-100">
            That next.js website demonstrates consistently fast navigation via optimistic UI. Navigation stays instantaneous
            regardless of the Internet speed or CPU performance.
            Click on any card below to see it.
          </p>
          <code>
            Powered by <a href="https://github.com/akhmadshin/next-query-glue" target="_blank" rel="noreferrer">next-query-glue</a> and <a
            href="https://github.com/TanStack/query" target="_blank" rel="noreferrer">react-query</a>.
          </code>
        </div>

      </div>
      <ArticleList articles={articles} isLoading={isLoading || isFetching}/>
    </Container>
  );
}
