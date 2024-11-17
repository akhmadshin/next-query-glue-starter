import { ParentComponent } from '@/types/general';
import { ReactNode, useEffect, useState } from 'react';

interface Props {
  loader?: ReactNode;
  defer?: boolean;
}
export const WithDeferOnViewTransition: ParentComponent<Props> = ({ children, loader }) => {
  const [visible, setVisible] = useState(typeof window === 'undefined' || !window.transition)
  console.log('WithDeferOnViewTransition window.transition = ', window.transition);
  console.log('WithDeferOnViewTransition visible = ', visible);

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
      return (
        <div className="no-view-transition">
          {loader}
        </div>
      );
    }
    return null;
  }

  return (
    <div className="no-view-transition">
      {children}
    </div>
  );
}