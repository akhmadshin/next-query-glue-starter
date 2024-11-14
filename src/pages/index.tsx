import { HomePage } from '@/routes/HomePage';
import { withSSRTanStackQuery } from '@/lib/withSSRTanStackQuery';
import { getMockArticleList } from '@/routes/BlogItemPage/getMockArticleList';
import { InferGetServerSidePropsType, NextPage } from 'next';

const articles = Array.from(Array(20).keys()).map((id) => getMockArticleList(id));

export const getServerSideProps = withSSRTanStackQuery(async () => {
  return {
    props: {
      data: articles,
    }
  };
})

const Page: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
  return <HomePage />;
};

export default Page;