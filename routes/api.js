'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: "Required field(s) missing" });
      }

      let validation = solver.validate(puzzle);
      if (validation !== true) return res.json({ error: validation });

      if (!/^[A-Ia-i][1-9]$/.test(coordinate))
        return res.json({ error: "Invalid coordinate" });

      if (!/^[1-9]$/.test(value))
        return res.json({ error: "Invalid value" });

      let row = coordinate[0].toUpperCase().charCodeAt(0) - 65;
      let col = parseInt(coordinate[1]) - 1;

      let conflicts = [];

      if (!solver.checkRowPlacement(puzzle, row, col, value))
        conflicts.push("row");

      if (!solver.checkColPlacement(puzzle, row, col, value))
        conflicts.push("column");

      if (!solver.checkRegionPlacement(puzzle, row, col, value))
        conflicts.push("region");

      if (conflicts.length > 0)
        return res.json({ valid: false, conflict: conflicts });

      return res.json({ valid: true });
    });

  app.route('/api/solve')
    .post((req, res) => {
      let { puzzle } = req.body;

      if (!puzzle) return res.json({ error: "Required field missing" });

      let validation = solver.validate(puzzle);
      if (validation !== true) return res.json({ error: validation });

      let solution = solver.solve(puzzle);
      if (solution === "Puzzle cannot be solved") 
        return res.json({ error: "Puzzle cannot be solved" });

      return res.json({ solution });
    });
};
