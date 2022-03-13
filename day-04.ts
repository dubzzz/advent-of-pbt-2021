export type LinkedList = { value: number; next: LinkedList | undefined };

/**
 * Check if there is a cycle in a given linked list.
 *
 * @param linkedList - The linked list to check.
 *
 * @returns
 * true if there is a cycle, false otherwise.
 */
export function detectCycleInLinkedList(linkedList: LinkedList): boolean {
  let slowRunner = linkedList;
  let fastRunner = linkedList;
  while (fastRunner !== undefined) {
    slowRunner = slowRunner.next;
    fastRunner = fastRunner.next;
    if (fastRunner === undefined) {
      return false;
    }
    fastRunner = fastRunner.next;
    if (slowRunner === fastRunner) {
      return true;
    }
  }
  return false;
}
