/**
 * Check if a number is an Humber number.
 *
 * Humble numbers are positive integers which have
 * no prime factors > 7.
 *
 * Source: https://rosettacode.org/wiki/Humble_numbers
 *
 * @param n - The number to be checked,
 *            superior or equal to zero and up to 2**31 -1
 */
export function isHumbleNumber(n: number): boolean {
  while (n > 7) {
    if (n % 2 === 0) {
      n /= 2;
      continue;
    }
    if (n % 3 === 0) {
      n /= 3;
      continue;
    }
    if (n % 5 === 0) {
      n /= 5;
      continue;
    }
    if (n % 7 === 0) {
      n /= 7;
      continue;
    }
    return false;
  }
  return true;
}
