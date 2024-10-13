import { BlogItemPage } from '@/routes/BlogItemPage';
import { promises as fs } from 'fs';
import path from 'path';
import { withSSRTanStackQuery } from '@/lib/withSSRTanStackQuery';
import { ArticleItemApi } from '@/types/api';

export default function Page() {
  return (
    <BlogItemPage />
  )
}
export const getServerSideProps = withSSRTanStackQuery<ArticleItemApi, { slug: string }>(async ({ params, req }) => {
  const { slug } = params ?? {};
  try {
    const file = await fs.readFile(path.resolve(`public/mocks/${slug}.json`), 'utf-8')
    return {
      props: JSON.parse(file) as ArticleItemApi,
    }
  } catch (err) {
    console.log('err = ', err);
    return {
      notFound: true,
    }
  }
})