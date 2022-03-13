import { respace } from "./day-05";
import fc from "fast-check";

// Helper

function sorted(arr: string[]): string[] {
  return [...arr];
}

// Examples based tests

it("should be able to detect one match when there is only one", () => {
  const out = respace("helloworld", ["hello", "world"]);
  expect(out).toEqual(["hello world"]);
});

it("should not detect any match and produce empty arrays when no matchs", () => {
  const out = respace("hellowooorld", ["hello", "world"]);
  expect(out).toEqual([]);
});

it("should be able to detect all the matches when multiple are eligible", () => {
  const out = respace("tititi", ["ti", "titi"]);
  expect(sorted(out)).toEqual(["ti ti ti", "ti titi", "titi ti"]);
});

// Property based tests

const alphaCharArb = fc
  .integer({ min: "a".charCodeAt(0), max: "z".charCodeAt(0) })
  .map((v) => String.fromCharCode(v));
const wordArb = fc.stringOf(alphaCharArb, { minLength: 1 });

it("should be able to find back the original message", () => {
  fc.assert(
    fc.property(
      fc.set(wordArb, { minLength: 1 }).chain((words) =>
        fc.record({
          words: fc.constant(words),
          originalMessage: fc
            .array(fc.constantFrom(...words))
            .map((items) => items.join(" ")),
        })
      ),
      ({ words, originalMessage }) => {
        const spacelessMessage = originalMessage.replace(/ /g, "");
        const combinations = respace(spacelessMessage, words);
        expect(combinations).toContain(originalMessage);
      }
    )
  );
});

it("should only return messages with spaceless version being the passed message", () => {
  fc.assert(
    fc.property(
      fc.set(wordArb, { minLength: 1 }).chain((words) =>
        fc.record({
          words: fc.shuffledSubarray(words), // we potentially remove words from the dictionary to cover no match case
          originalMessage: fc
            .array(fc.constantFrom(...words))
            .map((items) => items.join(" ")),
        })
      ),
      ({ words, originalMessage }) => {
        const spacelessMessage = originalMessage.replace(/ /g, "");
        const combinations = respace(spacelessMessage, words);
        for (const combination of combinations) {
          expect(combination.replace(/ /g, "")).toBe(spacelessMessage);
        }
      }
    )
  );
});

it("should only return messages built from words coming from the set of words", () => {
  fc.assert(
    fc.property(
      fc.set(wordArb, { minLength: 1 }).chain((words) =>
        fc.record({
          words: fc.shuffledSubarray(words), // we potentially remove words from the dictionary to cover no match case
          originalMessage: fc
            .array(fc.constantFrom(...words))
            .map((items) => items.join(" ")),
        })
      ),
      ({ words, originalMessage }) => {
        const spacelessMessage = originalMessage.replace(/ /g, "");
        const combinations = respace(spacelessMessage, words);
        for (const combination of combinations) {
          if (combination.length !== 0) {
            expect(words).toIncludeAnyMembers(combination.split(" "));
          }
        }
      }
    )
  );
});
