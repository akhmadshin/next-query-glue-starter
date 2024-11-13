declare global {
  interface Window {
    pageMounted?: () => void;
    placeholderData?: object;
    transition?: ViewTransition;
    transitionImg?: string;
    imageSelectorByPathName?: Record<string, string>;
  }
}

export {};