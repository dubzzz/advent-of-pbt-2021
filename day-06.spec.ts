import { simplifyFraction } from "./day-06";
import fc from "fast-check";

// Examples based tests

it("should simplify the fraction when numerator is divisible by denominator", () => {
  const out = simplifyFraction({ numerator: 10, denominator: 5 });
  expect(out).toEqual({ numerator: 2, denominator: 1 });
});

it("should simplify the fraction when numerator and denominator have a shared dividor", () => {
  const out = simplifyFraction({ numerator: 4, denominator: 10 });
  expect(out).toEqual({ numerator: 2, denominator: 5 });
});

it("should not simplify when fraction cannot be simplified", () => {
  const out = simplifyFraction({ numerator: 4, denominator: 9 });
  expect(out).toEqual({ numerator: 4, denominator: 9 });
});

// Property based tests

it("should simplify any fraction to a fraction having the same result", () => {
  fc.assert(
    fc.property(
      fc.integer(),
      fc.integer().filter((n) => n !== 0),
      (numerator, denominator) => {
        const fSource = { numerator, denominator };
        const fOut = simplifyFraction(fSource);
        expect(fOut.numerator / fOut.denominator).toEqual(
          fSource.numerator / fSource.denominator
        );
      }
    )
  );
});

it("should always return a simplified fraction having a positive denominator", () => {
  fc.assert(
    fc.property(
      fc.integer(),
      fc.integer().filter((n) => n !== 0),
      (numerator, denominator) => {
        const fSource = { numerator, denominator };
        const fOut = simplifyFraction(fSource);
        expect(fOut.denominator).toBeGreaterThan(0);
      }
    )
  );
});

it("should only produce integer values for the numerator and denominator", () => {
  fc.assert(
    fc.property(
      fc.integer(),
      fc.integer().filter((n) => n !== 0),
      (numerator, denominator) => {
        const fSource = { numerator, denominator };
        const fOut = simplifyFraction(fSource);
        expect(Number.isInteger(fOut.numerator)).toBe(true);
        expect(Number.isInteger(fOut.denominator)).toBe(true);
      }
    )
  );
});

it("should simplify fractions to simpler form whenever possible", () => {
  fc.assert(
    fc.property(
      fc.integer(),
      fc.integer().filter((n) => n !== 0),
      fc.integer({ min: 1 }),
      (smallNumerator, smallDenominator, factor) => {
        fc.pre(Math.abs(smallNumerator * factor) <= Number.MAX_SAFE_INTEGER);
        fc.pre(Math.abs(smallDenominator * factor) <= Number.MAX_SAFE_INTEGER);

        const fSource = {
          numerator: smallNumerator * factor,
          denominator: smallDenominator * factor,
        };
        const fOut = simplifyFraction(fSource);

        const simplifiedByFactor = Math.abs(
          fSource.denominator / fOut.denominator
        );
        expect(simplifiedByFactor).toBeGreaterThanOrEqual(factor);
      }
    )
  );
});
