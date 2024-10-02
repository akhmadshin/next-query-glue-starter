interface Props {
  skipTransition?: boolean;
  classNames?: string[];
  update: () => Promise<void>;
  types?: string[];
  onFinish?: () => void;
}
export function transitionHelper({
  skipTransition = false,
  types = [],
  update,
  onFinish,
}: Props) {

  if (skipTransition || !document.startViewTransition) {
    const updateCallbackDone = Promise.resolve(update());

    return {
      ready: Promise.resolve(Error('View transitions unsupported')),
      updateCallbackDone,
      finished: updateCallbackDone,
      skipTransition: () => undefined,
    };
  }

  const transition = document.startViewTransition(update);
  transition.finished
    .catch((e: string) => {
      throw new Error(e);
    })
    .finally(() => {
      const el = document.querySelector<HTMLImageElement>(`[style*='view-transition-name']`);
      if (el) {
        el.style.viewTransitionName = '';
      }
      const transitionFinished = new CustomEvent("transitionFinished", {
        detail: {},
      });
      document.dispatchEvent(transitionFinished)
      if (onFinish) {
        onFinish();
      }
    }
  );
  return transition;
}