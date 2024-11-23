import { Rectangle } from '@/lib/rectangleCollide';

export function getElementAbsolutePosition(element: HTMLElement | null) {
	if (!element) {
		return;
	}
	const rect = element.getBoundingClientRect();
	return {
		x: rect.left + window.pageXOffset,
		y: rect.top + window.pageYOffset,
		width: rect.width,
		height: rect.height
	} as Rectangle;
}
