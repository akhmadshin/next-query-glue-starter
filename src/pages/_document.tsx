import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="relative min-h-screen overflow-x-hidden bg-background font-sans antialiased transition-[background]">
        <Main/>
        <NextScript/>
      </body>
    </Html>
  );
}
