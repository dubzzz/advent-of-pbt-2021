import { wishListsDiffer } from "./day-23";
import fc from "fast-check";

// Examples based tests

it("should compute the appropriate diff", () => {
  // Arrange
  const previousYear = "Cars\nTrains\nPlanes";
  const currentYear = "Cars\nBuses\nTrains\nBoats";

  // Act
  const diff = wishListsDiffer(previousYear, currentYear);

  // Assert
  // prettier-ignore
  expect(diff).toEqual(
    "=== Cars\n" +
    "+++ Buses\n" +
    "=== Trains\n" +
    "+++ Boats\n" +
    "--- Planes"
  );
});

// Property based tests

it("should be able to rebuild previous year given only the diff", () => {
  fc.assert(
    fc.property(
      wishListArbitrary(),
      wishListArbitrary(),
      (previousYear, currentYear) => {
        // Arrange / Act
        const computedDiff = wishListsDiffer(previousYear, currentYear);

        // Assert
        expect(previousYearFromDiff(computedDiff)).toEqual(previousYear);
      }
    )
  );
});

it("should be able to rebuild current year given only the diff", () => {
  fc.assert(
    fc.property(
      wishListArbitrary(),
      wishListArbitrary(),
      (previousYear, currentYear) => {
        // Arrange / Act
        const computedDiff = wishListsDiffer(previousYear, currentYear);

        // Assert
        expect(currentYearFromDiff(computedDiff)).toEqual(currentYear);
      }
    )
  );
});

it("should compute the diff having the maximal number of unchanged lines", () => {
  fc.assert(
    fc.property(diffArbitrary(), (diff) => {
      // Arrange
      const previousYear = previousYearFromDiff(diff);
      const currentYear = currentYearFromDiff(diff);

      // Act
      const computedDiff = wishListsDiffer(previousYear, currentYear);

      // Assert
      expect(countUnchangedLines(computedDiff)).toBeGreaterThanOrEqual(
        countUnchangedLines(diff)
      );
    })
  );
});

// Helpers

function stringSingleLine() {
  return fc.stringOf(fc.fullUnicode().filter((c) => c !== "\n"));
}
function wishListArbitrary() {
  return fc.array(stringSingleLine()).map((lines) => lines.join("\n"));
}

function previousYearFromDiff(diff: string): string {
  return diff
    .split("\n")
    .filter((line) => line.startsWith("--- ") || line.startsWith("=== "))
    .map((line) => line.substring(4))
    .join("\n");
}
function currentYearFromDiff(diff: string): string {
  return diff
    .split("\n")
    .filter((line) => line.startsWith("+++ ") || line.startsWith("=== "))
    .map((line) => line.substring(4))
    .join("\n");
}

function diffArbitrary() {
  return fc
    .array(
      fc
        .record({
          type: fc.constantFrom("+++", "---", "==="),
          content: stringSingleLine(),
        })
        .map(({ type, content }) => `${type} ${content}`),
      { minLength: 1 }
    )
    .map((lines) => lines.join("\n"));
}

function countUnchangedLines(diff: string): number {
  return diff.split("\n").filter((line) => line.startsWith("=== ")).length;
}
