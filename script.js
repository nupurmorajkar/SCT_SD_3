const SIZE = 9;

const gridBody = document.getElementById('grid-body');
const btnSolve = document.getElementById('btn-solve');
const btnClear = document.getElementById('btn-clear');
const statusEl = document.getElementById('status');

let inputs = [];

const EXAMPLES = {
  easy: [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
  ],
  medium: [
    [0,0,0,2,6,0,7,0,1],
    [6,8,0,0,7,0,0,9,0],
    [1,9,0,0,0,4,5,0,0],
    [8,2,0,1,0,0,0,4,0],
    [0,0,4,6,0,2,9,0,0],
    [0,5,0,0,0,3,0,2,8],
    [0,0,9,3,0,0,0,7,4],
    [0,4,0,0,5,0,0,3,6],
    [7,0,3,0,1,8,0,0,0]
  ],
  hard: [
    [0,0,0,0,7,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,9,0,0,0,0,0,0,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
  ]
};

function createGrid() {
  gridBody.innerHTML = '';
  inputs = [];

  for (let r = 0; r < SIZE; r++) {
    const tr = document.createElement('tr');
    const rowInputs = [];

    for (let c = 0; c < SIZE; c++) {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'text';
      input.inputMode = 'numeric';
      input.maxLength = 1;
      input.dataset.row = r;
      input.dataset.col = c;

      input.addEventListener('input', () => {
        input.value = input.value.replace(/[^1-9]/g, '');
        statusEl.textContent = 'Enter numbers and click Solve';
        statusEl.className = 'status';
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const next = inputs[r]?.[c + 1] || inputs[r + 1]?.[0];
          if (next) next.focus();
        }
      });

      td.appendChild(input);
      tr.appendChild(td);
      rowInputs.push(input);
    }

    gridBody.appendChild(tr);
    inputs.push(rowInputs);
  }
}

function getGrid() {
  const grid = [];
  for (let r = 0; r < SIZE; r++) {
    const row = [];
    for (let c = 0; c < SIZE; c++) {
      const val = inputs[r][c].value.trim();
      row.push(val ? parseInt(val) : 0);
    }
    grid.push(row);
  }
  return grid;
}

function setGrid(grid, given) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const input = inputs[r][c];
      const val = grid[r][c];
      input.value = val !== 0 ? val : '';
      input.className = '';
      if (given && val !== 0) {
        input.classList.add('given');
      }
    }
  }
}

function isValid(grid, row, col, num) {
  for (let i = 0; i < SIZE; i++) {
    if (i !== col && grid[row][i] === num) return false;
    if (i !== row && grid[i][col] === num) return false;
  }

  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++) {
    for (let c = bc; c < bc + 3; c++) {
      if ((r !== row || c !== col) && grid[r][c] === num) return false;
    }
  }

  return true;
}

function solve(grid) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(grid, r, c, num)) {
            grid[r][c] = num;
            if (solve(grid)) return true;
            grid[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function clearSolvedStyles() {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      inputs[r][c].classList.remove('solved', 'error');
    }
  }
}

function handleSolve() {
  clearSolvedStyles();

  const grid = getGrid();

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] !== 0) {
        const num = grid[r][c];
        grid[r][c] = 0;
        if (!isValid(grid, r, c, num)) {
          inputs[r][c].classList.add('error');
          statusEl.textContent = 'Invalid puzzle! Check highlighted cells.';
          statusEl.className = 'status error';
          return;
        }
        grid[r][c] = num;
      }
    }
  }

  const copy = grid.map(row => [...row]);

  if (solve(copy)) {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const input = inputs[r][c];
        if (grid[r][c] === 0) {
          input.value = copy[r][c];
          input.classList.add('solved');
        }
      }
    }
    statusEl.textContent = 'Solved successfully!';
    statusEl.className = 'status success';
  } else {
    statusEl.textContent = 'No solution exists for this puzzle.';
    statusEl.className = 'status error';
  }
}

function handleClear() {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      inputs[r][c].value = '';
      inputs[r][c].className = '';
    }
  }
  statusEl.textContent = 'Enter numbers and click Solve';
  statusEl.className = 'status';
  inputs[0][0].focus();
}

function loadExample(level) {
  const grid = EXAMPLES[level];
  setGrid(grid, true);
  clearSolvedStyles();
  statusEl.textContent = `Loaded ${level} puzzle. Click Solve.`;
  statusEl.className = 'status';
}

btnSolve.addEventListener('click', handleSolve);
btnClear.addEventListener('click', handleClear);

document.querySelectorAll('.btn-example').forEach(btn => {
  btn.addEventListener('click', () => loadExample(btn.dataset.example));
});

document.addEventListener('DOMContentLoaded', () => {
  createGrid();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.ctrlKey) {
    e.preventDefault();
    handleSolve();
  }
});
