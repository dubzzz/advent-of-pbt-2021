import { hasDuplicates } from "./day-08";
import fc from "fast-check";

// Examples based tests

it("should not detect any duplicates in empty array", () => {
  expect(hasDuplicates([])).toBe(false);
});

it("should not detect any duplicates when array has distinct values", () => {
  expect(hasDuplicates([1, 2, 3, 4])).toBe(false);
});

it("should detect duplicate when array has one", () => {
  expect(hasDuplicates([1, 2, 3, 1])).toBe(true);
});

it("should detect duplicate when array has many", () => {
  expect(hasDuplicates([1, 2, 2, 1, 3])).toBe(true);
});

// Property based tests

it("should not detect any duplicates when array has only distinct values", () => {
  fc.assert(
    fc.property(fc.set(fc.anything(), { compare: Object.is }), (data) => {
      expect(hasDuplicates(data)).toBe(false);
    })
  );
});

it("should always detect duplicates when there is at least one", () => {
  fc.assert(
    fc.property(
      fc.array(fc.anything()),
      fc.array(fc.anything()),
      fc.array(fc.anything()),
      fc.anything(),
      (start, middle, end, dup) => {
        expect(hasDuplicates([...start, dup, ...middle, dup, ...end])).toBe(
          true
        );
      }
    )
  );
});
