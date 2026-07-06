# Sudoku Solver

An interactive Sudoku puzzle solver built with HTML, CSS, and JavaScript. Enter any valid puzzle and let the backtracking algorithm solve it instantly.

## Features

- **Backtracking Algorithm** — Solves any valid Sudoku puzzle
- **Input Validation** — Detects conflicting numbers and highlights errors
- **Example Puzzles** — Pre-loaded Easy, Medium, and Hard puzzles
- **Visual Feedback** — Given numbers in black, solved cells in indigo, errors in red
- **Keyboard Shortcut** — Press Ctrl+Enter to solve quickly

## How to Use

1. Open `index.html` in your browser
2. Click **Easy**, **Medium**, or **Hard** to load an example puzzle
3. Click **Solve** to fill in the missing numbers
4. Or manually enter numbers and click **Solve**
5. Click **Clear** to reset the grid

## Files

- `index.html` — Game layout
- `style.css` — Light theme styling
- `script.js` — Grid logic and backtracking solver

## Algorithm

The solver uses recursive backtracking:
1. Find the first empty cell
2. Try numbers 1–9
3. Check validity against row, column, and 3×3 box
4. If valid, place and recurse
5. If dead end, backtrack and try the next number
