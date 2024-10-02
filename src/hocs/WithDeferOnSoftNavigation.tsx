import { Component, ParentComponent } from '@/types/general';
import { useEffect, useState } from 'react';
import { useTimeout } from 'usehooks-ts';

interface Props {
  loader?: Component;
  defer?: boolean;
}
export const WithDeferOnSoftNavigation: ParentComponent<Props> = ({ children }) => {
  const [visible, setVisible] = useState(typeof window === 'undefined' || !window.pageMounted || !document.startViewTransition)


  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    document.addEventListener('transitionFinished', () => {
      setVisible(true)
    })
  }, []);

  return visible ? children : null;
}