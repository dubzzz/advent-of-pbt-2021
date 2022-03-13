import { findPlaceForSanta } from "./day-21";
import fc from "fast-check";

// Examples based tests

it("should find a place for santa given the map has one with exact size", () => {
  // Arrange
  const map = [
    [false, false, false, true, true, true],
    [false, false, false, true, true, true],
    [false, false, false, false, false],
  ];

  // Act
  const location = findPlaceForSanta(map, { width: 3, height: 2 });

  // Assert
  expect(location).toEqual({ x: 3, y: 0 });
});

it("should find a place for santa given the map has one larger", () => {
  // Arrange
  const map = [
    [false, false, true, true, true, true],
    [false, true, false, true, true, true],
    [false, false, false, true, false],
  ];

  // Act
  const location = findPlaceForSanta(map, { width: 3, height: 2 });

  // Assert
  expect(location).toEqual({ x: 3, y: 0 });
});

it("should not find the requested place if height is too small", () => {
  // Arrange
  const map = [
    [false, false, false, true, true, true],
    [false, false, false, true, true, true],
    [false, false, false, false, false],
  ];

  // Act
  const location = findPlaceForSanta(map, { width: 3, height: 3 });

  // Assert
  expect(location).toBe(undefined);
});

it("should not find the requested place if width is too small", () => {
  // Arrange
  const map = [
    [false, false, false, true, true, true],
    [false, false, false, true, true, true],
    [false, false, false, false, false],
  ];

  // Act
  const location = findPlaceForSanta(map, { width: 4, height: 2 });

  // Assert
  expect(location).toBe(undefined);
});

it("should not find the requested place if place is not rectangular", () => {
  // Arrange
  const map = [
    [false, false, false, true, true, true],
    [false, false, true, true, true, false],
    [false, false, false, false, false],
  ];

  // Act
  const location = findPlaceForSanta(map, { width: 3, height: 2 });

  // Assert
  expect(location).toBe(undefined);
});

// Property based tests

// Build a range with values between 0 (included) and max (included)
// and such as range.start <= range.end
function rangeArbitrary(max: number) {
  return fc
    .tuple(fc.nat({ max }), fc.nat({ max }))
    .map(([v1, v2]) => ({ start: Math.min(v1, v2), end: Math.max(v1, v2) }));
}

// Build a rectangular area within the map
function rectAreaArbitrary(mapSize: { mapWidth: number; mapHeight: number }) {
  return fc.record({
    x: rangeArbitrary(mapSize.mapWidth),
    y: rangeArbitrary(mapSize.mapHeight),
  });
}

// Build a map with randomly defined available/non-available places
function mapArbitrary(mapSize: { mapWidth: number; mapHeight: number }) {
  return fc.array(
    fc.array(fc.boolean(), {
      minLength: mapSize.mapWidth,
      maxLength: mapSize.mapWidth,
    }),
    { minLength: mapSize.mapHeight, maxLength: mapSize.mapHeight }
  );
}

it("should find a place whenever the map has at least one with the right size", () => {
  fc.assert(
    fc.property(
      fc
        .record({
          // Size of the map
          mapWidth: fc.nat({ max: 100 }),
          mapHeight: fc.nat({ max: 100 }),
        })
        .chain((mapSize) =>
          fc.record({
            // Default map with some holes for available places
            rawMap: mapArbitrary(mapSize),
            // Stand that will be allocated for Santa
            // We will free this room so that it will be available
            request: rectAreaArbitrary(mapSize),
          })
        ),
      ({ rawMap, request }) => {
        // Arrange
        // Allocate some room to Santa so that he will be able
        // to have his stand on the market
        const map: boolean[][] = [];
        for (let y = 0; y !== rawMap.length; ++y) {
          map[y] = [];
          for (let x = 0; x !== rawMap[0].length; ++x) {
            map[y][x] =
              rawMap[y][x] ||
              (request.x.start <= x &&
                x < request.x.end &&
                request.y.start <= y &&
                y < request.y.end);
          }
        }
        const requestedArea = {
          width: request.x.end - request.x.start,
          height: request.y.end - request.y.start,
        };

        // Act
        const foundPlace = findPlaceForSanta(map, requestedArea);

        // Assert
        expect(foundPlace).not.toBe(undefined);
      }
    )
  );
});

it("should either return no place or the start of valid place with enough room", () => {
  fc.assert(
    fc.property(
      fc
        .record({
          // Size of the map
          mapWidth: fc.nat({ max: 100 }),
          mapHeight: fc.nat({ max: 100 }),
        })
        .chain((mapSize) =>
          fc.record({
            // Default map with some holes for available places
            map: mapArbitrary(mapSize),
            // Size of the stand requested by Santa
            requestedArea: fc.record({
              width: fc.integer({ min: 0, max: mapSize.mapWidth }),
              height: fc.integer({ min: 0, max: mapSize.mapHeight }),
            }),
          })
        ),
      ({ map, requestedArea }) => {
        // Arrange / Act
        const foundPlace = findPlaceForSanta(map, requestedArea);

        // Assert
        if (foundPlace !== undefined) {
          for (let dy = 0; dy !== requestedArea.height; ++dy) {
            for (let dx = 0; dx !== requestedArea.width; ++dx) {
              expect(map[foundPlace.y + dy][foundPlace.x + dx]).toBe(true);
            }
          }
        }
      }
    )
  );
});
