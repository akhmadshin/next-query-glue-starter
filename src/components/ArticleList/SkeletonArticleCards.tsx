import { Component } from '@/types/general';
import React from 'react';
import { SkeletonArticleCard } from '@/components/ArticleCard/SkeletonArticleCard';

export const SkeletonArticleCards: Component = () => {
  return (
    <>
      <SkeletonArticleCard/>
      <SkeletonArticleCard/>
      <SkeletonArticleCard/>
      <SkeletonArticleCard/>
      <SkeletonArticleCard/>
      <SkeletonArticleCard/>
    </>

  );
}
