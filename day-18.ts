/**
 * A string s is said to be a palindrome
 * if it reads the same backward and forward
 *
 * @param s - The strings to be assessed
 */
export function isPalindrome(s: string): boolean {
  const chars = [...s];
  const stopPoint = Math.floor(chars.length / 2);
  for (let index = 0; index < stopPoint; ++index) {
    if (chars[chars.length - index - 1] !== chars[index]) {
      return false;
    }
  }
  return true;
}
