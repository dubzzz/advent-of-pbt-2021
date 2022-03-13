/**
 * Produce a copy of the array but reversed
 * @param data - Reversed array
 */
export function reversed<T>(data: T[]): T[] {
  const reversedArray: T[] = [];
  for (let index = data.length - 1; index >= 0; --index) {
    reversedArray.push(data[index]);
  }
  return reversedArray;
}
