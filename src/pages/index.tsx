import { HomePage } from '@/routes/HomePage';
import { withSSRTanStackQuery } from '@/lib/withSSRTanStackQuery';
import { InferGetServerSidePropsType, NextPage } from 'next';
import articlesList from '../../public/mock.json';


export const articles = Array.from(Array(20).keys()).map((id) => articlesList[id]);

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