/**
 * Check if an array contains two equal values
 * Comparison operator in use is `Object.is`
 *
 * @param data - Array of data
 *
 * @returns
 * `true` if `data` contains two values such as `Object.is(data[i], data[j])` is `true`
 * `false` otherwise
 */
export function hasDuplicates<T>(data: T[]): boolean {
  // We cannot use directly Set as Set collapse -0 and 0 to 0
  // meaning it considers -0 equals 0 which is not the case of Object.is
  const seenEntries = new Set<T>();
  let hasNegativeZero = false;
  for (const entry of data) {
    if (Object.is(entry, -0)) {
      if (hasNegativeZero) {
        return true;
      }
      hasNegativeZero = true;
    } else {
      if (seenEntries.has(entry)) {
        return true;
      }
      seenEntries.add(entry);
    }
  }
  return false;
}
