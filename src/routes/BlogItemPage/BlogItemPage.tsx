import React from 'react';
import { BlogItemPrePage } from '@/routes/BlogItemPage/BlogItemPrePage';
import { WithDeferOnSoftNavigation } from '@/hocs/WithDeferOnSoftNavigation';
import { BlogItemPostPage } from '@/routes/BlogItemPage/BlogItemPostPage';
import { BlogItemPostPageLoader } from '@/routes/BlogItemPage/BlogItemPostPageLoader';

export const BlogItemPage = () => {
  return (
    <BlogItemPrePage>
      <WithDeferOnSoftNavigation loader={<BlogItemPostPageLoader />}>
        <BlogItemPostPage />
      </WithDeferOnSoftNavigation>
    </BlogItemPrePage>
  )
}
