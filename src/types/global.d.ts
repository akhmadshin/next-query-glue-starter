declare global {
  interface Window {
    pageMounted?: () => void;
    placeholderData?: object;
    transition?: ViewTransition;
    transitionImgSrc?: string;
    transitionImgSelector?: string;
    transitionImgPosition?: string;
    routerKey?: string;
    routerKeyCopy?: string;
    routerKeyByHashRouteKey?: Record<string, string>;
    previousRouterKey?: string;
  }
}

export {};