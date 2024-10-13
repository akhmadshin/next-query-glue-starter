import { Html, Head, Main, NextScript } from 'next/document'
import React from 'react';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico"/>
      </Head>

      <body
        className="relative min-h-screen overflow-x-hidden bg-background font-sans antialiased transition-[background] scroll-smooth"
      >
      <Main/>
      <NextScript/>
      </body>
    </Html>
  )
}
