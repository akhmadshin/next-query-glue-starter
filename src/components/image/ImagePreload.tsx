import ReactDOM from 'react-dom'
import { ImgProps } from 'next/dist/shared/lib/get-img-props';
import Head from 'next/head';
import { generateImgSrc } from './generateImgSrcSet';

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