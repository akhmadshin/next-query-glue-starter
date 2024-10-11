import { promises as fs } from 'fs';
import path from 'path';
import { withSSRTanStackQuery } from '@/lib/withSSRTanStackQuery';
import { HomePage } from '@/routes/HomePage';
import { APIResponseCollection } from '@/types/strapi';

export const getServerSideProps = withSSRTanStackQuery<any>(async ({ req }) => {
  const file = await fs.readFile(path.resolve(`public/mocks/articles.json`), 'utf-8')
  return {
    props: JSON.parse(file) as APIResponseCollection<'api::article.article'>
  };
})

export default function Home() {
  return (
    <HomePage />
  );
}
