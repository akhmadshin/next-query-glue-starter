import React, { useRef } from 'react';
import { usePageData } from '@/hooks/usePageData';
import { BlogItemPageProps } from '@/types/pages/blogItemPage';
import { Container } from '@/components/Container';
import { Meta } from '@/components/Meta';
import { Image } from '@/components/image';
import { RichText } from '@/components/RichText';
import { SkeletonBlogItemPage } from '@/routes/BlogItemPage/SkeletonBlogItemPage';
import { ParentComponent } from '@/types/general';
import { BlogItemPostPageLoader } from './BlogItemPostPageLoader';

export const BlogItemPrePage: ParentComponent = ({ children }) => {
  const { data: article, isLoading, isFetching} = usePageData<BlogItemPageProps>();

  const imgContainerRef = useRef<HTMLDivElement>(null);

  if (!article && (isLoading || isFetching)) {
    return (
      <SkeletonBlogItemPage>
        <BlogItemPostPageLoader />
      </SkeletonBlogItemPage>
    );
  }
  if (!article || !article.attributes) {
    return children;
  }

  const articleAttributes = article.attributes || {};
  const coverAttributes = articleAttributes.thumbnail.data!.attributes || {};
  const {title, description } = articleAttributes;

  return (
    <Container>
      <Meta
        title={title}
        description={'Lorem ipsum dolor sit amet ...'}
      />
      <article className="flex flex-col dark:text-gray-50">
        <div className="flex flex-col space-y-6">
          <div className="prose lg:prose-xl dark:prose-invert max-w-none">
            <h1>{title}</h1>
          </div>
          <div ref={imgContainerRef}>
            <Image
              className="lg:aspect-[16/9] aspect-[4/3] transition-img transitionable-img"
              priority
              sizes="100vw"
              src={`/${coverAttributes.name}`}
              thumbhash={coverAttributes.thumbhash}
              alt={coverAttributes.alternativeText}
              width={coverAttributes.width}
              height={coverAttributes.height}
            />
          </div>
        </div>
        <div className="flex flex-col space-y-6">
          <div className="text-xl mt-8">
            <RichText content={description}/>
          </div>
          {children}
        </div>
      </article>
    </Container>
  )
}
