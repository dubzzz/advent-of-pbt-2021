import { hanoiTower } from "./day-11";
import fc from "fast-check";

// Examples based tests

it("should be able to move a tower of size 3 from 0 to 2", () => {
  const move = jest.fn();
  hanoiTower(3, 0, 2, move);
  expect(move.mock.calls).toEqual([
    // state: (1/2/3) / () / ()
    [0, 2],
    // state: (2/3) / () / (1)
    [0, 1],
    // state: (3) / (2) / (1)
    [2, 1],
    // state: (3) / (1/2) / ()
    [0, 2],
    // state: () / (1/2) / (3)
    [1, 0],
    // state: (1) / (2) / (3)
    [1, 2],
    // state: (1) / () / (2/3)
    [0, 2],
    // state: () / () / (1/2/3)
  ]);
});

it("should be able to move a tower of size 3 from 2 to 1", () => {
  const move = jest.fn();
  hanoiTower(3, 2, 1, move);
  expect(move.mock.calls).toEqual([
    // state: () / () / (1/2/3)
    [2, 1],
    // state: () / (1) / (2/3)
    [2, 0],
    // state: (2) / (1) / (3)
    [1, 0],
    // state: (1/2) / () / (3)
    [2, 1],
    // state: (1/2) / (3) / ()
    [0, 2],
    // state: (2) / (3) / (1)
    [0, 1],
    // state: () / (2/3) / (1)
    [2, 1],
    // state: () / (1/2/3) / ()
  ]);
});

// Property based tests

it("should move the tower to the requested pillar", () => {
  fc.assert(
    fc.property(
      fc.constantFrom(0, 1, 2),
      fc.constantFrom(0, 1, 2),
      fc.integer({ min: 0, max: 10 }),
      (startPosition, endPosition, towerHeight) => {
        // Arrange
        const stacks = buildInitialStacks(startPosition, towerHeight);
        const expectedStacks = buildInitialStacks(endPosition, towerHeight);
        const move = (from: number, to: number) => {
          const head = stacks[from].pop()!; // not checked by this test
          stacks[to].push(head);
        };

        // Act
        hanoiTower(towerHeight, startPosition, endPosition, move);

        // Assert
        expect(stacks).toEqual(expectedStacks);
      }
    )
  );
});

it("should move disk on top of a larger disk or empty pillar", () => {
  fc.assert(
    fc.property(
      fc.constantFrom(0, 1, 2),
      fc.constantFrom(0, 1, 2),
      fc.integer({ min: 0, max: 10 }),
      (startPosition, endPosition, towerHeight) => {
        // Arrange
        const stacks = buildInitialStacks(startPosition, towerHeight);

        // Act / Assert
        const move = (from: number, to: number) => {
          expect(stacks[from]).not.toEqual([]); // we need to move something
          const head = stacks[from].pop()!;
          if (stacks[to].length !== 0) {
            const headTo = stacks[to][stacks[to].length - 1];
            expect(head).toBeLessThan(headTo); // we need to move it on larger disks
          } // or empty pillar
          stacks[to].push(head);
        };
        hanoiTower(towerHeight, startPosition, endPosition, move);
      }
    )
  );
});

it("should not pass twice by the same state", () => {
  fc.assert(
    fc.property(
      fc.constantFrom(0, 1, 2),
      fc.constantFrom(0, 1, 2),
      fc.integer({ min: 0, max: 10 }),
      (startPosition, endPosition, towerHeight) => {
        // Arrange
        const stacks = buildInitialStacks(startPosition, towerHeight);
        function stateToString(state: [number[], number[], number[]]): string {
          return `${state[0].join(".")}/${state[1].join(".")}/${state[2].join(
            "."
          )}`;
        }
        const seenStates = new Set<string>([stateToString(stacks)]);

        // Act / Assert
        const move = (from: number, to: number) => {
          const head = stacks[from].pop()!; // not checked by this test
          stacks[to].push(head);
          const newStateString = stateToString(stacks);
          expect(seenStates.has(newStateString)).toBe(false);
          seenStates.add(newStateString);
        };
        hanoiTower(towerHeight, startPosition, endPosition, move);
      }
    )
  );
});

// Helpers

function buildTowerStack(towerHeight: number): number[] {
  const stack: number[] = [];
  for (let diskSize = towerHeight; diskSize >= 1; --diskSize) {
    stack.push(diskSize);
  }
  return stack;
}

function buildInitialStacks(
  startPosition: number,
  towerHeight: number
): [number[], number[], number[]] {
  return [
    startPosition === 0 ? buildTowerStack(towerHeight) : [],
    startPosition === 1 ? buildTowerStack(towerHeight) : [],
    startPosition === 2 ? buildTowerStack(towerHeight) : [],
  ];
}
