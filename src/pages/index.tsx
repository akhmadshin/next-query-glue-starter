import { promises as fs } from 'fs';
import { HomePage } from '@/routes/HomePage';
import { withSSRTanStackQuery } from '@/lib/withSSRTanStackQuery';
import { APIResponseCollection } from '@/types/strapi';
import path from 'path';

export const getServerSideProps = withSSRTanStackQuery<any>(async ({ req }) => {
  const file = await fs.readFile(path.resolve(`public/mocks/articles.json`), 'utf-8')
  return {
    props: JSON.parse(file) as APIResponseCollection<'api::article.article'>
  };
})

export default function Page() {
  return (
    <HomePage />
  )
}
