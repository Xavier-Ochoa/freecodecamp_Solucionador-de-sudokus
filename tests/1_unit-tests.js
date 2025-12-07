const chai = require("chai");
const assert = chai.assert;
const Solver = require("../controllers/sudoku-solver.js");

suite("Unit Tests", function () {
  let solver = new Solver();
  const validPuzzle =
    "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";

  test("Valid 81-character puzzle", function () {
    assert.equal(solver.validate(validPuzzle), true);
  });

  test("Puzzle with invalid characters", function () {
    const invalidPuzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3X.";
    assert.equal(solver.validate(invalidPuzzle), "Invalid characters in puzzle");
  });

  test("Puzzle with incorrect length", function () {
    assert.equal(
      solver.validate(validPuzzle.slice(0, 80)),
      "Expected puzzle to be 81 characters long"
    );
  });

  test("Valid row placement", function () {
    assert.equal(solver.checkRowPlacement(validPuzzle, "A", "2", "3"), true);
  });

  test("Invalid row placement", function () {
    assert.equal(solver.checkRowPlacement(validPuzzle, "A", "2", "1"), false);
  });

  test("Valid column placement", function () {
    assert.equal(solver.checkColPlacement(validPuzzle, "A", "2", "3"), true);
  });

  test("Invalid column placement", function () {
    assert.equal(solver.checkColPlacement(validPuzzle, "A", "2", "9"), false);
  });

  test("Valid region placement", function () {
    assert.equal(solver.checkRegionPlacement(validPuzzle, "A", "2", "3"), true);
  });

  test("Invalid region placement", function () {
    assert.equal(solver.checkRegionPlacement(validPuzzle, "A", "2", "1"), false);
  });

  test("Valid puzzle can be solved", function () {
    const solution = solver.solve(validPuzzle);
    assert.match(solution, /^[1-9]{81}$/);
  });

  test("Invalid puzzle cannot be solved", function () {
    const unsolvable = "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    assert.equal(solver.solve(unsolvable), "Puzzle cannot be solved");
  });

  test("Solver returns expected solution", function () {
    const puzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const expected =
      "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
    assert.equal(solver.solve(puzzle), expected);
  });
});
