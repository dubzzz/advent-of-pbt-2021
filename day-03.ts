/**
 * FizzBuzz
 *
 * @param n - The value to consider
 *
 * @returns Fizz if divisible by 3, Buzz if divisible by 5, the number as a string if none of the conditions apply
 */
export function fizzbuzz(n: number): string {
  return n % 3 === 0 ? (n % 5 === 0 ? 'Fizz Buzz' : 'Fizz') : n % 5 === 0 ? 'Buzz' : String(n);
}
