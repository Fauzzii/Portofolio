(function SudokuGame() {
  const PUZZLES = {
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
      [0,0,0,0,0,0,2,0,0],
      [0,8,0,0,0,7,0,9,0],
      [6,0,2,0,0,0,5,0,0],
      [0,7,0,0,6,0,0,0,0],
      [0,0,0,9,0,1,0,0,0],
      [0,0,0,0,2,0,0,4,0],
      [0,0,5,0,0,0,6,0,3],
      [0,9,0,4,0,0,0,7,0],
      [0,0,6,0,0,0,0,0,0]
    ]
  };

  let puzzle = [], solution = [], board = [];
  let selectedCell = null, selectedNum = null;
  let hintsLeft = 3, difficulty = 'easy';
  let timerInterval = null, seconds = 0;

  function isValid(g, r, c, n) {
    for (let i = 0; i < 9; i++) {
      if (g[r][i] === n || g[i][c] === n) return false;
      const br = 3 * Math.floor(r / 3) + Math.floor(i / 3);
      const bc = 3 * Math.floor(c / 3) + (i % 3);
      if (g[br][bc] === n) return false;
    }
    return true;
  }

  function solveSudoku(grid) {
    const g = grid.map(row => [...row]);
    (function solve(g) {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (g[r][c] !== 0) continue;
          for (let n = 1; n <= 9; n++) {
            if (isValid(g, r, c, n)) {
              g[r][c] = n;
              if (solve(g)) return true;
              g[r][c] = 0;
            }
          }
          return false;
        }
      }
      return true;
    })(g);
    return g;
  }

  function formatTime(s) {
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }

  function startTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    timerInterval = setInterval(() => {
      seconds++;
      const el = document.getElementById('sdk-timer');
      if (el) el.textContent = formatTime(seconds);
    }, 1000);
  }

  function renderGrid() {
    const grid = document.getElementById('sudoku-grid');
    if (!grid) return;
    grid.innerHTML = '';

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = document.createElement('div');
        cell.className = 'sdk-cell';
        cell.dataset.r = r;
        cell.dataset.c = c;

        if (puzzle[r][c]) {
          cell.textContent = puzzle[r][c];
          cell.classList.add('given');
        }
        cell.addEventListener('click', () => onCellClick(cell, r, c));
        grid.appendChild(cell);
      }
    }

    gsap.fromTo('.sdk-cell',
      { scale: 0.7, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.32,
        stagger: { each: 0.007, from: 'center' }, ease: 'back.out(1.4)' }
    );
  }

  function clearHighlights() {
    document.querySelectorAll('.sdk-cell').forEach(c =>
      c.classList.remove('selected', 'highlighted'));
  }

  function onCellClick(cell, r, c) {
    clearHighlights();
    selectedCell = { el: cell, r, c };

    document.querySelectorAll('.sdk-cell').forEach(c2 => {
      const cr = +c2.dataset.r, cc = +c2.dataset.c;
      if (cr === r || cc === c ||
          (Math.floor(cr / 3) === Math.floor(r / 3) &&
           Math.floor(cc / 3) === Math.floor(c / 3))) {
        c2.classList.add('highlighted');
      }
    });
    cell.classList.add('selected');

    if (selectedNum && !cell.classList.contains('given')) placeNumber(r, c, selectedNum);
  }

  function selectNumber(n) {
    selectedNum = n;
    document.querySelectorAll('.sdk-numkey').forEach(b => b.classList.remove('active-num'));
    document.getElementById('sdk-num-' + n)?.classList.add('active-num');
    if (selectedCell && !selectedCell.el.classList.contains('given')) {
      placeNumber(selectedCell.r, selectedCell.c, n);
    }
  }

  function placeNumber(r, c, n) {
    board[r][c] = n;
    const cell = document.querySelector(`.sdk-cell[data-r="${r}"][data-c="${c}"]`);
    if (!cell) return;

    cell.textContent = n;
    cell.classList.add('filled');
    cell.classList.remove('error');

    if (n !== solution[r][c]) {
      cell.classList.add('error');
      cell.classList.remove('filled');
      gsap.fromTo(cell, { x: -6 },
        { x: 0, duration: 0.28, ease: 'elastic.out(1,.3)', repeat: 1, yoyo: true });
    } else {
      gsap.fromTo(cell, { scale: 0.82 }, { scale: 1, duration: 0.32, ease: 'back.out(2)' });
      checkWin();
    }
  }

  function triggerConfetti() {
    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#e5d9f6', '#ffd2f3', '#fcdca6', '#22d3ee', '#f472b6', '#ffffff'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        speedY: Math.random() * 5 + 3,
        speedX: Math.random() * 4 - 2,
        rotation: Math.random() * 360
      });
    }

    let frame = 0;
    function renderConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += 5;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      frame++;
      if (frame < 180) {
        requestAnimationFrame(renderConfetti);
      } else {
        canvas.remove();
      }
    }
    renderConfetti();
  }

  function checkWin() {
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++)
        if (board[r][c] !== solution[r][c]) return;

    clearInterval(timerInterval);
    triggerConfetti();

    const winMsg = document.getElementById('sdk-win-msg');
    const winTime = document.getElementById('sdk-win-time');
    if (winTime) winTime.textContent = 'Solved in ' + formatTime(seconds);
    if (winMsg) {
      winMsg.style.display = 'block';
      gsap.fromTo(winMsg, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, ease: 'back.out(1.5)' });
    }
    gsap.to('.sdk-cell.given, .sdk-cell.filled', {
      scale: 1.05, duration: 0.28,
      stagger: { each: 0.018, from: 'center' },
      yoyo: true, repeat: 1, ease: 'power1.inOut'
    });
  }

  window.sudokuErase = function() {
    if (!selectedCell || selectedCell.el.classList.contains('given')) return;
    const { r, c } = selectedCell;
    board[r][c] = 0;
    selectedCell.el.textContent = '';
    selectedCell.el.classList.remove('filled', 'error');
  };

  window.sudokuHint = function() {
    if (hintsLeft <= 0) return;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== solution[r][c] && !puzzle[r][c]) {
          board[r][c] = solution[r][c];
          const cell = document.querySelector(`.sdk-cell[data-r="${r}"][data-c="${c}"]`);
          if (cell) {
            cell.textContent = solution[r][c];
            cell.classList.add('given');
            cell.classList.remove('error', 'filled');
          }
          hintsLeft--;
          const hl = document.getElementById('sdk-hints-left');
          if (hl) hl.textContent = hintsLeft
            ? hintsLeft + ' hint' + (hintsLeft !== 1 ? 's' : '') + ' left'
            : 'No hints left';
          checkWin();
          return;
        }
      }
    }
  };

  window.setSudokuDifficulty = function(d) {
    difficulty = d;
    ['easy', 'medium', 'hard'].forEach(k => {
      const btn = document.getElementById('sdk-btn-' + k);
      if (!btn) return;
      const active = k === d;
      btn.style.background  = active ? 'var(--accent-1)' : 'rgba(255,255,255,.07)';
      btn.style.color       = active ? '#111'            : 'white';
      btn.style.borderColor = active ? 'rgba(0,0,0,.15)' : 'rgba(255,255,255,.1)';
    });
    window.newSudokuGame();
  };

  window.newSudokuGame = function() {
    puzzle   = PUZZLES[difficulty].map(row => [...row]);
    solution = solveSudoku(puzzle);
    board    = puzzle.map(row => [...row]);
    hintsLeft    = 3;
    selectedCell = null;
    selectedNum  = null;

    document.querySelectorAll('.sdk-numkey').forEach(b => b.classList.remove('active-num'));
    const hl = document.getElementById('sdk-hints-left');
    if (hl) hl.textContent = '3 hints left';
    const wm = document.getElementById('sdk-win-msg');
    if (wm) wm.style.display = 'none';

    renderGrid();
    startTimer();
  };

  function buildNumpad() {
    const numpad = document.getElementById('sdk-numpad');
    if (!numpad) return;
    numpad.innerHTML = '';
    for (let n = 1; n <= 9; n++) {
      const btn = document.createElement('button');
      btn.className   = 'sdk-numkey';
      btn.id          = 'sdk-num-' + n;
      btn.textContent = n;
      btn.addEventListener('click', () => selectNumber(n));
      numpad.appendChild(btn);
    }
  }

  document.addEventListener('keydown', e => {
    if (!selectedCell) return;
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= 9) selectNumber(n);
    if (e.key === 'Backspace' || e.key === 'Delete') window.sudokuErase();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildNumpad);
  } else {
    buildNumpad();
  }

  if (window.ScrollTrigger) {
    ScrollTrigger.create({
      trigger: '#sudoku',
      start  : 'top 80%',
      once   : true,
      onEnter: () => { if (!board.length) window.newSudokuGame(); }
    });
  }
})();
