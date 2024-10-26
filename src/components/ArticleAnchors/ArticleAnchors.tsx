import { Component } from '@/types/general';
import * as React from 'react';
import { Link } from '@/components/Link';
import { Heading } from '@/types/api';

interface Props {
  headings: Heading[];
}

const mockHeadings = [
  { title: 'Gloriosa ostentatio', hash: 'gloriosa-ostentatio' },
  { title: 'Utrum igitur', hash: 'utrum-igitur' },
  { title: 'Estne, quaeso', hash: 'estne-quaeso' },
  { title: 'Maecenas viverra', hash: 'maecenas-viverra' },
] as Heading[];


export const ArticleAnchors: Component<Props> = ({ headings = mockHeadings }) => {
  return (
    <nav className="prose prose-slate lg:prose-xl dark:prose-invert max-w-none pb-12 md:pb-16">
      <h2>Table of contents:</h2>
      <ul>
        {Array.from(headings).map(({title, hash}, index) => (
          <li key={index}>
            <Link href={`#${hash}`}>
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}