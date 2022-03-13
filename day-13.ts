import allSolvers from "nonogram-solver/src/allSolvers";
import Puzzle from "nonogram-solver/src/Puzzle";
import Strategy from "nonogram-solver/src/Strategy";

/**
 * Solver of nonograms.
 *
 * Nonogram is a game in which the user is asked to colorize a grid based on hints.
 * A cell in the grid will be either filled or not.
 *
 * For instance, the grid below:
 *
 *        12
 *      3211
 *
 * 1 2  ????
 * 1 1  ????
 *   3  ????
 * 1 1  ????
 *
 * Will result in:
 *
 *        12
 *      3211
 *
 * 1 2  x.xx
 * 1 1  x..x
 *   3  xxx.
 * 1 1  .x.x
 *
 * To define this grid you'll have to pass:
 * - rows:    [[1,2],[1,1],[3],[1,1]]
 * - columns: [[3],[2],[1,1],[2,1]]
 *
 * @param rows - For each row, the set of hints concerning the number of filled cells
 * @param columns - For each column, the set of hints concerning the number of filled cells
 */
export function nonogramSolver(rows: number[][], columns: number[][]): string {
  const puzzle = new Puzzle({ rows, columns });
  const strategy = new Strategy(allSolvers);
  strategy.solve(puzzle);
  const { content } = puzzle.toJSON();
  return rows
    .map((_, rowIndex) => {
      const dataStart = rowIndex * columns.length;
      const dataEnd = (rowIndex + 1) * columns.length;
      return content
        .slice(dataStart, dataEnd)
        .map((c: number) => (c === 1 ? "x" : "."))
        .join("");
    })
    .join("\n");
}
