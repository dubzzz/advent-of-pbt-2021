import { decomposeIntoPrimes } from "./day-02";
import fc from "fast-check";

// Helper

function sorted(arr: number[]): number[] {
  return [...arr].sort((a, b) => a - b);
}

// Examples based tests

it("should decompose a prime number into itself", () => {
  expect(sorted(decomposeIntoPrimes(5))).toEqual([5]);
});

it("should decompose a number product of two primes", () => {
  expect(sorted(decomposeIntoPrimes(10))).toEqual([2, 5]);
});

it("should decompose a number product of three primes", () => {
  expect(sorted(decomposeIntoPrimes(30))).toEqual([2, 3, 5]);
});

it("should decompose a number product of many times the same prime", () => {
  expect(sorted(decomposeIntoPrimes(8))).toEqual([2, 2, 2]);
});

// Property based tests

it("should only produce integer values in [2, 2**31-1] for factors", () => {
  fc.assert(
    fc.property(fc.integer({ min: 2, max: 2 ** 31 - 1 }), (n) => {
      const factors = decomposeIntoPrimes(n);
      for (const factor of factors) {
        expect(Number.isInteger(factor)).toBe(true);
        expect(factor).toBeGreaterThanOrEqual(2);
        expect(factor).toBeLessThanOrEqual(2 ** 31 - 1);
      }
    })
  );
});

it("should produce an array such that the product equals the input", () => {
  fc.assert(
    fc.property(fc.integer({ min: 2, max: 2 ** 31 - 1 }), (n) => {
      const factors = decomposeIntoPrimes(n);
      const productOfFactors = factors.reduce((a, b) => a * b, 1);
      return productOfFactors === n;
    })
  );
});

it("should be able to decompose a product of two numbers", () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 2, max: 2 ** 31 - 1 }),
      fc.integer({ min: 2, max: 2 ** 31 - 1 }),
      (a, b) => {
        const n = a * b;
        fc.pre(n <= 2 ** 31 - 1);
        const factors = decomposeIntoPrimes(n);
        return factors.length >= 2;
      }
    )
  );
});

it("should compute the same factors as to the concatenation of the one of a and b for a times b", () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 2, max: 2 ** 31 - 1 }),
      fc.integer({ min: 2, max: 2 ** 31 - 1 }),
      (a, b) => {
        fc.pre(a * b <= 2 ** 31 - 1);
        const factorsA = decomposeIntoPrimes(a);
        const factorsB = decomposeIntoPrimes(b);
        const factorsAB = decomposeIntoPrimes(a * b);
        expect(sorted(factorsAB)).toEqual(sorted([...factorsA, ...factorsB]));
      }
    )
  );
});
