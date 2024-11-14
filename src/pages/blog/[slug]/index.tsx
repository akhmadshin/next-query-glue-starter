import { withSSRTanStackQuery } from '@/lib/withSSRTanStackQuery';
import { ArticleItemApi } from '@/types/api';
import { getMockArticle } from '@/routes/BlogItemPage/getMockArticle';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { BlogItemPage } from '@/routes/BlogItemPage';

const r = /\d+/;

export const getServerSideProps = withSSRTanStackQuery<ArticleItemApi, { slug: string }>(async ({ params }) => {
  const { slug } = params ?? {};
  let slugInt = slug ? parseInt(slug.match(r)![0]) : 0;
  slugInt = slugInt ?? 0;

  return {
    props: getMockArticle(slugInt) as ArticleItemApi,
  }
})

const Page: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
  return <BlogItemPage />;
};

export default Page;