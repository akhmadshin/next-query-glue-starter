import { Component } from '@/types/general';

interface Props {
  className?: string;
  width?: string;
  as?: 'span' | 'h1' | 'h2' | 'h3';
}

export const SkeletonText: Component<Props> = (
  {
    as = 'span',
    className = '',
    width,
  },
) => {
  const style = {
    width: width ?? 'auto',
    'animationFillMode': 'backwards',
    'animationDelay': '150ms',
  }
  const skeletonClassName = `${className} bg-zinc-200 dark:bg-zinc-400 animate-pulse`;
  if (as === 'span') {
    return (
      <span
        className={skeletonClassName}
        style={style}
      >
        &nbsp;
      </span>
    )
  }
  if (as === 'h1') {
    return (
      <h1
        className={skeletonClassName}
        style={style}
      >
        &nbsp;
      </h1>
    )
  }
  if (as === 'h2') {
    return (
      <h2
        className={skeletonClassName}
        style={style}
      >
        &nbsp;
      </h2>
    )
  }
  if (as === 'h3') {
    return (
      <h3
        className={skeletonClassName}
        style={style}
      >
        &nbsp;
      </h3>
    )
  }
  return (
    <></>
  );
};
