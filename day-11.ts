/**
 * In hanoi tower, we consider disks having sizes ranging from 1 to towerHeight (included).
 * We want to move this tower from a given start position to an end position.
 *
 * But to do so we have several rules to follow:
 * - disk can only be moved on top of another one with larger size (or position empty)
 * - one disk at a time
 * - cannot move disks outside of the tower
 *
 * For instance the hanoi game with towerHeight=3 and startPosition=0 at start time is:
 *
 *    X   (1)    |          |
 *   XXX  (2)    |          |
 *  XXXXX (3)    |          |
 *  --+--      --+--      --+--
 *
 * @param towerHeight - The height of the hanoi tower (between 0 and 10)
 * @param startPosition - The position of the hanoi tower at start time (one of 0, 1 or 2)
 * @param endPosition - The position of the hanoi tower at the end
 * @param move - Move function called each time the function wants to move the disk on top of "from" to the top of "to"
 */
export function hanoiTower(
  towerHeight: number,
  startPosition: number,
  endPosition: number,
  move: (from: number, to: number) => void
): void {
  if (towerHeight === 0) {
    return;
  }
  if (startPosition === endPosition) {
    return;
  }

  const otherPosition = 3 - startPosition - endPosition;
  hanoiTower(towerHeight - 1, startPosition, otherPosition, move);
  move(startPosition, endPosition);
  hanoiTower(towerHeight - 1, otherPosition, endPosition, move);
}
