/**
 * This file defines a workaround for utilizing generated types from Strapi
 * in a frontend application. As of now, Strapi doesn't provide an official
 * solution.
 *
 * GitHub Issue: {@link https://github.com/strapi/documentation/issues/1905}
 */

import type { Attribute, Common, Entity, Params } from "@turbostrapi/backend";

interface APIIdProperty {
  id: number;
}

export interface APIResponseData<TContentTypeUID extends Common.UID.ContentType>
  extends APIIdProperty {
  attributes: Attribute.GetValues<TContentTypeUID>;
}

export interface APIResponseCollectionPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface APIResponseCollectionMetadata {
  pagination: APIResponseCollectionPagination;
}

export interface APIResponse<TContentTypeUID extends Common.UID.ContentType> {
  data: APIResponseData<TContentTypeUID> | null;
  meta: object;
}

export interface APIResponseCollection<
  TContentTypeUID extends Common.UID.ContentType,
> {
  data: APIResponseData<TContentTypeUID>[];
  meta: APIResponseCollectionMetadata;
}

export type APILocaleCode = string;

type WithLocale<T> = T & { locale?: APILocaleCode };

export type APIUrlParams<TContentTypeUID extends Common.UID.ContentType> =
  WithLocale<
    Params.Pick<
      TContentTypeUID,
      | "fields"
      | "filters"
      | "sort"
      | "populate"
      | "publicationState"
      | "pagination"
    >
  > & {
  pagination?: Params.Pick<TContentTypeUID, "pagination">;
};

export interface ApiLocale {
  id: Entity.ID;
  createdAt: string;
  updatedAt: string;
  code: string;
  isDefault: boolean;
  name: string;
}
