import React from 'react';

import { Link } from '@/components/Link';
import { Container } from '@/components/Container';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { GithubIcon } from 'lucide-react';

export function Header() {
  const router = useRouter();

  return (
    <header className="main-header sticky top-0 z-50 dark:bg-neutral-900 bg-neutral-50 border solid">
      <Container className="">
        <div className="flex justify-between items-center flex-1 gap-6 h-16">
          <div className="flex items-center space-x-8">
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

            <Link
              className={cn(
                "border-b-4",
                router.pathname.startsWith('/demo') ? "border-neutral-950 dark:border-gray-200" : 'border-transparent',
              )}
              href="/demo/"
              aria-label="Demo"
            >
              <div className="flex items-center h-9">
                <span className="font-bold">
                Demo
              </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <a href="https://github.com/akhmadshin/next-query-glue-starter" target="_blank">
              <GithubIcon className="h-[1.2rem] w-[1.2rem]" />
            </a>
            <ThemeSwitch />
          </div>
        </div>
      </Container>
    </header>
  )
}