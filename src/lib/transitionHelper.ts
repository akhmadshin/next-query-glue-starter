interface Props {
  skipTransition?: boolean;
  classNames?: string[];
  updateDOM: () => Promise<void>;
  onFinish?: () => void;
}
export function transitionHelper({
  skipTransition = false,
  classNames = [],
  updateDOM,
  onFinish,
}: Props) {
  if (skipTransition || !document.startViewTransition) {
    const updateCallbackDone = Promise.resolve(updateDOM());

    return {
      ready: Promise.reject(Error('View transitions unsupported')),
      updateCallbackDone,
      finished: updateCallbackDone,
      skipTransition: () => undefined,
    };
  }

  document.documentElement.classList.add(...classNames);

  const transition = document.startViewTransition(updateDOM);
  transition.finished
    .catch((e: string) => {
      throw new Error(e);
    })
    .finally(() => {
      if (onFinish) {
        onFinish();
      }
    }
  );
  return transition;
}