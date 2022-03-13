import { isHumbleNumber } from "./day-17";
import fc from "fast-check";

// Examples based tests

it("should consider any prime number <=7 as humble", () => {
  expect(isHumbleNumber(2)).toBe(true);
  expect(isHumbleNumber(3)).toBe(true);
  expect(isHumbleNumber(5)).toBe(true);
  expect(isHumbleNumber(7)).toBe(true);
});

it("should consider any number <=7 as humble", () => {
  expect(isHumbleNumber(0)).toBe(true);
  expect(isHumbleNumber(1)).toBe(true);
  expect(isHumbleNumber(4)).toBe(true);
  expect(isHumbleNumber(6)).toBe(true);
});

it("should consider any compositite of 2, 3, 5 or 7 as humble", () => {
  expect(isHumbleNumber(2 * 2 * 2 * 2 * 2)).toBe(true);
  expect(isHumbleNumber(2 * 2 * 3 * 3 * 5 * 5 * 7 * 7)).toBe(true);
});

it("should consider number with prime factor >7 as non-humble", () => {
  expect(isHumbleNumber(11)).toBe(false);
  expect(isHumbleNumber(2 * 11)).toBe(false);
});

// Property based tests

it("should consider any composite of primes <=7 as humble", () => {
  fc.assert(
    fc.property(
      fc.array(fc.integer({ min: 2, max: 7 }), { minLength: 1 }),
      (factors) => {
        // Arrange
        let n = 1;
        for (const f of factors) {
          if (n * f > 2 ** 31 - 1) break;
          n = n * f;
        }

        // Act / Assert
        expect(isHumbleNumber(n)).toBe(true);
      }
    )
  );
});

it("should consider any composite with one prime factor >7 as non-humble", () => {
  fc.assert(
    fc.property(
      fc
        .integer({ min: 11 }) // 8,9,10 would be filtered
        .filter((v) => v % 2 !== 0)
        .filter((v) => v % 3 !== 0)
        .filter((v) => v % 5 !== 0)
        .filter((v) => v % 7 !== 0),
      fc.array(fc.integer({ min: 1, max: 195225786 })),
      (tooLarge, factors) => {
        // Arrange
        let n = tooLarge;
        for (const f of factors) {
          if (n * f > 2 ** 31 - 1) break;
          n = n * f;
        }

        // Act / Assert
        expect(isHumbleNumber(n)).toBe(false);
      }
    )
  );
});
