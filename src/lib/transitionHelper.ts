interface Props {
  skipTransition?: boolean;
  classNames?: string[];
  update: () => Promise<void>;
  onFinish?: () => void;
}

export function transitionHelper({
  skipTransition = false,
  update,
  onFinish,
}: Props) {
  if (skipTransition || !document.startViewTransition) {
    const updateCallbackDone = Promise.resolve(update());
    return {
      ready: Promise.resolve(Error('View transitions unsupported')),
      updateCallbackDone,
      finished: updateCallbackDone.then(() => {
        if (onFinish) {
          onFinish();
        }
      }),
      skipTransition: () => undefined,
    };
  }

  const transition = document.startViewTransition(update);
  window.transition = transition;
  transition.finished
    .catch((e: string) => {
      throw new Error(e);
    })
    .finally(() => {
        window.transition = undefined;
        const el = document.querySelector<HTMLImageElement>(`[style*='view-transition-name']`);
        if (el) {
          el.style.viewTransitionName = '';
        }
        if (onFinish) {
          onFinish();
        }
      }
    );
  return transition;
}