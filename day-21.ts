/**
 * For the Christmas market, Santa is looking for a place.
 *
 * For each market of the world, he has to check if it can land with
 * his 8 reindeers and his sleigh. He is looking for help to compute
 * that quickly as Christmas is coming really really soon.
 *
 * Check whether there is an area of consecutive true that can
 * contain requestedArea and return its upper-left corner.
 *
 * @param map - A map of boolean value, true for available, false otherwise. Indexed by map[y][x]
 * @param requestedArea - The area to look for
 *
 * map.length corresponds to the height of the map
 * map[0].length corresponds to the width of the map
 *
 * @returns
 * - the upper-left corner of the area,
 *   whenever there is one place in the map having with
 *   rectangular width x height surface with only true
 * - undefined if no such area exists
 */
export function findPlaceForSanta(
  map: boolean[][],
  requestedArea: { width: number; height: number }
): { x: number; y: number } | undefined {
  if (map.length === 0 || map[0].length === 0) {
    return requestedArea.width === 0 || requestedArea.height === 0;
  }
  // Dummy implementation
  for (let y = 0; y !== map.length; ++y) {
    for (let x = 0; x !== map[0].length; ++x) {
      const location = { x, y };
      const placeIsValid = isValidPlace(map, location, requestedArea);
      if (placeIsValid) {
        return location;
      }
    }
  }
  return undefined;
}

function isValidPlace(
  map: boolean[][],
  start: { x: number; y: number },
  requestedArea: { width: number; height: number }
): boolean {
  for (let dy = 0; dy !== requestedArea.height; ++dy) {
    const line = map[start.y + dy];
    if (line === undefined) {
      return false;
    }
    for (let dx = 0; dx !== requestedArea.width; ++dx) {
      const cell = line[start.x + dx];
      if (cell === undefined) {
        return false;
      }
      if (!cell) {
        return false;
      }
    }
  }
  return true;
}
