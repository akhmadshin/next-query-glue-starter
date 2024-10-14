declare global {
  interface Window {
    pageMounted?: () => void;
    placeholderData?: object;
    transition?: ViewTransition;
    transitionImg?: string;
  }
}

export {};