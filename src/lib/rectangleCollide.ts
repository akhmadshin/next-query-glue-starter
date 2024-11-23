export interface Rectangle {
	x: number;
	y: number;
	width: number;
	height: number;
}

export function isObserved(rect1: Rectangle, x: number, y: number) {
	const rect2 = {
		x,
		y,
		width: window.screen.width,
		height: window.screen.height
	}
	return (
		rect1.x < rect2.x + rect2.width &&
		rect1.x + rect1.width > rect2.x &&
		rect1.y < rect2.y + rect2.height &&
		rect1.y + rect1.height > rect2.y
	);
}
