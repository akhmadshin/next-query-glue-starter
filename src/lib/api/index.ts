import type { Common, Params } from "@turbostrapi/backend";
import qs from "qs";
import type {
  APIResponse,
  APIResponseCollection,
  APIUrlParams,
  ApiLocale,
} from "./types";

/**
 * IMPORTANT:
 * Add endpoints here that are queried from the frontend.
 * Mapping of Strapi content type UIDs to API endpoint paths.
 */
const API_ENDPOINTS: { [key in Common.UID.ContentType]?: string } = {
  "api::page.page": "/pages",
  "api::article.article": "/articles",
  // Add new endpoints here
};

export type APIEndpointUID = keyof typeof API_ENDPOINTS;

/**
 * Get Path of the API route by UID
 * @param uid - UID of the Endpoint
 * @returns API Endpoint path
 */
export function getStrapiApiPathByUId(uid: APIEndpointUID): string {
  const path = API_ENDPOINTS[uid];
  if (path) {
    return path;
  }
  throw new Error(
    `Endpoint for UID "${uid}" not found. Extend API_ENDPOINTS in lib/api/index.ts.`,
  );
}

/**
 * Get full Strapi URL from path
 * @param path - Path of the URL
 * @returns Full Strapi URL
 */
export function getStrapiURL(path = ""): string {
  const apiUrl = process.env.FRONTEND_BACKEND_URL ?? "http://localhost:1337";
  return `${apiUrl}${path}`;
}

/**
 * Helper to make GET requests to Strapi API endpoints
 * @param path - Path of the API route
 * @param params - URL params object, will be stringified
 * @param options - Options passed to fetch
 * @returns Parsed API call response
 */
export async function fetchAPI<TResult>(
  path: string,
  params = {},
  options = {},
): Promise<TResult> {
  try {
    const token = process.env.FRONTEND_BACKEND_API_SECRET ?? process.env.NEXT_PUBLIC_FRONTEND_BACKEND_API_SECRET;

    console.log('token = ', token);
    // Merge default and user options
    const mergedOptions = {
      next: { revalidate: 60 },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      ...options,
    };

    // Build request URL
    const queryString = qs.stringify(params);
    const requestUrl = `${getStrapiURL(
      `/api${path}${queryString ? `?${queryString}` : ""}`,
    )}`;

    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);

    // Handle response
    if (!response.ok) {
      throw new Error(
        `Request failed with status ${response.status}: ${response.statusText}`,
      );
    }
    return (await response.json());
  } catch (error) {
    console.error(error);
    throw new Error(`An error occurred while fetching from the API`);
  }
}

/**
 * Fetches a single entity by ID
 */
export async function fetchOne<
  TContentTypeUID extends Common.UID.ContentType,
  TParams extends APIUrlParams<TContentTypeUID>,
>(
  uid: TContentTypeUID,
  entityId: Params.Attribute.ID,
  params?: TParams,
  options = {},
): Promise<APIResponse<TContentTypeUID>> {
  const path = getStrapiApiPathByUId(uid);
  return fetchAPI<APIResponse<TContentTypeUID>>(
    `${path}/${entityId}`,
    params ?? {},
    options,
  );
}

/**
 * Fetches a single entity by slug
 */
export async function fetchOneBySlug<
  TContentTypeUID extends Common.UID.ContentType,
  TParams extends APIUrlParams<TContentTypeUID>,
>(
  uid: TContentTypeUID,
  slug: string | null,
  params?: TParams,
  options = {},
): Promise<APIResponse<TContentTypeUID>> {
  const slugFilter = slug && slug.length > 0 ? slug : { $null: true };
  const mergedParams = {
    ...params,
    sort: { publishedAt: "desc" },
    filters: { ...params?.filters, slug: slugFilter },
  };
  const path = getStrapiApiPathByUId(uid);
  const response = await fetchAPI<APIResponseCollection<TContentTypeUID>>(
    path,
    mergedParams,
    options,
  );
  // return last published entry
  return {
    data: response.data.pop() ?? null,
    meta: {},
  };
}

/**
 * Fetches multiple entities
 */
export async function fetchMany<
  TContentTypeUID extends Common.UID.ContentType,
  TParams extends APIUrlParams<TContentTypeUID>,
>(
  uid: TContentTypeUID,
  params: TParams,
  options = {},
): Promise<APIResponseCollection<TContentTypeUID>> {
  const path = getStrapiApiPathByUId(uid);
  return fetchAPI<APIResponseCollection<TContentTypeUID>>(
    path,
    params,
    options,
  );
}

/**
 * Fetches all i18n locales
 */
export async function fetchLocales(
  params?: APIUrlParams<"plugin::i18n.locale">,
  options = {},
): Promise<ApiLocale[]> {
  return fetchAPI<ApiLocale[]>("/i18n/locales", params ?? {}, options);
}

/**
 * Example usage
 */
// const pageParams: APIUrlParams<"api::page.page"> = {
//   sort: { createdAt: "desc" },
//   populate: {
//     sections: {
//       populate: "*",
//     },
//     seo: {
//       populate: "*",
//     },
//   },
// };

// fetchOne("api::page.page", 1, pageParams)
//   .then((res) => {
//     console.log("fetchOne | res", res);
//     res.data?.attributes.sections?.map((section) => {
//       console.log(section.id);
//     });
//   })
//   .catch((e) => {
//     console.error("fetchOne error", e);
//   });

// fetchMany("api::page.page", pageParams)
//   .then((res) => {
//     console.log("fetchMany -> pages | res", res);
//     res.data.map((page) => {
//       console.error("fetchMany -> map | page.attributes", page.attributes);
//     });
//     res.meta.pagination.page;
//   })
//   .catch((e) => {
//     console.error("fetchMany error", e);
//   });

// fetchOneBySlug("api::page.page", null, pageParams)
// .then((res) => {
//   console.log("fetchOneBySlug | res", res);
//   res.data?.attributes.sections?.map((section) => {
//     console.log(section.id);
//   });
// })
// .catch((e) => {
//   console.error("fetchOneBySlug error", e);
// });
