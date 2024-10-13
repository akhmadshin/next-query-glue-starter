import React from 'react';

import { Link } from '@/components/Link';
import { Container } from '@/components/Container';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';

export function Header() {
  const navClassName = 'flex items-center gap-4 md:gap-6 lg:gap-12';
  const router = useRouter();

  return (
    <header>
      <Container className="main-header">
        <div className="flex justify-between items-center flex-1 pt-6 gap-6">
          <div className={navClassName}>
            <Link
              className={cn(
                "border-b-4",
                router.pathname === '/' ? "border-neutral-950 dark:border-gray-200" : 'border-transparent',
              )}
              href="/"
              aria-label="Home"
            >
              <div className="flex items-center h-9">
                <span className="font-bold">
                Home
              </span>
              </div>
            </Link>
          </div>
          <div className={navClassName}>
            <ThemeSwitch />
          </div>
        </div>
      </Container>
    </header>
  )
}