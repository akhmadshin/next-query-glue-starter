declare global {
  interface Window {
    pageMounted?: () => void;
    placeholderData?: object;
    transition?: ViewTransition;
    transitionImg?: string;
    transitionHref?: string;
    imageSelectorByPathName?: Record<string, string>;
  }
}

export {};