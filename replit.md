# Sudoku Solver

## Overview
This is a Sudoku Solver web application built as a FreeCodeCamp Quality Assurance project. The application allows users to:
- Input a sudoku puzzle as an 81-character string (1-9 for numbers, "." for empty cells)
- Solve the puzzle automatically using a backtracking algorithm
- Check if a specific value placement is valid for a given coordinate

## Project Architecture

### Technology Stack
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js with Express
- **Testing**: Mocha, Chai, Chai-HTTP
- **Dev Server**: Nodemon

### Project Structure
```
├── controllers/
│   ├── puzzle-strings.js    # Sample puzzle strings for testing
│   └── sudoku-solver.js      # Core sudoku solving logic
├── public/
│   ├── index.js              # Frontend JavaScript
│   └── style.css             # Styling
├── routes/
│   ├── api.js                # API endpoints (/api/solve, /api/check)
│   └── fcctesting.js         # FreeCodeCamp testing routes
├── tests/
│   ├── 1_unit-tests.js       # Unit tests for solver logic
│   └── 2_functional-tests.js # Functional tests for API
├── views/
│   └── index.html            # Main HTML page
├── server.js                 # Express server configuration
└── package.json              # Node.js dependencies
```

## Configuration

### Server Configuration
- **Host**: 0.0.0.0 (required for Replit environment)
- **Port**: 5000 (configured via PORT environment variable)
- **CORS**: Enabled for all origins (for FCC testing)

### Environment Variables
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Set to "test" to run automated tests on startup

### Deployment
- **Type**: Autoscale (stateless web application)
- **Command**: `npm start` (runs nodemon server.js)

## API Endpoints

### POST /api/solve
Solves a sudoku puzzle.
- **Request Body**: `{ puzzle: "81-character-string" }`
- **Response**: `{ solution: "81-character-string" }` or `{ error: "message" }`

### POST /api/check
Checks if a value placement is valid at a specific coordinate.
- **Request Body**: `{ puzzle: "string", coordinate: "A1-I9", value: "1-9" }`
- **Response**: `{ valid: true }` or `{ valid: false, conflict: ["row"|"column"|"region"] }`

## Recent Changes
- **2024-12-07**: Initial setup for Replit environment
  - Configured server to bind to 0.0.0.0:5000
  - Set up workflow for frontend
  - Configured deployment for autoscale
  - Added .gitignore for node_modules and .env files
