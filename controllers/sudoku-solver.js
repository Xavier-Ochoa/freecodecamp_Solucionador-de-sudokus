class SudokuSolver {

  validate(puzzleString) {
    if (!puzzleString) return "Required field missing";

    if (/[^1-9\.]/.test(puzzleString)) return "Invalid characters in puzzle";

    if (puzzleString.length !== 81) return "Expected puzzle to be 81 characters long";

    return true;
  }

  getRowIndex(row) {
    if (typeof row === 'string') {
      return row.toUpperCase().charCodeAt(0) - 65;
    }
    return row;
  }

  getColIndex(column) {
    if (typeof column === 'string') {
      return parseInt(column) - 1;
    }
    return column;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let rowIdx = this.getRowIndex(row);
    let colIdx = this.getColIndex(column);
    let rowStart = rowIdx * 9;
    
    for (let i = 0; i < 9; i++) {
      if (i === colIdx) continue;
      if (puzzleString[rowStart + i] == value) return false;
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let rowIdx = this.getRowIndex(row);
    let colIdx = this.getColIndex(column);
    
    for (let i = 0; i < 9; i++) {
      if (i === rowIdx) continue;
      if (puzzleString[colIdx + i * 9] == value) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let rowIdx = this.getRowIndex(row);
    let colIdx = this.getColIndex(column);
    
    let startRow = Math.floor(rowIdx / 3) * 3;
    let startCol = Math.floor(colIdx / 3) * 3;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        let currentRow = startRow + r;
        let currentCol = startCol + c;
        if (currentRow === rowIdx && currentCol === colIdx) continue;
        let idx = currentRow * 9 + currentCol;
        if (puzzleString[idx] == value) return false;
      }
    }
    return true;
  }

  solve(puzzleString) {
    let valid = this.validate(puzzleString);
    if (valid !== true) return false;

    let grid = puzzleString.split("");

    const solveBacktrack = () => {
      let idx = grid.indexOf(".");
      if (idx === -1) return true;

      let row = Math.floor(idx / 9);
      let col = idx % 9;

      for (let num = 1; num <= 9; num++) {
        let val = num.toString();
        if (
          this.checkRowPlacement(grid.join(""), row, col, val) &&
          this.checkColPlacement(grid.join(""), row, col, val) &&
          this.checkRegionPlacement(grid.join(""), row, col, val)
        ) {
          grid[idx] = val;
          if (solveBacktrack()) return true;
          grid[idx] = ".";
        }
      }
      return false;
    };

    if (solveBacktrack()) return grid.join("");

    return "Puzzle cannot be solved";
  }
}

module.exports = SudokuSolver;
