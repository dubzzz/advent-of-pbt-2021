/**
 * Each year, Santa receives wish lists coming from everywhere.
 *
 * Lists are ordered starting by the most important present to the last
 * important one. Santa does not always offer the most important one.
 * From time to time he wants to wait one more year to check if the
 * present stays in the top.
 *
 * Each year, Santa manually performs a diff of the list with
 * the one of the year before. Based on this diff he makes his choice.
 *
 * You can see the diff manually computed by Santa as an usual git diff
 * between two strings including many lines.
 *
 * Let's take the example:
 *
 *   Year N:
 *     Cars
 *     Trains
 *     Planes
 *
 *   Year N+1:
 *     Cars
 *     Buses
 *     Trains
 *     Boats
 *
 *   Diff of Santa:
 *     === Cars
 *     +++ Buses
 *     === Trains
 *     +++ Boats
 *     --- Planes
 *
 * @param before - String representing the list of presents (before)
 * @param after - String representing the list of presents (after)
 */
export function wishListsDiffer(before: string, after: string): string {
  const beforeLines = before.split("\n");
  const afterLines = after.split("\n");
  const sharedLines = longestCommonSubarray(beforeLines, afterLines, 0, 0, []);

  const diffLines: string[] = [];
  let indexBefore = 0;
  let indexAfter = 0;
  for (const sharedLine of sharedLines) {
    for (; afterLines[indexAfter] !== sharedLine; ++indexAfter) {
      diffLines.push("+++ " + afterLines[indexAfter]);
    }
    for (; beforeLines[indexBefore] !== sharedLine; ++indexBefore) {
      diffLines.push("--- " + beforeLines[indexBefore]);
    }
    ++indexBefore;
    ++indexAfter;
    diffLines.push("=== " + sharedLine);
  }
  for (; indexAfter !== afterLines.length; ++indexAfter) {
    diffLines.push("+++ " + afterLines[indexAfter]);
  }
  for (; indexBefore !== beforeLines.length; ++indexBefore) {
    diffLines.push("--- " + beforeLines[indexBefore]);
  }
  return diffLines.join("\n");
}

function longestCommonSubarray(
  dataA: string[],
  dataB: string[],
  startA: number,
  startB: number,
  sharedCache: string[][][]
): string[] {
  if (dataA.length <= startA || dataB.length <= startB) {
    return [];
  }
  if (startA in sharedCache) {
    if (startB in sharedCache[startA]) {
      return sharedCache[startA][startB];
    }
  } else {
    sharedCache[startA] = [];
  }

  const optionSkippingStartA = longestCommonSubarray(
    dataA,
    dataB,
    startA + 1,
    startB,
    sharedCache
  );
  const indexStartAInB = dataB.indexOf(dataA[startA], startB);
  if (indexStartAInB === -1) {
    sharedCache[startA][startB] = optionSkippingStartA;
    return optionSkippingStartA;
  }
  const optionIncludingStartA = [
    dataA[startA],
    ...longestCommonSubarray(
      dataA,
      dataB,
      startA + 1,
      indexStartAInB + 1,
      sharedCache
    ),
  ];
  const bestOption =
    optionSkippingStartA.length < optionIncludingStartA.length
      ? optionIncludingStartA
      : optionSkippingStartA;
  sharedCache[startA][startB] = bestOption;
  return bestOption;
}
