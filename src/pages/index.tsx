import { HomePage } from '@/routes/HomePage';
import { withSSRTanStackQuery } from '@/lib/withSSRTanStackQuery';
import { getMockArticleList } from '@/routes/BlogItemPage/getMockArticleList';

const articles = Array.from(Array(20).keys()).map((id) => getMockArticleList(id));

export const getServerSideProps = withSSRTanStackQuery(async () => {
  return {
    props: {
      data: articles,
    }
  };
})

export default function Page() {
  return (
    <HomePage />
  )
}
