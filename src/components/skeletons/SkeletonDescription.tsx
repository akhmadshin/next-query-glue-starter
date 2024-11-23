import { SkeletonText } from '@/components/skeletons/SkeletonText';
import { Component } from '@/types/general';

export const SkeletonDescription: Component = () => {
  return (
      <div className="flex flex-col text-sm leading-6">
      <SkeletonText width="95%"/>
      <SkeletonText width="75%"/>
      <SkeletonText width="60%"/>
      <SkeletonText width="40%"/>
    </div>
  );
}
