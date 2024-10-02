import React from 'react';
import { usePageData } from '@/hooks/usePageData';
import { BlogItemPageProps } from '@/types/pages/blogItemPage';
import { SkeletonText } from '@/components/skeletons/SkeletonText';
import { RichText } from '@/components/RichText';

export const BlogItemPostPage = () => {
  const { data: article, isLoading, isFetching} = usePageData<BlogItemPageProps>();

  if (!article) {
    return null;
  }

  const articleAttributes = article.attributes || {};
  const { content } = articleAttributes;

  if (isLoading || isFetching) {
    return (
      <div className="mt-8">
        <div className="prose prose-slate lg:prose-xl max-w-none dark:prose-invert flex flex-col">
          <SkeletonText width="65%" as={'h2'}/>
          <SkeletonText width="90%"/>
          <SkeletonText width="93%"/>
          <SkeletonText width="85%"/>
          <SkeletonText width="98%"/>
          <SkeletonText width="92%"/>
          <SkeletonText width="95%"/>
          <SkeletonText width="91%"/>
          <SkeletonText width="60%"/>
        </div>
      </div>
    );
  }
  return (
    <div>
      <RichText content={content}/>
    </div>
  )
}
