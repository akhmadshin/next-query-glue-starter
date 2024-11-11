import React from 'react';
import { BlogItemPrePage } from '@/routes/BlogItemPage/BlogItemPrePage';
import { BlogItemPostPage } from '@/routes/BlogItemPage/BlogItemPostPage';
import { Page } from '@/components/Page';

export const BlogItemPage = () => {
  return (
    <Page>
      <BlogItemPrePage>
        <div className="no-view-transition">
          <BlogItemPostPage />
        </div>
      </BlogItemPrePage>
    </Page>
  )
}
