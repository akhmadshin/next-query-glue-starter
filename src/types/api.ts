import { BlocksContent } from '@strapi/blocks-react-renderer';
import { APIResponse, APIResponseCollection, APIResponseData } from '@/types/strapi';

export interface Media {
  "thumbhash": string;
  "name": string;
  "alternativeText"?: string,
  "height": number,
  "width": number
}

export interface ApiResponseMedia {
  data: {
    attributes: Media
  }
}

export type ArticleListItem = {
  title: string;
  slug: string;
  description: BlocksContent;
  thumbnail: ApiResponseMedia;
}

export type ArticleItem = {
  title: string;
  slug: string;
  description: BlocksContent;
  thumbnail: APIResponse<Media>;
  sections: any[];
}

export type ArticleListApi = APIResponseCollection<ArticleListItem>;

export type ArticleItemApi = APIResponseData<ArticleItem>;
