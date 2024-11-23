import { Component } from '@/types/general';
import { SkeletonText } from '@/components/skeletons/SkeletonText';
import { SkeletonImage } from '@/components/skeletons/SkeletonImage';

export const SkeletonArticleCard: Component = () => {
  return (
    <article className="flex flex-col items-start justify-between">
      <SkeletonImage />
      <div className=" w-full">
        <div >
          <SkeletonText className="mt-4 text-2xl font-bold line-clamp-3 4xl:text-regular-18" as="h3" width="45%"/>
        </div>

        <div className="relative z-10 mt-5 line-clamp-3 text-sm leading-6 flex flex-col">
          <SkeletonText className="mt-1px" width="85%"/>
          <SkeletonText className="mt-1px" width="92%"/>
          <SkeletonText className="mt-1px" width="60%"/>
        </div>
      </div>
    </article>
  )
}