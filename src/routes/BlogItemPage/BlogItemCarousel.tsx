import React from 'react';
import { usePageData } from '@/hooks/usePageData';
import { BlogItemPageProps } from '@/types/pages/blogItemPage';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { ArticleCard } from '@/components/ArticleCard';
import { cn } from '@/lib/utils';

export const BlogItemCarousel = () => {
  const { data: article } = usePageData<BlogItemPageProps>();
  const articleAttributes = article?.attributes || undefined;
  const relatedArticles = articleAttributes ? articleAttributes.relatedArticles : undefined;

  return (
    <div className="my-16 block">
      <Carousel
        opts={{
          dragFree: true,
          align: "start",
        }}
        className="w-full max-w-7xl mx-auto"
      >
        <CarouselContent>
          {relatedArticles && relatedArticles.map((article, index) => (
            <CarouselItem key={index} className={cn(
              'basis-1/2 md:basis-1/3 lg:basis-1/4',
              index === 0 && 'pl-4 xs:pl-6 sm:pl-10 lg:pl-12 xl:pl-0',
              index === relatedArticles.length - 1 && 'pr-4 xs:pr-6 sm:pr-10 lg:pr-12 xl:pr-0',
            )}>
              <ArticleCard article={article}/>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
