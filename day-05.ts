/**
 * You're given a message where spaces have been removed.
 * Your aim is to find back the original message given a dictionary containing all the words.
 * As many messages could be encoded the same way, you may have to return two or more messages.
 * No specific ordering is expected when multiple solutions are available but all must be returned.
 *
 * @example
 * ```typescript
 * respace('helloworld', ['hello', 'world'])  // ['hello world']
 * respace('hellowooorld', ['hello', 'world'])  // []
 * respace('tititi', ['ti', 'titi'])  // ['ti titi', 'titi ti', 'ti ti ti']
 * ```
 *
 * @param spacelessMessage - Message without any spaces
 * @param words - List of accepted words (no repeat and at least one character long)
 *
 * @returns
 * All the possible messages made only with the received words that could have led to this spaceless-message.
 */
export function respace(spacelessMessage: string, words: string[]): string[] {
  return respaceInternal(spacelessMessage, words, 0).map((answer) =>
    answer.join(" ")
  );
}

function respaceInternal(
  spacelessMessage: string,
  words: string[],
  startIndex: number
): string[][] {
  if (startIndex === spacelessMessage.length) {
    return [[]];
  }
  const combinations: string[][] = [];
  for (const word of words) {
    if (spacelessMessage.startsWith(word, startIndex)) {
      for (const subCombination of respaceInternal(
        spacelessMessage,
        words,
        startIndex + word.length
      )) {
        combinations.push([word, ...subCombination]);
      }
    }
  }
  return combinations;
}
