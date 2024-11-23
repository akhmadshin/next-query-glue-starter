import { BlocksContent } from '@strapi/blocks-react-renderer';


export interface APIResponseCollectionPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}
export interface APIResponseCollectionMetadata {
  pagination: APIResponseCollectionPagination;
}

interface APIIdProperty {
  id: number;
}
export interface APIResponseData<Attributes>
  extends APIIdProperty {
  attributes: Attributes;
}

export interface APIResponse<TContentTypeUID> {
  data: APIResponseData<TContentTypeUID> | null;
  meta: object;
}

export interface APIResponseCollection<
  TContentTypeUID,
> {
  data: APIResponseData<TContentTypeUID>[];
  meta: APIResponseCollectionMetadata;
}

export interface Media {
  "thumbhash": string;
  "name": string;
  "alternativeText"?: string,
  "height": number,
  "width": number
}

export interface ApiResponseMedia {
  data: {
    id: number,
    attributes: Media
  }
}

export type ArticleListItem = {
  title: string;
  slug: string;
  description: BlocksContent;
  headings: Heading[];
  previewContent: BlocksContent;
  thumbnail: ApiResponseMedia;
}

export interface Heading {
  title: string;
  hash: string;
}
export interface ArticleItem extends ArticleListItem {
  content: BlocksContent;
  relatedArticles: APIResponseData<ArticleListItem>[];
}

export type ArticleListApi = APIResponseCollection<ArticleListItem>;

export type ArticleItemApi = APIResponseData<ArticleItem>;
