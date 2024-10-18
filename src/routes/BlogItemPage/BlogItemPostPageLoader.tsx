import { WithDeferOnViewTransition } from '@/hocs/WithDeferOnViewTransition';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const BlogItemPostPageLoader = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <WithDeferOnViewTransition>
        <LoadingSpinner />
      </WithDeferOnViewTransition>
    </div>
  );
}
