/**
 * Santa' elves often want to know in advance what will be the plan
 * of Santa for the upcoming Christmas. As a consequence, they try
 * to spy on Santa by looking on top of a wall separating them from
 * him when Santa starts receiving letters.
 *
 * They usually try to mount on each others shoulders to have the exact
 * same height as the whole. But even if they tried many years in a raw
 * they have only succeeding with 1, 2 or 3 eleves.
 *
 * Could you help them in their mission?
 * In other words: could you return one, two or three elves (by index)
 * such as:
 *   height(elves[i]) = height(wall)
 * OR
 *   height(elves[i]) + height(elves[j]) = height(wall)
 * OR
 *   height(elves[i]) + height(elves[j]) + height(elves[k]) = height(wall)
 *
 * @param elvesHeight - Strictly positive integers representing
 *                      the heights of our elves
 * @param wallHeight - The height of the wall
 *
 * @returns
 * The one, two or three selected elves if there is a solution,
 * undefined otherwise.
 */
export function spyOnSanta(
  elvesHeight: number[],
  wallHeight: number
): number[] | undefined {
  return (
    spyOnSanta1(elvesHeight, wallHeight) ??
    spyOnSanta2(elvesHeight, wallHeight) ??
    spyOnSanta3(elvesHeight, wallHeight)
  );
}

function spyOnSanta1(
  elvesHeight: number[],
  wallHeight: number
): number[] | undefined {
  for (let index = 0; index !== elvesHeight.length; ++index) {
    if (elvesHeight[index] === wallHeight) {
      return [index];
    }
  }
  return undefined;
}

function spyOnSanta2(
  elvesHeight: number[],
  wallHeight: number,
  startOffset: number = 0
): number[] | undefined {
  const knownHeightAndIndex = new Map<number, number>();
  for (let index = startOffset; index !== elvesHeight.length; ++index) {
    const current = elvesHeight[index];
    const complementaryElfIndex = knownHeightAndIndex.get(wallHeight - current);
    if (complementaryElfIndex !== undefined) {
      return [complementaryElfIndex, index];
    }
    knownHeightAndIndex.set(current, index);
  }
  return undefined;
}

function spyOnSanta3(
  elvesHeight: number[],
  wallHeight: number
): number[] | undefined {
  for (let index = 0; index !== elvesHeight.length; ++index) {
    const current = elvesHeight[index];
    const decreasedWallHeight = wallHeight - current;
    if (decreasedWallHeight >= 2) {
      // at least two elves, so wall need to be at least 2 units above
      const possibility = spyOnSanta2(elvesHeight, decreasedWallHeight, index);
      if (possibility !== undefined) {
        return [index, ...possibility];
      }
    }
  }
  return undefined;
}
