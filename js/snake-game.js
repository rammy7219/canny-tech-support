(function () {
  const core = window.SnakeCore;
  const board = document.getElementById('snake-board');
  const scoreValue = document.getElementById('snake-score-value');
  const statusText = document.getElementById('snake-status');
  const restartButtons = document.querySelectorAll('[data-snake-restart]');
  const pauseButtons = document.querySelectorAll('[data-snake-pause]');
  const controlButtons = document.querySelectorAll('[data-snake-direction]');

  if (!core || !board) return;

  const TICK_MS = 130;
  let state = core.createInitialState({ gridSize: 20 });
  let tickId = null;
  let paused = false;

  function render() {
    board.innerHTML = '';
    board.style.setProperty('--snake-grid-size', state.gridSize);
    // Ensure grid columns/rows are explicitly set (fallback for some mobile browsers
    // that don't accept CSS custom properties inside repeat()). This guarantees the
    // board renders correctly on older mobile WebViews.
    board.style.gridTemplateColumns = `repeat(${state.gridSize}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${state.gridSize}, 1fr)`;

    for (let y = 0; y < state.gridSize; y += 1) {
      for (let x = 0; x < state.gridSize; x += 1) {
        const cell = document.createElement('div');
        const position = { x, y };
        const snakeIndex = state.snake.findIndex((segment) => segment.x === x && segment.y === y);

        cell.className = 'snake-cell';
        if (snakeIndex === 0) {
          cell.classList.add('snake-cell-head');
        } else if (snakeIndex > 0) {
          cell.classList.add('snake-cell-body');
        }
        if (state.food && core.containsCell([state.food], position)) {
          cell.classList.add('snake-cell-food');
        }
        board.appendChild(cell);
      }
    }

    scoreValue.textContent = state.score.toString();
    statusText.textContent = state.gameOver ? 'Game over' : paused ? 'Paused' : 'Playing';
    board.setAttribute('aria-label', `Snake board. Score ${state.score}. ${statusText.textContent}.`);

    pauseButtons.forEach((button) => {
      button.textContent = paused ? 'Resume' : 'Pause';
      button.disabled = state.gameOver;
    });
  }

  function stopLoop() {
    if (tickId) {
      window.clearInterval(tickId);
      tickId = null;
    }
  }

  function startLoop() {
    stopLoop();
    if (paused || state.gameOver) return;
    tickId = window.setInterval(() => {
      state = core.moveSnake(state);
      render();
      if (state.gameOver) stopLoop();
    }, TICK_MS);
  }

  function restart() {
    paused = false;
    state = core.createInitialState({ gridSize: 20 });
    render();
    startLoop();
    board.focus();
  }

  function togglePause() {
    if (state.gameOver) return;
    paused = !paused;
    if (paused) {
      stopLoop();
    } else {
      startLoop();
    }
    render();
  }

  function setDirection(direction) {
    state = core.changeDirection(state, direction);
  }

  const keyToDirection = {
    ArrowUp: 'up',
    w: 'up',
    W: 'up',
    ArrowRight: 'right',
    d: 'right',
    D: 'right',
    ArrowDown: 'down',
    s: 'down',
    S: 'down',
    ArrowLeft: 'left',
    a: 'left',
    A: 'left'
  };

  document.addEventListener('keydown', (event) => {
    const direction = keyToDirection[event.key];
    if (!direction) return;
    event.preventDefault();
    setDirection(direction);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== ' ') return;
    event.preventDefault();
    togglePause();
  });

  restartButtons.forEach((button) => {
    button.addEventListener('click', restart);
  });

  pauseButtons.forEach((button) => {
    button.addEventListener('click', togglePause);
  });

  controlButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setDirection(button.dataset.snakeDirection);
      board.focus();
    });
  });

  render();
  startLoop();
})();
