import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import React from 'react';
import { TextInlineNode } from '@/types/strapi-blocks';
import { Link } from '@/components/Link';

interface Props {
  content: BlocksContent;
  className?: string;
}



export const stringToHash = (str: string) => str.toLowerCase()
  .replace(/[^a-z]/gi, '_')
  .split('_')
  .filter((e) => e)
  .join('_')

export const RichText: React.FC<Props> = ({ content, className = 'prose lg:prose-xl' }) => {
  let hasContent = false;

  if (content && content.length >= 1 && content[0] && content[0].children.length >= 1 && content[0].children[0]) {
    hasContent = (content[0].children[0] as TextInlineNode).text !== '';
  }

  if (!hasContent) {
    return null;
  }
  return (
    <div className={`${className} dark:prose-invert max-w-none`}>
      <BlocksRenderer
        content={content}
        blocks={{
          link: ({ children, url }) => {
            if (url.startsWith('#')) {
              return <Link href={url}>{children}</Link>
            }
            return <a href={url} target="_blank">{children}</a>;
          },
          heading: (props) => {
            const {children, level } = props;
            switch (level) {
              case 2:
                const headerText = (children as { props: { text: TextInlineNode }}[])!.map((m) => m.props.text).join();
                if (headerText) {

                  const hash = stringToHash(headerText);
                  return (
                    <Link href={`#${hash}`}>
                      <h2 id={hash}>{children}</h2>
                    </Link>
                  )
                }
                return <h2>{children}</h2>
            }
          },
        }}
      />
    </div>
  )
}