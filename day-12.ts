/**
 * Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
 *
 * @param expression -
 *
 * @returns
 * An input string is valid if:
 * Open brackets must be closed by the same type of brackets.
 * Open brackets must be closed in the correct order.
 */
export function validParentheses(expression: string): boolean {
  const opened = [];

  for (const c of expression) {
    switch (c) {
      case "(":
      case "[":
      case "{":
        opened.push(c);
        break;
      case ")": {
        if (opened.length === 0) return false;
        const tail = opened.pop();
        if (tail !== "(") return false;
        break;
      }
      case "]": {
        if (opened.length === 0) return false;
        const tail = opened.pop();
        if (tail !== "[") return false;
        break;
      }
      case "}": {
        if (opened.length === 0) return false;
        const tail = opened.pop();
        if (tail !== "{") return false;
        break;
      }
      default:
        return false;
    }
  }

  return opened.length === 0;
}
