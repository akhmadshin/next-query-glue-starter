import { MOCK_THUMBNAILS } from '@/routes/BlogItemPage/MOCK_THUMBNAILS';
import { ArticleItemApi } from '@/types/api';

export const getMockArticleList = (id: number) => {
  return {
    id,
    attributes: {
      title: `Lorem ipsum ${id}`,
      description: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'Etiam finibus sit amet felis semper ultricies. Sed vestibulum vestibulum ipsum, vel consequat eros pellentesque sit amet. Proin nec dictum velit. Vestibulum mollis augue id lorem dictum, sed luctus tortor sollicitudin. In ut neque tortor. Maecenas ut bibendum erat, non varius magna. Proin placerat a magna quis congue. Fusce viverra dui sed ex aliquam, in consectetur erat aliquam. Integer sed venenatis elit. Integer porttitor in massa non facilisis. Aenean lobortis facilisis pretium. Praesent eu erat egestas, rutrum odio non, ultricies ligula.'
            }
          ]
        }
      ],
      slug: `lorem-ipsum-${id}`,
      thumbnail: MOCK_THUMBNAILS[id % MOCK_THUMBNAILS.length]
    }
  } as never as ArticleItemApi
};