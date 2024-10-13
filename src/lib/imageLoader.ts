import { ImageLoaderProps } from 'next/image';

export default function imageLoader({ src, width }: ImageLoaderProps) {
  return `${src.replace('/', `/uploads/${width}_`)}`
}