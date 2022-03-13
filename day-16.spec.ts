import { reversed } from "./day-16";
import fc from "fast-check";

// Examples based tests

it("should be able to reverse the empty array", () => {
  expect(reversed([])).toEqual([]);
});
it("should be able to reverse an array with only one item", () => {
  expect(reversed([10])).toEqual([10]);
});
it("should be able to reverse an array with multiple items", () => {
  expect(reversed([10, 5, 2, 800])).toEqual([800, 2, 5, 10]);
});

// Property based tests

it("should produce an array having the same length", () => {
  fc.assert(
    fc.property(fc.array(fc.anything()), (data) => {
      // Arrange / Act
      const rev = reversed(data);

      // Assert
      expect(rev).toHaveLength(data.length);
    })
  );
});

it("should reverse any array", () => {
  fc.assert(
    fc.property(fc.array(fc.anything()), (data) => {
      // Arrange / Act
      const rev = reversed(data);

      // Assert
      for (let index = 0; index !== data.length; ++index) {
        expect(rev[rev.length - index - 1]).toBe(data[index]);
      }
    })
  );
});

it("should properly reverse concatenated arrays: rev concat(a,b) = concat(rev b, rev a)", () => {
  fc.assert(
    fc.property(fc.array(fc.anything()), fc.array(fc.anything()), (a, b) => {
      // Arrange / Act
      const rev = reversed([...a, ...b]);
      const revA = reversed(a);
      const revB = reversed(b);

      // Assert
      expect(rev).toEqual([...revB, ...revA]);
    })
  );
});

it("should go back to the original array if reversed twice", () => {
  fc.assert(
    fc.property(fc.array(fc.anything()), (data) => {
      // Arrange / Act / Assert
      expect(reversed(reversed(data))).toEqual(data);
    })
  );
});
