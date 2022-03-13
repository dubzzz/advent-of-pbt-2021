import { validParentheses } from "./day-12";
import fc from "fast-check";

// Examples based tests

it("should accept simple expressions like []", () => {
  expect(validParentheses("[]")).toBe(true);
});

it("should accept nested expressions like [({})]", () => {
  expect(validParentheses("[({})]")).toBe(true);
});

it("should accept expressions with multiple groups like [({})][]([])", () => {
  expect(validParentheses("[({})][]([])")).toBe(true);
});

it("should reject wrong matching bracket", () => {
  expect(validParentheses("[)")).toBe(false);
});

it("should reject unbalanced number of brackets with more closing", () => {
  expect(validParentheses("[]()}")).toBe(false);
});

it("should reject unbalanced number of brackets with more opening", () => {
  expect(validParentheses("[](){")).toBe(false);
});

it("should reject bad nesting", () => {
  expect(validParentheses("[(])")).toBe(false);
});

// Property based tests

it("should accept any well-parenthesized expression", () => {
  fc.assert(
    fc.property(wellParenthesizedStringArbitrary, (expression) => {
      expect(validParentheses(expression)).toBe(true);
    })
  );
});

it("should reject any expression not containing an even number of signs", () => {
  fc.assert(
    fc.property(
      fc
        .tuple(
          fc.array(
            fc.tuple(
              fc.constantFrom("(", "[", "{", ")", "]", "}"),
              fc.constantFrom("(", "[", "{", ")", "]", "}")
            )
          ),
          fc.constantFrom("(", "[", "{", ")", "]", "}")
        )
        .chain(([evenNumParentheses, extraParenthesis]) => {
          const parentheses = [...evenNumParentheses.flat(), extraParenthesis];
          return fc
            .shuffledSubarray(parentheses, { minLength: parentheses.length })
            .map((parentheses) => parentheses.join(""));
        }),
      (invalidExpression) => {
        expect(validParentheses(invalidExpression)).toBe(false);
      }
    )
  );
});

it("should reject any expression not containing an even number of signs (2)", () => {
  fc.assert(
    fc.property(
      fc
        .array(fc.constantFrom("(", "[", "{", ")", "]", "}"), { minLength: 1 })
        .filter((parentheses) => parentheses.length % 2 === 1)
        .map((parentheses) => parentheses.join("")),
      (invalidExpression) => {
        expect(validParentheses(invalidExpression)).toBe(false);
      }
    )
  );
});

it("should reject any expression not having the same number of openings and closings", () => {
  fc.assert(
    fc.property(
      wellParenthesizedStringArbitrary,
      fc.constantFrom("(", "[", "{", ")", "]", "}"),
      fc.nat().noShrink(),
      (expression, extra, seed) => {
        const position = seed % (expression.length + 1);
        const invalidExpression =
          expression.substring(0, position) +
          extra +
          expression.substring(position);
        expect(validParentheses(invalidExpression)).toBe(false);
      }
    )
  );
});

it("should reject any expression with at least one reversed openings and closings", () => {
  fc.assert(
    fc.property(reversedParenthesizedStringArbitrary, (expression) => {
      expect(validParentheses(expression)).toBe(false);
    })
  );
});

it("should reject any expression with non-matching openings and closings", () => {
  fc.assert(
    fc.property(nonMatchingEndParenthesizedStringArbitrary, (expression) => {
      expect(validParentheses(expression)).toBe(false);
    })
  );
});

// Helpers

type WellParenthesized = {
  type: "(" | "[" | "{";
  content: WellParenthesized[];
};
function wellParenthesizedToString(definition: WellParenthesized): string {
  const { type, content } = definition;
  const openingBracket = type;
  const closingBracket = type === "(" ? ")" : type === "[" ? "]" : "}";
  return `${openingBracket}${content
    .map((p) => wellParenthesizedToString(p))
    .join("")}${closingBracket}`;
}
const wellParenthesizedArbitrary = fc.letrec((tie) => ({
  parenthesized: fc.record<WellParenthesized>({
    type: fc.constantFrom("(", "[", "{"),
    // We use a oneof instead of a raw array to enforce the convergence towards a finite structure
    content: fc.oneof(
      { depthFactor: 1 },
      fc.constant([]),
      fc.array(tie("parenthesized") as fc.Arbitrary<WellParenthesized>)
    ),
  }),
})).parenthesized;
const wellParenthesizedStringArbitrary = fc
  .array(wellParenthesizedArbitrary)
  .map((def) => def.map((p) => wellParenthesizedToString(p)).join(""));

type ReversedParenthesized = {
  type: "(" | "[" | "{";
  content: ReversedParenthesized[];
  reversed: boolean;
};
function reversedParenthesizedToString(
  subDefinition: ReversedParenthesized
): string {
  const { type, content, reversed } = subDefinition;
  const matching = type === "(" ? ")" : type === "[" ? "]" : "}";
  const openingBracket = reversed ? matching : type;
  const closingBracket = reversed ? type : matching;
  return `${openingBracket}${content
    .map((p) => reversedParenthesizedToString(p))
    .join("")}${closingBracket}`;
}
function hasReversed(subDefinition: ReversedParenthesized): boolean {
  if (subDefinition.reversed) return true;
  return subDefinition.content.some(
    (p) => subDefinition.type !== p.type && hasReversed(p)
  );
}
const reversedParenthesizedArbitrary = fc.letrec((tie) => ({
  parenthesized: fc.record<ReversedParenthesized>({
    reversed: fc.boolean(),
    type: fc.constantFrom("(", "[", "{"),
    // We use a oneof instead of a raw array to enforce the convergence towards a finite structure
    content: fc.oneof(
      { depthFactor: 1 },
      fc.constant([]),
      fc.array(tie("parenthesized") as fc.Arbitrary<ReversedParenthesized>)
    ),
  }),
})).parenthesized;
const reversedParenthesizedStringArbitrary = fc
  .array(reversedParenthesizedArbitrary)
  .filter((def) => def.some((p) => hasReversed(p)))
  .map((def) => def.map((p) => reversedParenthesizedToString(p)).join(""));

type NonMatchingEndParenthesized = {
  start: "(" | "[" | "{";
  end: ")" | "]" | "}";
  content: NonMatchingEndParenthesized[];
};

const nonMatchingEndParenthesizedArbitrary = fc.letrec((tie) => ({
  parenthesized: fc.record<NonMatchingEndParenthesized>({
    start: fc.constantFrom("(", "[", "{"),
    end: fc.constantFrom(")", "]", "}"),
    // We use a oneof instead of a raw array to enforce the convergence towards a finite structure
    content: fc.oneof(
      { depthFactor: 1 },
      fc.constant([]),
      fc.array(
        tie("parenthesized") as fc.Arbitrary<NonMatchingEndParenthesized>
      )
    ),
  }),
})).parenthesized;

function nonMatchingEndParenthesizedToString(
  definition: NonMatchingEndParenthesized
): string {
  return `${definition.start}${definition.content
    .map((p) => nonMatchingEndParenthesizedToString(p))
    .join("")}${definition.end}`;
}

function hasNonMatchingEnd(
  subDefinition: NonMatchingEndParenthesized
): boolean {
  const matchingEnd =
    subDefinition.start === "(" ? ")" : subDefinition.start === "[" ? "]" : "}";
  if (subDefinition.end !== matchingEnd) return true;
  if (subDefinition.content.length !== 1)
    return subDefinition.content.some((p) => hasNonMatchingEnd(p));
  return false; // We still reject too many things
}

const nonMatchingEndParenthesizedStringArbitrary = fc
  .array(nonMatchingEndParenthesizedArbitrary)
  .filter((def) => def.some((p) => hasNonMatchingEnd(p)))
  .map((def) =>
    def.map((p) => nonMatchingEndParenthesizedToString(p)).join("")
  );
