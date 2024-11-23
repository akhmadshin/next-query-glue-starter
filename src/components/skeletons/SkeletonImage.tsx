import { Component } from '@/types/general';

export const SkeletonImage: Component = () => {
  return (
    <div className="aspect-[16/9] w-full rounded-2xl bg-zinc-200 dark:bg-zinc-400 object-cover animate-pulse"></div>
  );
};
