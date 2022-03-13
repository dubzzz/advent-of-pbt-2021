/**
 * Draw a tree with:
 * - a trunc made of '^',
 * - leaves on the left made of '('
 * - and the ones on the right made of ')'
 *
 * @param size - Size of the tree >=1
 */
export function drawTree(size: number): string {
  const lines: string[] = [];

  // Leaves
  for (let index = 0; index !== size; ++index) {
    const left = "(".repeat(index);
    const right = ")".repeat(index);
    lines.push(`${" ".repeat(size - index - 1)}${left}^${right}`);
  }

  // Base
  lines.push(`${" ".repeat(size - 1)}^`);
  lines.push(`${" ".repeat(size - 1)}^`);

  return lines.join("\n");
}
