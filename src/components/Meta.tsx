import React from 'react';
import Head from 'next/head';

interface Props {
  title: string;
  canonical?: string;
  description: string;
}

export const Meta: React.FC<Props> = ({title, description}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description}/>
      <meta name="og:title" content={title}/>
      <meta name="og:description" content={description}/>
    </Head>
  );
}
