import React from 'react';

import { Link } from '@/components/Link';
import { Container } from '@/components/Container';

export function Header() {
  const navClassName = 'flex items-center gap-4 md:gap-6 lg:gap-12';

  return (
    <header>
      <Container className="mb-16 main-header">
        <div className="flex justify-between items-center flex-1 pt-6 gap-6">
          <div className={navClassName}>
            <Link
              href="/"
              aria-label="Home"
            >
              <span className="font-bold">Home</span>
            </Link>
            {/*<NextLink*/}
            {/*  href="/blog/3-ways-to-achieve-instant-navigation/"*/}
            {/*  aria-label="Article"*/}
            {/*>*/}
            {/*  <span className="font-bold">Article</span>*/}
            {/*</NextLink>*/}
          </div>
        </div>
      </Container>
    </header>
  )
}