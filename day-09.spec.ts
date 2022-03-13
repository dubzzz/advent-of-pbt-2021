import { sorted } from "./day-09";
import fc from "fast-check";

// Examples based tests

it("should keep sorted array sorted", () => {
  expect(sorted([1, 2, 3])).toEqual([1, 2, 3]);
});

it("should sort reverse-sorted array", () => {
  expect(sorted([3, 2, 1])).toEqual([1, 2, 3]);
});

it("should sort any array", () => {
  expect(sorted([5, 2, 3, 1, 8])).toEqual([1, 2, 3, 5, 8]);
});

// Property based tests

it("should have the same length as source", () => {
  fc.assert(
    fc.property(fc.array(fc.integer()), (data) => {
      expect(sorted(data)).toHaveLength(data.length);
    })
  );
});

it("should have exactly the same number of occurrences as source for each item", () => {
  fc.assert(
    fc.property(fc.array(fc.integer()), (data) => {
      const sortedData = sorted(data);
      expect(countEach(sortedData)).toEqual(countEach(data));
    })
  );
});

it("should produce an ordered array", () => {
  fc.assert(
    fc.property(fc.array(fc.integer()), (data) => {
      const sortedData = sorted(data);
      for (let idx = 1; idx < sortedData.length; ++idx) {
        expect(sortedData[idx - 1]).toBeLessThanOrEqual(sortedData[idx]);
      }
    })
  );
});

// Helpers

function countEach(data: unknown[]): Map<unknown, number> {
  const counter = new Map<unknown, number>();
  for (const item of data) {
    const currentCount = counter.get(item) || 0;
    counter.set(item, currentCount + 1);
  }
  return counter;
}
