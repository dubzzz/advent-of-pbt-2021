import { spyOnSanta } from "./day-22";
import fc from "fast-check";

// Examples based tests

it("should find combinations including one elf", () => {
  // Arrange
  const elves = [1, 3, 6, 11, 13];

  // Act
  const selectedElves = spyOnSanta(elves, 11);
  // 11 = 11

  // Assert
  expect(selectedElves).toEqual([3]);
});

it("should find combinations including two elves", () => {
  // Arrange
  const elves = [1, 3, 6, 11, 13];

  // Act
  const selectedElves = spyOnSanta(elves, 4);
  // 4 = 1 + 3

  // Assert
  expect(selectedElves).toEqual([0, 1]);
});

it("should find combinations including three elves", () => {
  // Arrange
  const elves = [1, 3, 6, 11, 13];

  // Act
  const selectedElves = spyOnSanta(elves, 10);
  // 10 = 1 + 3 + 6

  // Assert
  expect(selectedElves).toEqual([0, 1, 2]);
});

it("should not find combinations including four elves", () => {
  // Arrange
  const elves = [1, 1, 3, 6, 11, 13];

  // Act
  const selectedElves = spyOnSanta(elves, 33);
  // 33 = 3 + 6 + 11 + 13

  // Assert
  expect(selectedElves).toBe(undefined);
});

it("should be able to deal with elves having the same height", () => {
  // Arrange
  const elves = [1, 1, 5, 10, 15];

  // Act
  const selectedElves = spyOnSanta(elves, 12);
  // 12 = 1 + 1 + 10

  // Assert
  expect(selectedElves).toEqual([0, 1, 3]);
});

// Property based tests

function assertElves(
  elves: number[],
  selectedElves: number[],
  wallHeight: number
): void {
  // Selection must have between 1 and 3 elves
  expect(selectedElves.length).toBeGreaterThanOrEqual(1);
  expect(selectedElves.length).toBeLessThanOrEqual(3);
  // Selection must be made of indexes corresponding to known elves
  for (const selected of selectedElves) {
    expect(elves).toHaveProperty(String(selected));
  }
  // Selection must not repeat elves
  expect(selectedElves).toHaveLength(new Set(selectedElves).size);
  // Selection must reach the wall height, not more not less
  const selectionHeight = selectedElves
    .map((i) => elves[i])
    .reduce((a, b) => a + b);
  expect(selectionHeight).toBe(wallHeight);
}

it("should select some elves whenever there is a solution with one elf", () => {
  fc.assert(
    fc.property(
      fc.array(fc.integer({ min: 1 }), { minLength: 1 }),
      fc.nat(),
      (elves, modElf1) => {
        // Arrange
        const indexElf1 = modElf1 % elves.length;
        const wallHeight = elves[indexElf1];

        // Act
        const selectedElves = spyOnSanta(elves, wallHeight);

        // Assert
        expect(selectedElves).not.toBe(undefined);
        assertElves(elves, selectedElves!, wallHeight);
      }
    )
  );
});

it("should select some elves whenever there is a solution with two elves", () => {
  fc.assert(
    fc.property(
      fc.array(fc.integer({ min: 1 }), { minLength: 2 }),
      fc.nat(),
      fc.nat(),
      (elves, modElf1, modElf2) => {
        // Arrange
        const indexElf1 = modElf1 % elves.length;
        const indexElf2 = modElf2 % elves.length;
        fc.pre(indexElf1 !== indexElf2);
        const wallHeight = elves[indexElf1] + elves[indexElf2];

        // Act
        const selectedElves = spyOnSanta(elves, wallHeight);

        // Assert
        expect(selectedElves).not.toBe(undefined);
        assertElves(elves, selectedElves!, wallHeight);
      }
    )
  );
});

it("should select some elves whenever there is a solution with three elves", () => {
  fc.assert(
    fc.property(
      fc.array(fc.integer({ min: 1 }), { minLength: 3 }),
      fc.nat(),
      fc.nat(),
      fc.nat(),
      (elves, modElf1, modElf2, modElf3) => {
        // Arrange
        const indexElf1 = modElf1 % elves.length;
        const indexElf2 = modElf2 % elves.length;
        const indexElf3 = modElf3 % elves.length;
        fc.pre(indexElf1 !== indexElf2);
        fc.pre(indexElf1 !== indexElf3);
        fc.pre(indexElf2 !== indexElf3);
        const wallHeight =
          elves[indexElf1] + elves[indexElf2] + elves[indexElf3];

        // Act
        const selectedElves = spyOnSanta(elves, wallHeight);

        // Assert
        expect(selectedElves).not.toBe(undefined);
        assertElves(elves, selectedElves!, wallHeight);
      }
    )
  );
});

it("should either propose a valid solution or nothing", () => {
  fc.assert(
    fc.property(
      fc.array(fc.integer({ min: 1 })),
      fc.nat(),
      (elves, wallHeight) => {
        // Arrange / Act
        const selectedElves = spyOnSanta(elves, wallHeight);

        // Assert
        if (selectedElves !== undefined) {
          assertElves(elves, selectedElves!, wallHeight);
        }
      }
    )
  );
});
