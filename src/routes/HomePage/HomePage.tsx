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
          <h1>Home page</h1>
        </div>
      </div>
      <ArticleList articles={articles} isLoading={isLoading || isFetching}/>
    </Container>
  );
}
