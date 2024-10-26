export interface TextInlineNode {
  type: 'text';
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

interface LinkInlineNode {
  type: 'link';
  url: string;
  children: TextInlineNode[];
}
type DefaultInlineNode = TextInlineNode | LinkInlineNode;

export interface HeadingBlockNode {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: DefaultInlineNode[];
}
