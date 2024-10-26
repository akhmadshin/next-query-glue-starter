import { BlogItemPage } from '@/routes/BlogItemPage';
import { withSSRTanStackQuery } from '@/lib/withSSRTanStackQuery';
import { ArticleItemApi } from '@/types/api';
import { getMockArticle } from '@/routes/BlogItemPage/getMockArticle';

export default function Page() {
  return (
    <BlogItemPage />
  )
}
const r = /\d+/;

export const getServerSideProps = withSSRTanStackQuery<ArticleItemApi, { slug: string }>(async ({ params }) => {
  const { slug } = params ?? {};
  let slugInt = slug ? parseInt(slug.match(r)![0]) : 0;
  slugInt = slugInt ?? 0;

  return {
    props: getMockArticle(slugInt) as ArticleItemApi,
  }
})