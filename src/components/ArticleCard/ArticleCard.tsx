import React, { useRef } from 'react';

import { Link } from '@/components/Link';
import { SkeletonArticleCard } from '@/components/ArticleCard/SkeletonArticleCard';
import { Image } from '@/components/Image';
import { RichText } from '@/components/RichText';
import { ApiResponseMedia, ArticleListItem } from '@/types/api';
import { APIResponseData } from '@/types/strapi';
import { WithImagePrefetch } from '@/components/Image/WithImagePrefetch';

interface Props {
  article: APIResponseData<ArticleListItem>;
  priority: boolean;
}

export const ArticleCard: React.FC<Props> = ({ article, priority }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!article) {
    return <SkeletonArticleCard/>
  }

  const articleAttributes = article.attributes;
  const coverAttributes = (articleAttributes.thumbnail as ApiResponseMedia).data.attributes;

  const handleBeforeTransition = () => {
    if (imageRef.current) {
      imageRef.current.style.viewTransitionName = 'banner-img'
    }
  };
  const handleAfterTransition = () => {
    if (imageRef.current) {
      imageRef.current.style.viewTransitionName = '';
    }
  }

  return (
    <div ref={containerRef}>
      <WithImagePrefetch
        src={`/${coverAttributes.name}`}
        height={coverAttributes.height}
        width={coverAttributes.width}
        prefetchSize="100vw"
      >
        <Link
          beforeTransition={handleBeforeTransition}
          afterTransition={handleAfterTransition}
          href={`/blog/${articleAttributes.slug}/`}
          placeholderData={article}
          className={'pointer-events-auto card-link'}
        >
          <article className="flex flex-col items-start justify-between card pointer-events-none">
            <div className="relative w-full">
              <Image
                className="lg:aspect-[16/9] aspect-[4/3]"
                priority={priority}
                thumbhash={coverAttributes.thumbhash}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                ref={imageRef}
                src={`/${coverAttributes.name}`}
                alt={coverAttributes.alternativeText}
                width={coverAttributes.width}
                height={coverAttributes.height}
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10"/>
            </div>
            <div className="w-full">
              <h3 className="mt-4 text-2xl font-bold line-clamp-3 4xl:text-regular-18 group-hover:text-gray-600">
                {articleAttributes.title}
              </h3>
              <div className="relative z-10 mt-3 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-200">
                <RichText content={articleAttributes.description} className="prose" />
              </div>
            </div>
          </article>
        </Link>
      </WithImagePrefetch>

    </div>
  )
}