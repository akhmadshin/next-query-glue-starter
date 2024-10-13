import { ParentComponent } from '@/types/general';
import { ReactNode, useEffect, useState } from 'react';

interface Props {
  loader?: ReactNode;
  defer?: boolean;
}
export const WithDeferOnViewTransition: ParentComponent<Props> = ({ children, loader }) => {
  const [visible, setVisible] = useState(typeof window === 'undefined' || !window.transition)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    document.addEventListener('transitionFinished', () => {
      setTimeout(() => {
        setVisible(true);
      }, 0)
    })
  }, []);

  if (!visible) {
    if (loader) {
      return loader;
    }
    return null;
  }

  return children;
}