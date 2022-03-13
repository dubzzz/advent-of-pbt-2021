import { lastIndexOf } from "./day-01";
import fc from "fast-check";

// Examples based tests

it("should return -1 when there is no match at all", () => {
  expect(lastIndexOf("abc", "defghi")).toBe(-1);
});

it("should return -1 when match is not complete", () => {
  expect(lastIndexOf("abc", "abdefghi")).toBe(-1);
});

it("should return the start index of the match", () => {
  expect(lastIndexOf("cdef", "abcdefghi")).toBe(2);
});

it("should return the start index of the last match", () => {
  expect(lastIndexOf("cdef", "abcdefghiabcdefghi")).toBe(11);
});

// Property based tests

it("should detect a substring when there is one", () => {
  fc.assert(
    fc.property(fc.string(), fc.string(), fc.string(), (a, b, c) => {
      const searchString = b;
      const text = `${a}${b}${c}`;
      expect(lastIndexOf(searchString, text)).not.toBe(-1);
    })
  );
});

it("should return the start index of the substring when there is one", () => {
  fc.assert(
    fc.property(fc.string(), fc.string(), fc.string(), (a, b, c) => {
      const searchString = b;
      const text = `${a}${b}${c}`;
      const index = lastIndexOf(searchString, text);
      expect(text.substr(index, searchString.length)).toBe(searchString);
    })
  );
});

it("should return the last possible index of the substring when there is one", () => {
  fc.assert(
    fc.property(
      fc.string(),
      fc.string({ minLength: 1 }),
      fc.string(),
      (a, b, c) => {
        const searchString = b;
        const text = `${a}${b}${c}`;
        const textBis = text.substring(lastIndexOf(searchString, text) + 1);
        expect(lastIndexOf(searchString, textBis)).toBe(-1);
      }
    )
  );
});
