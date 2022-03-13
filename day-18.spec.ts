import { isPalindrome } from "./day-18";
import fc from "fast-check";

// Examples based tests

it("should detect palindromes made of even ascii characters", () => {
  expect(isPalindrome("azza")).toBe(true);
});

it("should detect palindromes made of odd ascii characters", () => {
  expect(isPalindrome("azereza")).toBe(true);
});

it("should detect palindromes made of characters outside of bmp plan", () => {
  expect(isPalindrome("🐱🐴🐱")).toBe(true);
});

it("should detect non palindromes made of even ascii characters", () => {
  expect(isPalindrome("azea")).toBe(false);
});

it("should detect non palindromes made of odd ascii characters", () => {
  expect(isPalindrome("azera")).toBe(false);
});

// Property based tests

it("should detect any valid palindrome having even number of characters", () => {
  fc.assert(
    fc.property(fc.fullUnicodeString(), (start) => {
      // Arrange
      const reversedStart = [...start].reverse().join("");
      const palindrome = `${start}${reversedStart}`;

      // Act / Assert
      expect(isPalindrome(palindrome)).toBe(true);
    })
  );
});

it("should detect any valid palindrome having odd number of characters", () => {
  fc.assert(
    fc.property(fc.fullUnicodeString(), fc.fullUnicode(), (start, c) => {
      // Arrange
      const reversedStart = [...start].reverse().join("");
      const palindrome = `${start}${c}${reversedStart}`;

      // Act / Assert
      expect(isPalindrome(palindrome)).toBe(true);
    })
  );
});

it("should detect any invalid palindrome", () => {
  fc.assert(
    fc.property(
      fc.fullUnicodeString(),
      fc.fullUnicode(),
      fc.fullUnicode(),
      fc.fullUnicodeString(),
      (start, a, b, middle) => {
        // Arrange
        fc.pre(a !== b);
        const reversedStart = [...start].reverse().join("");
        const notPalindrome = `${start}${a}${middle}${b}${reversedStart}`;
        // not a palindrome as the mirror of a is b and a !== b

        // Act / Assert
        expect(isPalindrome(notPalindrome)).toBe(false);
      }
    )
  );
});

it("should have the same answer for s and reverse(s)", () => {
  fc.assert(
    fc.property(fc.fullUnicodeString(), (s) => {
      // Arrange
      const reversedS = [...s].reverse().join("");

      // Act / Assert
      expect(isPalindrome(reversedS)).toBe(isPalindrome(s));
    })
  );
});

it("should be equivalent to non-optimal implementation based on fully reversing the string", () => {
  fc.assert(
    fc.property(fc.fullUnicodeString(), (s) => {
      // Arrange
      const reversedS = [...s].reverse().join("");
      const expectedResult = reversedS === s;

      // Act / Assert
      expect(isPalindrome(s)).toBe(expectedResult);
    })
  );
});
