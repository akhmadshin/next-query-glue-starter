import React, { useMemo } from 'react';
import { Image } from '@/components/image';
import { MOCK_THUMBNAILS } from '@/constants/MOCK_THUMBNAILS';
import { useRouter } from 'next/router';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { Link } from '@/components/Link';
import { Container } from '@/components/Container';

const r = /\d+/;



const Page = () => {
  const router = useRouter()

  const id = useMemo(() => {
    const slug = router.query.slug as string;
    const slugInt = slug ? parseInt(slug.match(r)![0]) : 0;
    return slugInt ?? 0;
  }, [router]);

  const cover = MOCK_THUMBNAILS[id % 4];

  const nextImages = [
    MOCK_THUMBNAILS[(id + 1) % 4],
    MOCK_THUMBNAILS[(id + 2) % 4],
    MOCK_THUMBNAILS[(id + 3) % 4],
    MOCK_THUMBNAILS[(id + 4) % 4],
  ]

  return (
    <Container>
      <Image
        className="aspect-[16/9] transition-img transitionable-img"
        priority
        sizes="100vw"
        src={`/${cover.data.attributes.name}`}
        thumbhash={cover.data.attributes.thumbhash}
        alt={cover.data.attributes.alternativeText}
        width={cover.data.attributes.width}
        height={cover.data.attributes.height}
      />
      <div className="my-16 block">
        <Carousel
          opts={{
            dragFree: true,
            align: "start",
          }}
          className="w-full max-w-7xl mx-auto"
        >
          <CarouselContent>
            {nextImages && nextImages.map((img, index) => (
              <CarouselItem key={index} className={cn(
                'basis-1/2 md:basis-1/3 lg:basis-1/4',
                index === 0 && 'pl-4 xs:pl-6 sm:pl-10 lg:pl-12 xl:pl-0',
                index === nextImages.length - 1 && 'pr-4 xs:pr-6 sm:pr-10 lg:pr-12 xl:pr-0',
              )}>
                <Link href={`/demo/${id + index + 1}`}>
                  <Image
                    className="aspect-[16/9] transitionable-img"
                    priority
                    sizes="100vw"
                    src={`/${img.data.attributes.name}`}
                    thumbhash={img.data.attributes.thumbhash}
                    alt={img.data.attributes.alternativeText}
                    width={img.data.attributes.width}
                    height={img.data.attributes.height}
                  />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </Container>
  );
};

export default Page;