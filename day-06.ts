type Fraction = { numerator: number; denominator: number };

/**
 * Simplify a fraction by reducing (if possible) the numerator and denominator
 *
 * @param f - Fraction to be simplified
 *
 * @returns
 * An equivalent fraction with possibly smaller values for numerator and denominator.
 * Additionally only the numerator should be negative after simplification.
 */
export function simplifyFraction(f: Fraction): Fraction {
  const g = gcd(f.numerator, f.denominator);
  const sign = f.denominator < 0 ? -1 : 1;
  return {
    numerator: (sign * f.numerator) / g,
    denominator: (sign * f.denominator) / g,
  };
}

function gcd(_a: number, _b: number): number {
  let a = _a < 0 ? -_a : _a;
  let b = _b < 0 ? -_b : _b;
  if (b > a) {
    const temp = a;
    a = b;
    b = temp;
  }
  while (true) {
    if (b === 0) return a;
    a = a % b;
    if (a === 0) return b;
    b = b % a;
  }
}
