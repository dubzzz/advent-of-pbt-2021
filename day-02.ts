/**
 * Decompose the received integer number into prime factors
 *
 * @param n - Integer value to be decomposed into prime factors, must b in range 2 (included) to 2**31-1 (included)
 *
 * @returns
 * The prime factors to build n.
 */
export function decomposeIntoPrimes(n: number): number[] {
  // Quick implementation: the maximal number supported is 2**31-1
  let done = false;
  const factors: number[] = [];
  while (!done) {
    done = true;
    const stop = Math.sqrt(n);
    for (let i = 2; i <= stop; ++i) {
      if (n % i === 0) {
        factors.push(i);
        n = Math.floor(n / i);
        done = false;
        break;
      }
    }
  }
  return [...factors, n];
}
