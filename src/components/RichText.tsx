import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import React from 'react';
import { TextInlineNode } from '@/types/strapi-blocks';

interface Props {
  content: BlocksContent;
  className?: string;
}

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
      />
    </div>
  )
}