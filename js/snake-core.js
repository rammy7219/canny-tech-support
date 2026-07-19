(function (root) {
  const DEFAULT_GRID_SIZE = 20;
  const START_LENGTH = 3;
  const DIRECTIONS = {
    up: { x: 0, y: -1 },
    right: { x: 1, y: 0 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 }
  };
  const OPPOSITE = {
    up: 'down',
    right: 'left',
    down: 'up',
    left: 'right'
  };

  function sameCell(a, b) {
    return a.x === b.x && a.y === b.y;
  }

  function containsCell(cells, cell) {
    return cells.some((candidate) => sameCell(candidate, cell));
  }

  function buildStartSnake(gridSize) {
    const center = Math.floor(gridSize / 2);
    return Array.from({ length: START_LENGTH }, (_, index) => ({
      x: center - index,
      y: center
    }));
  }

  function createSeededRandom(seed) {
    let value = seed || 1;
    return function random() {
      value = (value * 48271) % 2147483647;
      return value / 2147483647;
    };
  }

  function findAvailableCells(gridSize, snake) {
    const cells = [];
    for (let y = 0; y < gridSize; y += 1) {
      for (let x = 0; x < gridSize; x += 1) {
        const cell = { x, y };
        if (!containsCell(snake, cell)) {
          cells.push(cell);
        }
      }
    }
    return cells;
  }

  function spawnFood(gridSize, snake, random = Math.random) {
    const availableCells = findAvailableCells(gridSize, snake);
    if (!availableCells.length) return null;
    return availableCells[Math.floor(random() * availableCells.length)];
  }

  function createInitialState(options = {}) {
    const gridSize = options.gridSize || DEFAULT_GRID_SIZE;
    const random = options.random || Math.random;
    const snake = buildStartSnake(gridSize);

    return {
      gridSize,
      snake,
      direction: 'right',
      nextDirection: 'right',
      food: spawnFood(gridSize, snake, random),
      score: 0,
      gameOver: false
    };
  }

  function changeDirection(state, direction) {
    if (!DIRECTIONS[direction] || state.gameOver) return state;
    if (OPPOSITE[state.direction] === direction) return state;
    return { ...state, nextDirection: direction };
  }

  function isOutOfBounds(cell, gridSize) {
    return cell.x < 0 || cell.y < 0 || cell.x >= gridSize || cell.y >= gridSize;
  }

  function moveSnake(state, options = {}) {
    if (state.gameOver) return state;

    const random = options.random || Math.random;
    const direction = state.nextDirection;
    const vector = DIRECTIONS[direction];
    const head = state.snake[0];
    const nextHead = { x: head.x + vector.x, y: head.y + vector.y };
    const ateFood = state.food && sameCell(nextHead, state.food);
    const bodyToCheck = ateFood ? state.snake : state.snake.slice(0, -1);

    if (isOutOfBounds(nextHead, state.gridSize) || containsCell(bodyToCheck, nextHead)) {
      return { ...state, direction, gameOver: true };
    }

    const nextSnake = [nextHead, ...state.snake];
    if (!ateFood) {
      nextSnake.pop();
    }

    return {
      ...state,
      snake: nextSnake,
      direction,
      nextDirection: direction,
      food: ateFood ? spawnFood(state.gridSize, nextSnake, random) : state.food,
      score: ateFood ? state.score + 1 : state.score,
      gameOver: false
    };
  }

  const api = {
    DEFAULT_GRID_SIZE,
    DIRECTIONS,
    createInitialState,
    changeDirection,
    moveSnake,
    spawnFood,
    createSeededRandom,
    containsCell
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  root.SnakeCore = api;
})(typeof window !== 'undefined' ? window : globalThis);
