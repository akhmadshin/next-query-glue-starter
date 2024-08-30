import { ApiLocale } from '@/lib/api/types';

declare global {
  interface Window {
    pageMounted?: () => void;
    pageMountedPromise?: Promise<void>;
    placeholderData?: object;
    isOptimisticNavigation?: boolean;
    locales?: {
      list: ApiLocale[];
      currentLocale: string;
      defaultLocale: string;
    };
    __NEXT_OPTIMISTIC_LINK_RENDERED_PATHNAME?: string;
  }
}
