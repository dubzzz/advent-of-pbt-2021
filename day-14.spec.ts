import { reorderTabs } from "./day-14";
import fc from "fast-check";

// Examples based tests

it("should be able to re-order one tab alone", () => {
  // Arrange
  const originalTabs = [0, 1, 2, 3, 4];
  const selectedTabs = [2];
  const moveTabsAfter = 4;

  // Act
  const reordered = reorderTabs(originalTabs, selectedTabs, moveTabsAfter);

  // Assert
  expect(reordered).toEqual([0, 1, 3, 4, 2]);
});

it("should be able to re-order many contiguous tabs", () => {
  // Arrange
  const originalTabs = [0, 1, 2, 3, 4];
  const selectedTabs = [0, 1];
  const moveTabsAfter = 3;

  // Act
  const reordered = reorderTabs(originalTabs, selectedTabs, moveTabsAfter);

  // Assert
  expect(reordered).toEqual([2, 3, 0, 1, 4]);
});

it("should be able to re-order many non-contiguous tabs", () => {
  // Arrange
  const originalTabs = [0, 1, 2, 3, 4];
  const selectedTabs = [0, 2];
  const moveTabsAfter = 3;

  // Act
  const reordered = reorderTabs(originalTabs, selectedTabs, moveTabsAfter);

  // Assert
  expect(reordered).toEqual([1, 3, 0, 2, 4]);
});

// Property based tests

it("should group selected tabs together", () => {
  fc.assert(
    fc.property(
      tabsWithSelectionArb(),
      ({ tabs, selectedTabs, movePosition }) => {
        // Arrange / Act
        const newTabs = reorderTabs(tabs, selectedTabs, movePosition);

        // Assert
        const startMovedSelection = newTabs.indexOf(selectedTabs[0]);
        expect(
          newTabs.slice(
            startMovedSelection,
            startMovedSelection + selectedTabs.length
          )
        ).toEqual(selectedTabs);
      }
    )
  );
});

it("should insert all the selected tabs before the move position", () => {
  fc.assert(
    fc.property(
      tabsWithSelectionArb(),
      ({ tabs, selectedTabs, movePosition }) => {
        // Arrange / Act
        const newTabs = reorderTabs(tabs, selectedTabs, movePosition);

        // Assert
        const movePositionIndex = newTabs.indexOf(movePosition);
        for (const selected of selectedTabs) {
          const selectedIndex = newTabs.indexOf(selected);
          expect(selectedIndex).toBeLessThan(movePositionIndex);
        }
      }
    )
  );
});

it("should not alter non-selected tabs", () => {
  fc.assert(
    fc.property(
      tabsWithSelectionArb(),
      ({ tabs, selectedTabs, movePosition }) => {
        // Arrange / Act
        const newTabs = reorderTabs(tabs, selectedTabs, movePosition);

        // Assert
        expect(newTabs.filter((t) => !selectedTabs.includes(t))).toEqual(
          tabs.filter((t) => !selectedTabs.includes(t))
        );
      }
    )
  );
});

it("should not change the list of tabs, just its order", () => {
  fc.assert(
    fc.property(
      tabsWithSelectionArb(),
      ({ tabs, selectedTabs, movePosition }) => {
        // Arrange / Act
        const newTabs = reorderTabs(tabs, selectedTabs, movePosition);

        // Assert
        expect([...newTabs].sort()).toEqual([...tabs].sort());
      }
    )
  );
});

// Helpers

function tabsWithSelectionArb() {
  return fc
    .set(fc.nat(), { minLength: 2 })
    .chain((tabs) =>
      fc.record({
        tabs: fc.constant(tabs),
        selectedTabs: fc.subarray(tabs, {
          minLength: 1,
          maxLength: tabs.length - 1,
        }),
      })
    )
    .chain(({ tabs, selectedTabs }) =>
      fc.record({
        tabs: fc.constant(tabs),
        selectedTabs: fc.constant(selectedTabs),
        movePosition: fc.constantFrom(
          ...tabs.filter((t) => !selectedTabs.includes(t))
        ),
      })
    );
}
