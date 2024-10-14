import { promises as fs } from 'fs';
import { HomePage } from '@/routes/HomePage';
import { withSSRTanStackQuery } from '@/lib/withSSRTanStackQuery';
import path from 'path';
import { HomePageProps } from '@/types/pages/homePage';

export const getServerSideProps = withSSRTanStackQuery(async () => {
  const file = await fs.readFile(path.resolve(`public/mocks/articles.json`), 'utf-8')
  return {
    props: JSON.parse(file) as HomePageProps
  };
})

export default function Page() {
  return (
    <HomePage />
  )
}
