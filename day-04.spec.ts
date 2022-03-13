import { detectCycleInLinkedList, LinkedList } from "./day-04";
import fc from "fast-check";

// Examples based tests

it("should not detect any cycle for a one-element list", () => {
  const list: LinkedList = {
    value: 0,
    next: undefined,
  };
  expect(detectCycleInLinkedList(list)).toBe(false);
});

it("should not detect any cycle for a two-element list", () => {
  const list: LinkedList = {
    value: 0,
    next: { value: 1, next: undefined },
  };
  expect(detectCycleInLinkedList(list)).toBe(false);
});

it("should not detect any cycle for a list with duplicates", () => {
  const list: LinkedList = {
    value: 0,
    next: { value: 0, next: undefined },
  };
  expect(detectCycleInLinkedList(list)).toBe(false);
});

it("should detect a cycle if a node appear twice", () => {
  const list: LinkedList = {
    value: 0,
    next: undefined,
  };
  list.next = list;
  expect(detectCycleInLinkedList(list)).toBe(true);
});

// Property based tests

it("should not detect any cycle in a non-looping linked list", () => {
  const noCycleLinkedListArbitrary = fc.letrec((tie) => ({
    node: fc.record({
      value: fc.integer(),
      next: fc.option(tie("node") as fc.Arbitrary<LinkedList>, {
        nil: undefined,
        depthFactor: 1,
      }),
    }),
  })).node;
  fc.assert(
    fc.property(noCycleLinkedListArbitrary, (linkedList) => {
      // Arrange / Act
      const cycleDetected = detectCycleInLinkedList(linkedList);

      // Assert
      expect(cycleDetected).toBe(false);
    })
  );
});

it("should detect a cycle in a looping linked list", () => {
  fc.assert(
    fc.property(fc.array(fc.integer(), { minLength: 1 }), (nodes) => {
      // Arrange
      const lastNode: LinkedList = { value: nodes[0], next: undefined };
      const linkedList = nodes
        .slice(1)
        .reduce((acc, n) => ({ value: n, next: acc }), lastNode);
      lastNode.next = linkedList;

      // Act
      const cycleDetected = detectCycleInLinkedList(linkedList);

      // Assert
      expect(cycleDetected).toBe(true);
    })
  );
});
