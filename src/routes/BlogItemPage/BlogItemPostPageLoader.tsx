import { WithDeferOnViewTransition } from '@/hocs/WithDeferOnViewTransition';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const BlogItemPostPageLoader = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="basis-1/2 flex items-center justify-center">
        <WithDeferOnViewTransition>
          <LoadingSpinner />
        </WithDeferOnViewTransition>
      </div>
      <div className="basis-1/2" />
    </div>
  );
}
