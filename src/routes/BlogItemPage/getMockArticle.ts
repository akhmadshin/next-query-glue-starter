import articlesList from '../../../public/mock.json';
import { getMockArticleList } from './getMockArticleList';

export const getMockArticle = (origId: number) => {
  const id = origId % 20;
  const relatedArticles = [
    getMockArticleList(origId + 1),
    getMockArticleList(origId + 2),
    getMockArticleList(origId + 3),
    getMockArticleList(origId + 4),
  ];
  const title = `Lorem ipsum ${origId}`;
  const slug = `lorem-ipsum-${origId}`;
  return {
    ...articlesList[id],
    attributes: {
      ...articlesList[id].attributes,
      relatedArticles,
      title,
      slug,
    }
  }
};