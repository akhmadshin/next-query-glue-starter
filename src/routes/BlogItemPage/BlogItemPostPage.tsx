import React, { useEffect, useRef } from 'react';
import { usePageData } from '@/hooks/usePageData';
import { BlogItemPageProps } from '@/types/pages/blogItemPage';
import { ArticleItemApi } from '@/types/api';
import { requestIdleCallback } from '@/lib/request-idle-callback';
import { BlogItemPostPageLoader } from '@/routes/BlogItemPage/BlogItemPostPageLoader';
import { RichText } from '@/components/RichText';
import { cn } from '@/lib/utils';
import { ArticleAnchors } from '@/components/ArticleAnchors/ArticleAnchors';

export const BlogItemPostPage = () => {
  const { data: article, isLoading, isFetching} = usePageData<BlogItemPageProps>();
  if (isLoading || isFetching) {
    return <BlogItemPostPageLoader />;
  }

  if (!article) {
    return null;
  }

  return (
    <BlogItemContent article={article}/>
  )
}

const BlogItemContent = ({ article }: { article: ArticleItemApi }) => {
  const articleAttributes = article.attributes || {};
  const { content, headings } = articleAttributes;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!article || !ref.current) {
      return;
    }
    requestIdleCallback(() => {
      if (!ref.current) {
        return;
      }
      ref.current.style.opacity = '1';
    });
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-opacity ease-in duration-300 opacity-0',
      )}
    >
      <ArticleAnchors headings={headings} />

      <RichText content={content}/>
    </div>
  )
}
