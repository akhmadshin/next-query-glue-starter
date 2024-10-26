import React from 'react';
import { BlogItemPrePage } from '@/routes/BlogItemPage/BlogItemPrePage';
import { WithDeferOnViewTransition } from '@/hocs/WithDeferOnViewTransition';
import { BlogItemPostPage } from '@/routes/BlogItemPage/BlogItemPostPage';
import { BlogItemPostPageLoader } from '@/routes/BlogItemPage/BlogItemPostPageLoader';
import { Page } from '@/components/Page';

export const BlogItemPage = () => {
  return (
    <Page>
      <BlogItemPrePage>
        <WithDeferOnViewTransition loader={<BlogItemPostPageLoader />}>
          <BlogItemPostPage />
        </WithDeferOnViewTransition>
      </BlogItemPrePage>
    </Page>
  )
}
