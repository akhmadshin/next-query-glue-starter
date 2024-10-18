import React from 'react';

import { Meta } from '@/components/Meta';
import { Container } from '@/components/Container';
import { ArticleList } from '@/components/ArticleList';
import { usePageData } from '@/hooks/usePageData';
import { HomePageProps } from '@/types/pages/homePage';
import { Page } from '@/components/Page';

const title = 'Next.js starter with best navigation experience possible.';
const description = 'That next.js starter demonstrates consistently fast navigation via optimistic UI. Navigation stays responsive regardless of the Internet speed or CPU performance.';

export const HomePage = () => {
  const { data: articles, isLoading, isFetching} = usePageData<HomePageProps>();

  const features = [
    'Optimistic navigation',
    'View transitions (supports back/forward)',
    'Fallback for browsers that dont have view transition api',
    'SWR caching',
    'Image preloading',
    'Scroll restoration',
  ]
  return (
    <Page>
      <Container>
        <Meta
          title={title}
          description={description}
        />
        <div className="prose lg:prose-xl dark:prose-invert max-w-2xl">
          <h1>
            {title}
          </h1>

          <code>
            Powered by <a href="https://github.com/akhmadshin/next-query-glue"
                          target="_blank">next-query-glue</a> and <a
            href="https://github.com/TanStack/query" target="_blank">react-query</a>.
          </code>
          <ul>
            {features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
          <p>
            {description}{' '}
            Click on any card below to see it.
          </p>
        </div>
        <ArticleList articles={articles} isLoading={isLoading || isFetching}/>
      </Container>
    </Page>
  );
}
