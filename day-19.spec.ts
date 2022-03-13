import { metroRoute, Track } from "./day-19";
import fc from "fast-check";

// Examples based tests

it("should find the only route leading from 1 to 5", () => {
  // Arrange
  const tracks: Track[] = [
    { from: 1, to: 2, length: 2 },
    { from: 2, to: 3, length: 3 },
    { from: 3, to: 4, length: 8 },
    { from: 4, to: 5, length: 1 },
  ];

  // Act
  const route = metroRoute(1, 5, tracks);

  // Assert
  expect(route).toEqual([tracks[0], tracks[1], tracks[2], tracks[3]]);
});

it("should find the shortest route leading from 1 to 5", () => {
  // Arrange
  const tracks: Track[] = [
    { from: 1, to: 2, length: 2 },
    { from: 2, to: 3, length: 3 },
    { from: 3, to: 4, length: 8 },
    { from: 4, to: 5, length: 1 },
    { from: 1, to: 5, length: 100 },
    { from: 3, to: 4, length: 1 },
  ];

  // Act
  const route = metroRoute(1, 5, tracks);

  // Assert
  expect(route).toEqual([tracks[0], tracks[1], tracks[5], tracks[3]]);
});

it("should not consider going backward on the route from 1 to 5", () => {
  // Arrange
  const tracks: Track[] = [
    { from: 1, to: 2, length: 2 },
    { from: 2, to: 3, length: 3 },
    { from: 3, to: 4, length: 8 },
    { from: 4, to: 5, length: 1 },
  ];

  // Act
  const route = metroRoute(5, 1, tracks);

  // Assert
  expect(route).toBe(undefined);
});

// Property based tests

it("should build a path starting by the requested departure whenever a path from start to end exists", () => {
  fc.assert(
    fc.property(orientedGraphArbitrary(), ({ knownPath, tracks }) => {
      // Arrange
      const departure = knownPath[0];
      const destination = knownPath[knownPath.length - 1];

      // Act
      const shortestPath = metroRoute(departure, destination, tracks);

      // Assert
      if (departure === destination) expect(shortestPath).toEqual([]);
      else expect(shortestPath![0].from).toBe(departure);
    })
  );
});

it("should build a path ending by the requested destination whenever a path from start to end exists", () => {
  fc.assert(
    fc.property(orientedGraphArbitrary(), ({ knownPath, tracks }) => {
      // Arrange
      const departure = knownPath[0];
      const destination = knownPath[knownPath.length - 1];

      // Act
      const shortestPath = metroRoute(departure, destination, tracks);

      // Assert
      if (departure === destination) expect(shortestPath).toEqual([]);
      else expect(shortestPath![shortestPath!.length - 1].to).toBe(destination);
    })
  );
});

it("should build an ordered path of tracks whenever a path from start to end exists", () => {
  fc.assert(
    fc.property(orientedGraphArbitrary(), ({ knownPath, tracks }) => {
      // Arrange
      const departure = knownPath[0];
      const destination = knownPath[knownPath.length - 1];

      // Act
      const shortestPath = metroRoute(departure, destination, tracks);

      // Assert
      for (let index = 1; index < shortestPath!.length; ++index) {
        expect(shortestPath![index].from).toBe(shortestPath![index - 1].to);
      }
    })
  );
});

it("should build a path of tracks being a subset of the tracks of the graph whenever a path from start to end exists", () => {
  fc.assert(
    fc.property(orientedGraphArbitrary(), ({ knownPath, tracks }) => {
      // Arrange
      const departure = knownPath[0];
      const destination = knownPath[knownPath.length - 1];

      // Act
      const shortestPath = metroRoute(departure, destination, tracks);

      // Assert
      for (const edge of shortestPath!) {
        expect(shortestPath).toContainEqual(edge);
      }
    })
  );
});

it("should be able to find a path shorther or equal to the one we come up with", () => {
  fc.assert(
    fc.property(
      orientedGraphArbitrary(),
      ({ knownPath, knownPathTracks, tracks }) => {
        // Arrange
        const departure = knownPath[0];
        const destination = knownPath[knownPath.length - 1];

        // Act
        const shortestPath = metroRoute(departure, destination, tracks);

        // Assert
        const distanceKnownPath = knownPathTracks.reduce(
          (acc, e) => acc + e.length,
          0
        );
        const distanceShortestPath = shortestPath!.reduce(
          (acc, e) => acc + e.length,
          0
        );
        expect(distanceShortestPath).toBeLessThanOrEqual(distanceKnownPath);
      }
    )
  );
});

it("should not return any path whenever there is no way going from start to end", () => {
  fc.assert(
    fc.property(
      orientedGraphNoWayArbitrary(),
      ({ departure, destination, tracks }) => {
        // Arrange / Act
        const shortestPath = metroRoute(departure, destination, tracks);

        // Assert
        expect(shortestPath).toBe(undefined);
      }
    )
  );
});

// Helpers

// Generate oriented graphs with a known path going from knownPath[0] to knownPath[knownPath.length -1]
// by taking one by one the tracks defined into knownPathTracks (a subset of the tracks of the graph itself).
function orientedGraphArbitrary() {
  return fc
    .record({
      // tracks that will compose the known path (starting at node=0)
      knownPathExcludingStart: fc.set(
        fc.record({ node: fc.integer({ min: 1 }), length: fc.nat() }),
        { compare: (na, nb) => na.node === nb.node }
      ),
      // some more tracks that will compose our graph
      extraTracks: fc.array(
        fc.record({ from: fc.nat(), to: fc.nat(), length: fc.nat() })
      ),
    })
    .chain(({ knownPathExcludingStart, extraTracks }) => {
      const departure = 0;
      const knownPath = [
        departure,
        ...knownPathExcludingStart.map((n) => n.node),
      ];
      const knownPathTracks = knownPathExcludingStart.map((n, index) => ({
        from: index !== 0 ? knownPathExcludingStart[index - 1].node : departure,
        to: n.node,
        length: n.length,
      }));
      const allTracks = [...knownPathTracks, ...extraTracks];
      return fc.record({
        knownPath: fc.constant(knownPath),
        knownPathTracks: fc.constant(knownPathTracks),
        tracks: fc.shuffledSubarray(allTracks, { minLength: allTracks.length }),
      });
    });
}

// Generate a graph not having any path going from departure to destination (by construct)
function orientedGraphNoWayArbitrary() {
  return fc
    .record({
      // We consider start = 0 and end = 19.
      // We delimit two zones:
      // - start zone contains stations 0 to 9 (included)
      // - end zone contains stations 10 to 19 (included)
      tracksStartZone: fc.array(
        fc.record({
          from: fc.integer({ min: 0, max: 9 }),
          to: fc.integer({ min: 0, max: 9 }),
          length: fc.nat(),
        })
      ),
      tracksEndZone: fc.array(
        fc.record({
          from: fc.integer({ min: 10, max: 19 }),
          to: fc.integer({ min: 10, max: 19 }),
          length: fc.nat(),
        })
      ),
      tracksEndToStart: fc.array(
        fc.record({
          from: fc.integer({ min: 10, max: 19 }),
          to: fc.integer({ min: 0, max: 9 }),
          length: fc.nat(),
        })
      ),
    })
    .map((config) => ({
      departure: 0,
      destination: 19,
      tracks: [
        ...config.tracksStartZone,
        ...config.tracksEndZone,
        ...config.tracksEndToStart,
      ],
    }));
}
