import { ArticleCard } from '@/components/ArticleCard';
import { SkeletonArticleCard } from '@/components/skeletons/SkeletonArticleCard';

import React from 'react';
import { ArticleListApi } from '@/types/api';
import { Component } from '@/types/general';

interface Props {
  articles?: ArticleListApi;
  isLoading?: boolean;
}

const ArticleListContent: Component<Props> = ({ articles, isLoading }) => {
  if (!articles && isLoading) {
    return (
      <>
        <SkeletonArticleCard/>
        <SkeletonArticleCard/>
      </>
    )
  }

  if (!articles) {
    return;
  }

  return (
    <>
      {articles.data.map((article, index) => (
        <ArticleCard article={article} priority={index === 0} key={index}/>
      ))}
    </>
  )
}

export const ArticleList: Component<Props> = ({ articles, isLoading }) => {
  return (
    <div className="mt-16">
      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-12">
        <ArticleListContent articles={articles} isLoading={isLoading} />
      </div>
    </div>
  )
}