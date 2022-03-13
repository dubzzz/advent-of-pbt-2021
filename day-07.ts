/**
 * Compute fibonacci of n
 *
 * @param n - Index within fibonacci sequence
 *
 * @returns
 * The value of F(n) where F is the fibonacci sequence
 */
export function fibonacci(n: number): bigint {
  let a = 0n;
  let b = 1n;
  for (let i = 0; i !== n; ++i) {
    const previousA = a;
    a = b;
    b = previousA + b;
  }
  return a;
}
