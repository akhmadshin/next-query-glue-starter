import { ParentComponent } from '@/types/general';
import { HTMLProps } from 'react';

export const Container: ParentComponent<HTMLProps<HTMLDivElement>> = (
  {children, ...props},
) => {
  return (
    <div
      {...props}
      className="relative px-6 sm:px-10 lg:px-12 w-full"
    >
      <div className="mx-auto max-w-2xl lg:max-w-7xl">{children}</div>
    </div>
  )
}
