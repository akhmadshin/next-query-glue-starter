import { MouseEvent } from 'react';
import { ParentComponent } from '@/types/general';

interface Props {
  href: string
}
export const LinkAnchor: ParentComponent<Props> = ({ href, children }) => {
  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (!href.startsWith('#')) {
      return;
    }
    const target = document.querySelector(href);
    if (!target) {
      return;
    }
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
  return (
    <a href={href} onClick={handleAnchorClick}>
      {children}
    </a>
  )
}