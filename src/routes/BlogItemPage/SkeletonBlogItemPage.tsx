import { ParentComponent } from '@/types/general';
import { Container } from '@/components/Container';
import { SkeletonText } from '@/components/skeletons/SkeletonText';
import { SkeletonImage } from '@/components/skeletons/SkeletonImage';
import { SkeletonDescription } from '@/components/skeletons/SkeletonDescription';

export const SkeletonBlogItemPage: ParentComponent = ({ children }) => {
  return (
    <Container className="">
      <div className="flex flex-col space-y-8 dark:text-gray-50">
        <div className="flex flex-col  space-y-6">
          <SkeletonText as="h1" className="leading-tight text-5xl font-bold" width="65%"/>
          <div className="relative w-full transition-img">
            <SkeletonImage />
          </div>
        </div>
        <div className="dark:text-gray-100">
          <SkeletonDescription />
          <div className="mt-10">
            <div className="prose lg:prose-xl max-w-none dark:prose-invert flex flex-col">
              <SkeletonText width="65%" as={'h2'} />
              <SkeletonText width="90%"/>
              <SkeletonText width="93%"/>
              <SkeletonText width="85%"/>
              <SkeletonText width="98%"/>
              <SkeletonText width="92%"/>
              <SkeletonText width="95%"/>
              <SkeletonText width="91%"/>
              <SkeletonText width="60%"/>
            </div>
          </div>
        </div>
        {children}
      </div>
    </Container>
  );
}