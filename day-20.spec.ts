import { drawTree } from "./day-20";
import fc from "fast-check";

// Examples based tests

it("should be able to draw a tree of size 1", () => {
  // prettier-ignore
  expect(drawTree(1)).toEqual(
    "^\n" +
    "^\n" +
    "^"
  );
});

it("should be able to draw a tree of size 2", () => {
  // prettier-ignore
  expect(drawTree(2)).toEqual(
    " ^\n" +
    "(^)\n" +
    " ^\n" +
    " ^"
  );
});

it("should be able to draw a tree of size 5", () => {
  // prettier-ignore
  expect(drawTree(5)).toEqual(
    "    ^\n" +
    "   (^)\n" +
    "  ((^))\n" +
    " (((^)))\n" +
    "((((^))))\n" +
    "    ^\n" +
    "    ^"
  );
});

// Property based tests

it("should build a linear trunk", () => {
  fc.assert(
    fc.property(fc.integer({ min: 1, max: 1000 }), (n) => {
      // Arrange / Act
      const tree = drawTree(n);

      // Assert
      // Remove all the leaves from the tree to only keep the trunk
      const treeWithoutLeaves = tree
        .split("\n")
        .map((level) => level.replace(/[()]/g, " ").trimRight());
      for (const level of treeWithoutLeaves) {
        expect(level.trimLeft()).toEqual("^");
        expect(level).toEqual(treeWithoutLeaves[0]);
      }
    })
  );
});

it("should create larger and larger levels", () => {
  fc.assert(
    fc.property(fc.integer({ min: 1, max: 1000 }), (n) => {
      // Arrange / Act
      const tree = drawTree(n);

      // Assert
      const treeLevels = tree.split("\n").map((level) => level.trim());
      for (let index = 1; index < n; ++index) {
        expect(treeLevels[index]).toContain(treeLevels[index - 1]);
      }
    })
  );
});

it("should offset leaves from one level to the next one", () => {
  fc.assert(
    fc.property(fc.integer({ min: 1, max: 1000 }), (n) => {
      // Arrange / Act
      const tree = drawTree(n);

      // Assert
      const treeLevels = tree.split("\n").map((level) => level.trim());
      for (let index = 1; index < n; ++index) {
        expect(treeLevels[index]).toEqual("(" + treeLevels[index - 1] + ")");
      }
    })
  );
});

it("should create a base of size two with levels identical to the top", () => {
  fc.assert(
    fc.property(fc.integer({ min: 1, max: 1000 }), (n) => {
      // Arrange / Act
      const tree = drawTree(n);

      // Assert
      const treeLevels = tree.split("\n");
      expect(treeLevels).toHaveLength(n + 2);
      expect(treeLevels[n]).toEqual(treeLevels[0]);
      expect(treeLevels[n + 1]).toEqual(treeLevels[0]);
    })
  );
});
