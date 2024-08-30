import { ArticleCard } from '@/components/ArticleCard';
import React from 'react';
import { ArticleListApi } from '@/types/api';
import { Component } from '@/types/general';
import dynamic from 'next/dynamic';

const SkeletonArticleCards = dynamic(
  () => import('./SkeletonArticleCards').then((mod) => mod.SkeletonArticleCards),
  { ssr: false },
);

interface Props {
  articles?: ArticleListApi;
  isLoading?: boolean;
}

const ArticleCards: Component<Props> = ({ articles, isLoading }) => {
  if (!articles && isLoading) {
    return <SkeletonArticleCards />
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
    <div className="mt-10">
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-12">
        <ArticleCards articles={articles} isLoading={isLoading} />
      </div>
    </div>
  )
}