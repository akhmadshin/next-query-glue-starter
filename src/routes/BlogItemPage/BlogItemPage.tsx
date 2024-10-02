import React from 'react';
import { BlogItemPrePage } from '@/routes/BlogItemPage/BlogItemPrePage';
import { WithDeferOnSoftNavigation } from '@/hocs/WithDeferOnSoftNavigation';
import { BlogItemPostPage } from '@/routes/BlogItemPage/BlogItemPostPage';

export const BlogItemPage = () => {
  return (
    <BlogItemPrePage>
      <WithDeferOnSoftNavigation>
        <BlogItemPostPage />
      </WithDeferOnSoftNavigation>
    </BlogItemPrePage>
  )
}
