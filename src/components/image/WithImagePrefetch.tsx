import { ParentComponent } from '@/types/general';
import React, { useState } from 'react';
import { ImagePreload } from '@/components/image/ImagePreload';

interface Props {
  prefetchSize: string;
  src: string;
  height: number;
  width: number;
}
export const WithImagePrefetch: ParentComponent<Props> = ({ prefetchSize, src, height, width, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    if (prefetchSize && !isHovered) {
      setIsHovered(true);
    }
  }
  return (
    <div onMouseEnter={handleMouseEnter}>
      {children}
      {isHovered && (
        <ImagePreload
          isAppRouter={false}
          src={src}
          sizes={prefetchSize}
          height={height}
          width={width}
        />
      )}
    </div>
  )
}