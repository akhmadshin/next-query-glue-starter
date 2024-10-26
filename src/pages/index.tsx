import { HomePage } from '@/routes/HomePage';
import { withSSRTanStackQuery } from '@/lib/withSSRTanStackQuery';
import { getMockArticleList } from '@/routes/BlogItemPage/getMockArticleList';

const articles = [
  getMockArticleList(0),
  getMockArticleList(1),
  getMockArticleList(2),
  getMockArticleList(3),
]

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
