import { requestIdleCallback } from '@/lib/request-idle-callback';

interface Props {
  skipTransition?: boolean;
  classNames?: string[];
  update: () => Promise<void>;
  onFinish?: () => void;
}
const transitionFinished = new CustomEvent("transitionFinished", {
  detail: {},
});

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
        requestIdleCallback(() => {
          document.dispatchEvent(transitionFinished);
        })
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
        document.dispatchEvent(transitionFinished)
        if (onFinish) {
          onFinish();
        }
      }
    );
  return transition;
}