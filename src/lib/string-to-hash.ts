export const stringToHash = (str: string) => str.toLowerCase()
  .replace(/[^a-z]/gi, '_')
  .split('_')
  .filter((e) => e)
  .join('_')