import { nonogramSolver } from "./day-13";
import fc from "fast-check";

// Examples based tests

it("should be able to solve our nonogram", () => {
  // Arrange
  const rows = [[1, 2], [1, 1], [3], [1, 1]];
  const columns = [[3], [2], [1, 1], [2, 1]];
  let expectedSolution = "";
  expectedSolution += "x.xx\n";
  expectedSolution += "x..x\n";
  expectedSolution += "xxx.\n";
  expectedSolution += ".x.x";

  // Act
  const solution = nonogramSolver(rows, columns);

  // Assert
  expect(solution).toEqual(expectedSolution);
});

it("should be able to solve nonogram with non unique solution", () => {
  // Arrange
  const rows = [[1], [1]];
  const columns = [[1], [1]];
  let expectedSolutionA = "";
  expectedSolutionA += ".x\n";
  expectedSolutionA += "x.";
  let expectedSolutionB = "";
  expectedSolutionB += "x.\n";
  expectedSolutionB += ".x";

  // Act
  const solution = nonogramSolver(rows, columns);

  // Assert
  const isA = solution === expectedSolutionA;
  const isB = solution === expectedSolutionB;
  expect(isA || isB).toBe(true);
});

// Property based tests

it("should respect the constraints when filling the grid", () => {
  fc.assert(
    fc.property(
      fc
        .record({
          numRows: fc.integer({ min: 1, max: 10 }),
          numColumns: fc.integer({ min: 1, max: 10 }),
        })
        .chain(({ numRows, numColumns }) =>
          fc.array(
            fc.array(fc.constantFrom(".", "x"), {
              minLength: numColumns,
              maxLength: numColumns,
            }),
            { minLength: numRows, maxLength: numRows }
          )
        ),
      (initialGrid) => {
        // Arrange
        const constraints = gridToConstraints(initialGrid);

        // Act
        const solution = nonogramSolver(constraints.rows, constraints.columns);

        // Assert
        const gridSolution = solution.split("\n").map((line) => line.split(""));
        expect(gridToConstraints(gridSolution)).toEqual(constraints);
      }
    )
  );
});

// Helper

function gridToConstraints(grid: string[][]): {
  rows: number[][];
  columns: number[][];
} {
  const rows: number[][] = [];
  for (let rowIndex = 0; rowIndex !== grid.length; ++rowIndex) {
    const row: number[] = [];
    let numX = 0;
    for (let colIndex = 0; colIndex !== grid[0].length + 1; ++colIndex) {
      const c = grid[rowIndex][colIndex];
      if (c === "x") {
        ++numX;
      } else if (numX !== 0) {
        row.push(numX);
        numX = 0;
      }
    }
    rows.push(row);
  }
  const columns: number[][] = [];
  for (let colIndex = 0; colIndex !== grid[0].length; ++colIndex) {
    const column: number[] = [];
    let numX = 0;
    for (let rowIndex = 0; rowIndex !== grid.length + 1; ++rowIndex) {
      const c = grid[rowIndex]?.[colIndex];
      if (c === "x") {
        ++numX;
      } else if (numX !== 0) {
        column.push(numX);
        numX = 0;
      }
    }
    columns.push(column);
  }
  return { rows, columns };
}
