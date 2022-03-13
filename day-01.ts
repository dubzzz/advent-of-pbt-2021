/**
 * Check whether a pattern is contained within a text. If so, where does it starts.
 *
 * @param searchString - The substring to search for in the string
 * @param text - The string where we should look for the substring
 *
 * @returns
 * The last index of pattern in text.
 */
export function lastIndexOf(searchString: string, text: string): number {
  // Inspired from Rabin-Karp but relying on a unique footprint*
  // *two distinct words cannot have the same
  if (searchString.length === 0) {
    return 0;
  }
  let requestedFootprint = 0n;
  for (let index = searchString.length - 1; index >= 0; --index) {
    requestedFootprint = (requestedFootprint << 16n) + BigInt(searchString.charCodeAt(index));
  }
  let movingFootprint = 0n;
  const startIndex = text.length - searchString.length;
  const modSize = 1n << (16n * BigInt(searchString.length));
  for (let index = text.length - 1; index >= 0; --index) {
    movingFootprint = ((movingFootprint << 16n) + BigInt(text.charCodeAt(index))) % modSize;
    if (index <= startIndex && movingFootprint === requestedFootprint) {
      return index;
    }
  }
  return -1;
}
