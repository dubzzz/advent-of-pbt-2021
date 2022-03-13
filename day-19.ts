export type Track = { from: number; to: number; length: number };

/**
 * Given a map of all the tracks connecting stations of a metro,
 * we want to compute the shortest path (in terms of distance) to reach the destination.
 *
 * @param departure - Id of the station used as departure (must be an integer value)
 * @param destination - Id of the station used as destination (must be an integer value)
 * @param tracks - List of all the connections between stations of the map
 *
 * @returns
 * The list of tracks to take to go from departure to destination and resulting into the shortest path (if there is one).
 * If there is no path going to the destination, then it returns undefined.
 */
export function metroRoute(
  departure: number,
  destination: number,
  tracks: Track[]
): Track[] | undefined {
  const distanceToNode = new Map<number, { distance: number; edges: Track[] }>(
    [
      departure,
      destination,
      ...tracks.map((t) => t.from),
      ...tracks.map((t) => t.to),
    ].map((node) => [node, { distance: Number.POSITIVE_INFINITY, edges: [] }])
  );
  if (distanceToNode.has(departure)) {
    distanceToNode.set(departure, { distance: 0, edges: [] });
  }
  while (true) {
    const nextNode = findRemainingNodeWithMinimalDistance(distanceToNode);
    if (nextNode === undefined) {
      return undefined; // no path found
    }
    const data = distanceToNode.get(nextNode)!;
    if (nextNode === destination) {
      return data.edges;
    }
    distanceToNode.delete(nextNode);
    for (const e of tracks) {
      if (
        e.from === nextNode &&
        distanceToNode.has(e.to) &&
        distanceToNode.get(e.to)!.distance > data.distance + e.length
      ) {
        distanceToNode.set(e.to, {
          distance: data.distance + e.length,
          edges: [...data.edges, e],
        });
      }
    }
  }
}

function findRemainingNodeWithMinimalDistance(
  distanceToNode: Map<number, { distance: number; edges: Track[] }>
): number | undefined {
  let minNode: number | undefined = undefined;
  let minDistance = Number.POSITIVE_INFINITY;
  for (const [node, { distance }] of distanceToNode) {
    if (distance < minDistance) {
      minNode = node;
      minDistance = distance;
    }
  }
  return minNode;
}
