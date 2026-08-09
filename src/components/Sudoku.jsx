import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';

gsap.registerPlugin(ScrollTrigger);

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
  function solve(g) {
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
  }
  solve(g);
  return g;
}

function formatTime(s) {
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}

export default function Sudoku() {
  const [difficulty, setDifficulty] = useState('easy');
  const [puzzle, setPuzzle] = useState([]);
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedNum, setSelectedNum] = useState(null);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [seconds, setSeconds] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const containerRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.sdk-header',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
      gsap.fromTo(['.sdk-controls', '.sdk-game'],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => startNewGame('easy')
      });
    }, containerRef);

    return () => {
      ctx.revert();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSeconds(0);
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  const startNewGame = (diff = difficulty) => {
    const orig = PUZZLES[diff].map(row => [...row]);
    const sol = solveSudoku(orig);
    
    setPuzzle(orig);
    setBoard(orig.map(row => [...row]));
    setSolution(sol);
    setSelectedCell(null);
    setSelectedNum(null);
    setHintsLeft(3);
    setIsWon(false);
    
    startTimer();

    setTimeout(() => {
      gsap.fromTo('.sdk-cell',
        { scale: 0.7, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.32,
          stagger: { each: 0.007, from: 'center' }, ease: 'back.out(1.4)'
        }
      );
    }, 50);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedCell || isWon) return;
      
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 9) {
        handlePlaceNumber(selectedCell.r, selectedCell.c, num);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleErase();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, board, solution, isWon]);

  const handleCellClick = (r, c) => {
    if (isWon) return;
    
    setSelectedCell({ r, c });
    
    if (selectedNum && puzzle[r][c] === 0) {
      handlePlaceNumber(r, c, selectedNum);
    }
  };

  const handlePlaceNumber = (r, c, num) => {
    if (puzzle[r][c] !== 0) return;
    
    const newBoard = board.map((row, ri) => 
      row.map((val, ci) => (ri === r && ci === c ? num : val))
    );
    
    setBoard(newBoard);

    if (num === solution[r][c]) {
      const cell = document.querySelector(`.sdk-cell[data-r="${r}"][data-c="${c}"]`);
      if (cell) {
        gsap.fromTo(cell, { scale: 0.82 }, { scale: 1, duration: 0.32, ease: 'back.out(2)' });
      }
      checkWin(newBoard);
    } else {
      const cell = document.querySelector(`.sdk-cell[data-r="${r}"][data-c="${c}"]`);
      if (cell) {
        gsap.fromTo(cell, { x: -6 }, { x: 0, duration: 0.28, ease: 'elastic.out(1, .3)', repeat: 1, yoyo: true });
      }
    }
  };

  const handleErase = () => {
    if (!selectedCell || isWon) return;
    const { r, c } = selectedCell;
    if (puzzle[r][c] !== 0) return;

    const newBoard = board.map((row, ri) =>
      row.map((val, ci) => (ri === r && ci === c ? 0 : val))
    );
    setBoard(newBoard);
  };

  const handleHint = () => {
    if (hintsLeft <= 0 || isWon) return;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== solution[r][c] && puzzle[r][c] === 0) {
          const newBoard = board.map((row, ri) =>
            row.map((val, ci) => (ri === r && ci === c ? solution[r][c] : val))
          );
          
          const newPuzzle = puzzle.map((row, ri) =>
            row.map((val, ci) => (ri === r && ci === c ? solution[r][c] : val))
          );

          setPuzzle(newPuzzle);
          setBoard(newBoard);
          setHintsLeft(prev => prev - 1);
          
          checkWin(newBoard);
          return;
        }
      }
    }
  };

  const checkWin = (currentBoard) => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (currentBoard[r][c] !== solution[r][c]) return;
      }
    }

    setIsWon(true);
    if (timerRef.current) clearInterval(timerRef.current);
    
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    gsap.to('.sdk-cell', {
      scale: 1.05, duration: 0.28,
      stagger: { each: 0.018, from: 'center' },
      yoyo: true, repeat: 1, ease: 'power1.inOut'
    });
  };

  const handleDifficultyChange = (diff) => {
    setDifficulty(diff);
    startNewGame(diff);
  };

  const isCellSelected = (r, c) => selectedCell && selectedCell.r === r && selectedCell.c === c;

  const isCellHighlighted = (r, c) => {
    if (!selectedCell) return false;
    const { r: sr, c: sc } = selectedCell;
    return (
      r === sr ||
      c === sc ||
      (Math.floor(r / 3) === Math.floor(sr / 3) && Math.floor(c / 3) === Math.floor(sc / 3))
    );
  };

  return (
    <section id="sudoku" ref={containerRef} className="relative bg-[#111] text-white py-32 px-8 overflow-hidden">
      
      <div className="absolute -top-[80px] -right-[80px] w-[350px] h-[350px] rounded-full bg-[#e5d9f6] opacity-5 blur-[80px] pointer-events-none"></div>
      <div className="absolute -bottom-[60px] -left-[60px] w-[280px] h-[280px] rounded-full bg-[#ffd2f3] opacity-7 blur-[70px] pointer-events-none"></div>

      <div className="max-w-[900px] mx-auto relative z-10">

        <div className="sdk-header text-center mb-16 opacity-0">
          <p className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-white/35 mb-4">✦ take a break ✦</p>
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-none">Play Sudoku.</h2>
          <p className="text-[1rem] text-white/45 mt-4 font-normal">Yeah, it's right here on my portfolio. Because why not.</p>
        </div>

        <div className="sdk-controls flex items-center justify-between mb-6 flex-wrap gap-4 opacity-0">
          <div className="flex gap-2.5">
            {['easy', 'medium', 'hard'].map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => handleDifficultyChange(diff)}
                style={{
                  backgroundColor: difficulty === diff ? 'var(--accent-1)' : 'rgba(255,255,255,0.07)',
                  color: difficulty === diff ? '#111' : '#fff',
                  borderColor: difficulty === diff ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.1)'
                }}
                className="font-mono text-[0.65rem] tracking-wider uppercase px-4.5 py-2.5 rounded-full border-2 cursor-pointer font-semibold transition-all duration-200"
              >
                {diff}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <div className="font-mono text-base text-white/70">{formatTime(seconds)}</div>
            <button
              type="button"
              onClick={() => startNewGame()}
              className="font-mono text-[0.65rem] tracking-wider uppercase px-5 py-2.5 rounded-full bg-white text-black border-none cursor-pointer font-bold transition-all duration-250 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10"
            >
              New Game
            </button>
          </div>
        </div>

        <div className="sdk-game grid grid-cols-[1fr_auto] gap-8 items-start opacity-0">
          
          <div
            id="sudoku-grid"
            className="grid grid-cols-9 gap-0 border-3 border-white/50 rounded-[12px] overflow-hidden bg-white/5"
          >
            {board.map((row, r) => 
              row.map((val, c) => {
                const isGiven = puzzle[r]?.[c] !== 0;
                const isErr = val !== 0 && !isGiven && val !== solution[r]?.[c];
                
                return (
                  <div
                    key={`${r}-${c}`}
                    data-r={r}
                    data-c={c}
                    onClick={() => handleCellClick(r, c)}
                    className={`sdk-cell
                      ${isGiven ? 'given' : ''}
                      ${isCellSelected(r, c) ? 'selected' : ''}
                      ${isCellHighlighted(r, c) ? 'highlighted' : ''}
                      ${isErr ? 'error' : ''}
                      ${val !== 0 && !isGiven && !isErr ? 'filled' : ''}
                    `}
                  >
                    {val !== 0 ? val : ''}
                  </div>
                );
              })
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-2 w-36">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setSelectedNum(num);
                    if (selectedCell) handlePlaceNumber(selectedCell.r, selectedCell.c, num);
                  }}
                  className={`sdk-numkey ${selectedNum === num ? 'active-num' : ''}`}
                >
                  {num}
                </button>
              ))}
            </div>
            
            <button
              type="button"
              onClick={handleErase}
              className="font-mono text-[0.65rem] tracking-wider uppercase p-3 rounded-[10px] bg-white/6 border-2 border-white/10 cursor-pointer text-white transition-all duration-200 hover:bg-white/15"
            >
              ⌫ Erase
            </button>
            <button
              type="button"
              onClick={handleHint}
              className="font-mono text-[0.65rem] tracking-wider uppercase p-3 rounded-[10px] bg-white/6 border-2 border-white/10 cursor-pointer text-white transition-all duration-200 hover:bg-white/15"
            >
              ✦ Hint
            </button>
            <div className="font-mono text-[0.6rem] text-white/35 text-center mt-1">
              {hintsLeft > 0 ? `${hintsLeft} hint${hintsLeft !== 1 ? 's' : ''} left` : 'No hints left'}
            </div>
          </div>

        </div>

        {isWon && (
          <div
            id="sdk-win-msg"
            className="text-center mt-8 p-6 bg-[#e5d9f6] rounded-[16px] border-2 border-black/10 text-black shadow-lg"
          >
            <p className="text-xl font-extrabold tracking-tight">🎉 Puzzle solved!</p>
            <p className="font-mono text-[0.75rem] text-black/55 mt-2">Solved in {formatTime(seconds)}</p>
          </div>
        )}

      </div>
    </section>
  );
}
