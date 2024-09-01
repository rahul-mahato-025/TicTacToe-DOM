document.addEventListener("DOMContentLoaded", () => {
  const matrix = document.getElementById("matrix");
  const gameInfoDiv = document.getElementById("game-info");
  let boardSize = 3;
  let usedCells = 0;
  const board = [];
  let gameStatus = "idle";
  let curPlayer;
  let winPositions = [];

  function initBoard() {
    for (let row = 0; row < boardSize; row++) {
      board[row] = [];
      for (let col = 0; col < boardSize; col++) {
        board[row][col] = "";
      }
    }
  }

  function checkConfiguration(row, col, rowDx, colDx, value) {
    if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) {
      return true;
    }

    if (board[row][col] !== value) return false;

    winPositions.push({ row, col });
    return checkConfiguration(row + rowDx, col + colDx, rowDx, colDx, value);
  }

  function hasWinningConfiguration(row, col, value) {
    winPositions = [];
    const colWiseWin = checkConfiguration(row, 0, 0, 1, value);
    if (colWiseWin === true) return true;

    winPositions = [];
    const rowWiseWin = checkConfiguration(0, col, 1, 0, value);
    if (rowWiseWin === true) return true;

    winPositions = [];
    const leftDiagnalWin = checkConfiguration(0, 0, 1, 1, value);
    if (leftDiagnalWin === true) return true;

    winPositions = [];
    const rightDiagnalWin = checkConfiguration(0, boardSize - 1, 1, -1, value);
    if (rightDiagnalWin === true) return true;

    return false;
  }

  function handleRestart() {
    usedCells = 0;
    winPositions = [];
    initialize();
  }

  function drawGameInfo() {
    if (gameStatus === "inProgress") {
      gameInfoDiv.innerHTML = `<h2>Current Player : <span>${curPlayer.player}</span></h2>`;
    } else {
      if (gameStatus === "won") {
        gameInfoDiv.innerHTML = `<h2><span>${curPlayer.player}</span> has won !!!</h2>`;
      } else {
        gameInfoDiv.innerHTML = `<h2>Match Drawn !!!</h2>`;
      }
      const restartBtn = document.createElement("button");
      restartBtn.classList.add("btn");
      restartBtn.textContent = "Restart";
      restartBtn.addEventListener("click", handleRestart);
      gameInfoDiv.appendChild(restartBtn);
    }
  }

  function startWinningCellAnimation() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      winPositions.forEach((position) => {
        if (
          cell.location.row === position.row &&
          cell.location.col === position.col
        )
          cell.classList.add("blink");
      });
    });
  }

  function isGameOver(row, col) {
    if (hasWinningConfiguration(row, col, curPlayer.value)) {
      gameStatus = "won";
      drawGameInfo();
      startWinningCellAnimation();
      return true;
    }

    if (usedCells === boardSize * boardSize) {
      gameStatus = "draw";
      drawGameInfo();
      return true;
    }
    return false;
  }

  function updateCurrentPlayer() {
    if (curPlayer.player === "Player X")
      curPlayer = { player: "Player O", value: "O" };
    else curPlayer = { player: "Player X", value: "X" };
  }

  function updateBoard(e) {
    const row = e.target.location.row;
    const col = e.target.location.col;
    if (gameStatus !== "inProgress" || board[row][col] !== "") return;
    board[row][col] = curPlayer.value;
    drawCells();
    usedCells++;
    if (!isGameOver(row, col)) {
      updateCurrentPlayer();
      drawGameInfo();
    }
  }

  function drawCells() {
    matrix.innerHTML = "";
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.location = { row, col };
        cell.innerHTML = `<h2>${board[row][col]}</h2>`;
        cell.addEventListener("click", updateBoard);
        matrix.appendChild(cell);
      }
    }
  }

  function runGame() {
    curPlayer = { player: "Player X", value: "X" };
    gameStatus = "inProgress";
    gameInfoDiv.innerHTML = `<h2>Current Player : <span>${curPlayer.player}</span></h2>`;
    drawCells();
  }

  function initialize() {
    initBoard();
    runGame();
  }

  initialize();
});
