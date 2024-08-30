export function timeout(ms: number = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
