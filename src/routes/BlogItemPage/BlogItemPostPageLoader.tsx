import { LoadingSpinner } from '@/components/LoadingSpinner';

export const BlogItemPostPageLoader = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="basis-1/2 flex items-center justify-center">
        <LoadingSpinner />
      </div>
      <div className="basis-1/2" />
    </div>
  );
}
