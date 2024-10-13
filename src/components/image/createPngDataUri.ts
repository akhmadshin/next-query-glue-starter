import { thumbHashToRGBA } from 'thumbhash';

export function createPngDataUri(hash?: string) {
	if (!hash) {
		return hash;
	}
	const { w, h, rgba } = thumbHashToRGBA(base64ToBytes(hash))
	return rgbaToDataUri(w, h, rgba)
}

function base64ToBytes(value: string) {
	const base64 = value.replace(/-/g, '+').replace(/_/g, '/')

	const decodedData = typeof Buffer !== 'undefined' ? Buffer.from(base64, 'base64')
		: Uint8Array.from(atob(base64), char => char.charCodeAt(0))

	return new Uint8Array(decodedData)
}

function rgbaToDataUri(
	/** The width of the input image. Must be ≤100px. */
	w: number,
	/** The height of the input image. Must be ≤100px. */
	h: number,
	/** The pixels in the input image, row-by-row. Must have w*h*4 elements. */
	rgba: ArrayLike<number>,
) {
	const row = w * 4 + 1
	const idat = 6 + h * (5 + row)
	const bytes = [
		137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0,
		w >> 8, w & 255, 0, 0, h >> 8, h & 255, 8, 6, 0, 0, 0, 0, 0, 0, 0,
		idat >>> 24, (idat >> 16) & 255, (idat >> 8) & 255, idat & 255,
		73, 68, 65, 84, 120, 1,
	]
	const table = [
		0, 498536548, 997073096, 651767980, 1994146192, 1802195444, 1303535960,
		1342533948, -306674912, -267414716, -690576408, -882789492, -1687895376,
		-2032938284, -1609899400, -1111625188,
	]
	let a = 1
	let b = 0

	for (let y = 0, i = 0, end = row - 1; y < h; y++, end += row - 1) {
		bytes.push(y + 1 < h ? 0 : 1, row & 255, row >> 8, ~row & 255, (row >> 8) ^ 255, 0)
		for (b = (b + a) % 65521; i < end; i++) {
			const u = rgba[i] & 255
			bytes.push(u)
			a = (a + u) % 65521
			b = (b + a) % 65521
		}
	}

	bytes.push(
		b >> 8, b & 255, a >> 8, a & 255, 0, 0, 0, 0,
		0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130,
	)

  // eslint-disable-next-line prefer-const
	for (let [start, end] of [[12, 29], [37, 41 + idat]]) {
		let c = ~0
		for (let i = start; i < end; i++) {
			c ^= bytes[i]
			c = (c >>> 4) ^ table[c & 15]
			c = (c >>> 4) ^ table[c & 15]
		}

		c = ~c
		bytes[end++] = c >>> 24
		bytes[end++] = (c >> 16) & 255
		bytes[end++] = (c >> 8) & 255
		bytes[end++] = c & 255
	}

	const base64 = typeof Buffer !== 'undefined' ? Buffer.from(new Uint8Array(bytes)).toString('base64')
		: btoa(String.fromCharCode(...bytes))

	return `data:image/png;base64,${base64}`
}