import { ParentComponent } from '@/types/general';
import React, { useState } from 'react';
import { ImgProps } from 'next/dist/shared/lib/get-img-props';
import { generateImgSrc } from '@/components/image/generateImgSrcSet';
import ReactDOM from 'react-dom';
import Head from 'next/head';

interface Props {
  prefetchSize: string;
  src: string;
  height: number;
  width: number;
}
export const WithImagePreload: ParentComponent<Props> = ({ prefetchSize, src, height, width, children }) => {
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

export const ImagePreload = ({
  isAppRouter,
  src,
  width,
  height,
  sizes,
}: {
  isAppRouter: boolean
  src: string;
  sizes: string;
  width: number | `${number}` | undefined;
  height: number | `${number}` | undefined;
}) => {
  const imgAttributes: ImgProps = {
    style: {},
    srcSet: generateImgSrc({
      width: window.innerWidth,
      src,
      sizes: sizes,
    }),
    src,
    alt: '',
    sizes: '100vw',
    loading: 'lazy',
    width: Number(width),
    height: Number(height),
  };
  const opts = {
    as: 'image',
    imageSrcSet: imgAttributes.srcSet,
    imageSizes: imgAttributes.sizes,
    crossOrigin: imgAttributes.crossOrigin,
    referrerPolicy: imgAttributes.referrerPolicy,
  }

  if (isAppRouter && ReactDOM.preload) {
    // See https://github.com/facebook/react/pull/26940
    ReactDOM.preload(
      imgAttributes.src,
      // @ts-expect-error TODO: upgrade to `@types/react-dom@18.3.x`
      opts
    )
    return null
  }

  return (
    <Head>
      <link
        key={
          '__nimg-' +
          imgAttributes.src +
          imgAttributes.srcSet +
          imgAttributes.sizes
        }
        rel="preload"
        href={imgAttributes.srcSet ? undefined : imgAttributes.src}
        {...opts}
      />
    </Head>
  )
}