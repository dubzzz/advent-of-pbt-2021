import { minimalNumberOfChangesToBeOther } from "./day-10";
import fc from "fast-check";

// Examples based tests

it("should not consider any change to move to same value", () => {
  const out = minimalNumberOfChangesToBeOther("azerty", "azerty");
  expect(out).toBe(0);
});

it("should properly handle added characters", () => {
  const out = minimalNumberOfChangesToBeOther("azerty", "0aze5rty9");
  expect(out).toBe(3); // add: 0, 5, 9
});

it("should properly handle removed characters", () => {
  const out = minimalNumberOfChangesToBeOther("0aze5rty9", "azerty");
  expect(out).toEqual(3); // remove: 0, 5, 9
});

it("should properly handle updated characters", () => {
  const out = minimalNumberOfChangesToBeOther("azerty", "AzERTy");
  expect(out).toEqual(4); // update: a->A, e->E, r->R, t->T
});

it("should properly handle mix of add/remove/update", () => {
  const out = minimalNumberOfChangesToBeOther("azerty", "0az1eRt");
  expect(out).toEqual(4); // add: 0, 1, remove: y, update: r->R
});

// Property based tests

it("should never request any changes when moving a string to itself", () => {
  fc.assert(
    fc.property(fc.fullUnicodeString(), (value) => {
      // Arrange / Act
      const numChanges = minimalNumberOfChangesToBeOther(value, value);

      // Assert
      expect(numChanges).toBe(0);
    })
  );
});

it("should request target.length changes to move from empty to target", () => {
  fc.assert(
    fc.property(fc.fullUnicodeString(), (target) => {
      // Arrange / Act
      const numChanges = minimalNumberOfChangesToBeOther("", target);

      // Assert
      expect(numChanges).toBe([...target].length);
    })
  );
});

it("should request source.length changes to move from source to empty", () => {
  fc.assert(
    fc.property(fc.fullUnicodeString(), (source) => {
      // Arrange / Act
      const numChanges = minimalNumberOfChangesToBeOther(source, "");

      // Assert
      expect(numChanges).toBe([...source].length);
    })
  );
});

it("should request {start+end}.length changes to move from {start}{mid}{end} to {mid}", () => {
  fc.assert(
    fc.property(
      fc.fullUnicodeString(),
      fc.fullUnicodeString(),
      fc.fullUnicodeString(),
      (start, mid, end) => {
        // Arrange / Act
        const numChanges = minimalNumberOfChangesToBeOther(
          start + mid + end,
          mid
        );

        // Assert
        expect(numChanges).toBe([...(start + end)].length);
      }
    )
  );
});

it("should be independent of the ordering of the arguments", () => {
  fc.assert(
    fc.property(
      fc.fullUnicodeString(),
      fc.fullUnicodeString(),
      (source, target) => {
        // Arrange / Act
        const numChanges = minimalNumberOfChangesToBeOther(source, target);
        const numChangesReversed = minimalNumberOfChangesToBeOther(
          target,
          source
        );

        // Assert
        expect(numChangesReversed).toBe(numChanges);
      }
    )
  );
});

it("should compute the minimal number of changes to mutate source into target", () => {
  fc.assert(
    fc.property(changeArb(), (changes) => {
      // Arrange
      const source = sourceFromChanges(changes);
      const target = targetFromChanges(changes);

      // Act
      const numChanges = minimalNumberOfChangesToBeOther(source, target);

      // Assert
      expect(numChanges).toBeLessThanOrEqual(countRequestedOperations(changes));
    })
  );
});

// Helpers

type Change =
  | { type: "no-op"; value: string }
  | { type: "new"; value: string }
  | { type: "delete"; value: string }
  | { type: "update"; from: string; to: string };

function changeArb() {
  return fc.array(
    fc.oneof(
      fc.record<Change>({
        type: fc.constant("no-op"),
        value: fc.fullUnicode(),
      }),
      fc.record<Change>({ type: fc.constant("new"), value: fc.fullUnicode() }),
      fc.record<Change>({
        type: fc.constant("delete"),
        value: fc.fullUnicode(),
      }),
      fc.record<Change>({
        type: fc.constant("update"),
        from: fc.fullUnicode(),
        to: fc.fullUnicode(),
      })
    ),
    { minLength: 1 }
  );
}

function countRequestedOperations(changes: Change[]): number {
  return changes.filter((d) => d.type !== "no-op").length;
}
function sourceFromChanges(changes: Change[]): string {
  let value = "";
  for (const c of changes) {
    if (c.type === "no-op") value += c.value;
    else if (c.type === "delete") value += c.value;
    else if (c.type === "update") value += c.from;
  }
  return value;
}
function targetFromChanges(changes: Change[]): string {
  let value = "";
  for (const c of changes) {
    if (c.type === "no-op") value += c.value;
    else if (c.type === "new") value += c.value;
    else if (c.type === "update") value += c.to;
  }
  return value;
}
