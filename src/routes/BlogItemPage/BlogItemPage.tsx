import React from 'react';
import { usePageData } from '@/hooks/usePageData';
import { BlogItemPageProps } from '@/types/pages/blogItemPage';
import { Container } from '@/components/Container';
import { Meta } from '@/components/Meta';
import { Image } from '@/components/Image';
import { RichText } from '@/components/RichText';
import { SkeletonBlogItemPage } from '@/routes/BlogItemPage/SkeletonBlogItemPage';

export const BlogItemPage = () => {
  const { data: article, isLoading, isFetching} = usePageData<BlogItemPageProps>();

  if (!article && (isLoading || isFetching)) {
    return (
      <SkeletonBlogItemPage />
    );
  }
  if (!article) {
    return null;
  }

  const articleAttributes = article.attributes || {};
  const coverAttributes = articleAttributes.thumbnail.data!.attributes || {};

  const {title, description, content } = articleAttributes;

  return (
    <Container>
      <Meta
        title={title}
        description=""
      />
      <article className="flex flex-col dark:text-gray-50">
        <div className="flex flex-col space-y-6">
          <div className="prose lg:prose-xl dark:prose-invert max-w-none">
            <h1>{title}</h1>
          </div>
          <div className="banner-img">
            <Image
              className="lg:aspect-[16/9] aspect-[4/3]"
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
          <RichText content={content}/>
        </div>
      </article>
    </Container>
  )
}
