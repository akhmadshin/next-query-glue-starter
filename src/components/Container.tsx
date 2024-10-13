import { ParentComponent } from '@/types/general';
import { HTMLProps } from 'react';

export const Container: ParentComponent<HTMLProps<HTMLDivElement>> = (
  {children, className, ...props},
) => {
  return (
    <div
      {...props}
      className={`relative px-4 xs:px-6 sm:px-10 lg:px-12 w-full ${className}`}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </div>
  )
}
