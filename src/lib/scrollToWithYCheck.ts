export const scrollToWithYCheck = (scroll?: { x: number, y: number }) => {
  let scrollPos = scroll!;
  const scrollMaxY = document.documentElement.scrollHeight - document.documentElement.clientHeight + 1;
  if (!scroll || scroll.y > scrollMaxY) {
    scrollPos = { x: 0, y: 0 };
  }
  scrollTo({ top: scrollPos.y, left: scrollPos.x, behavior: 'instant' });
}