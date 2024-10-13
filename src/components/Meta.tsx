import React from 'react';
import Head from 'next/head';

interface Props {
  title: string;
  description: string;
}

export const Meta: React.FC<Props> = ({
  title,
  description,
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="title" content={title}/>
      <meta name="description" content={description}/>
    </Head>
  );
}
