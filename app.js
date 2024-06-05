const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
    renderBoard();
  };

  const getBoard = () => board;

  const setCell = (index, symbol) => {
    if (board[index] === "") {
      board[index] = symbol;
      return true;
    }
    return false;
  };

  const renderBoard = () => {
    const gameBoardElement = document.getElementById("game-board");
    gameBoardElement.innerHTML = "";
    board.forEach((cell, index) => {
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell");
      cellElement.textContent = cell;
      cellElement.addEventListener("click", () =>
        GameController.makeMove(index)
      );
      gameBoardElement.appendChild(cellElement);
    });
  };

  return {
    resetBoard,
    getBoard,
    setCell,
    renderBoard,
  };
})(); // End of Gameboard module

const Player = (name, symbol) => {
  return { name, symbol };
};

const GameController = (() => {
  let players = [];
  let currentPlayerIndex = 0;
  let gameActive = true;

  const initializeGame = (player1Name, player2Name) => {
    console.log("Initializing game with players:", player1Name, player2Name);
    players = [Player(player1Name, "X"), Player(player2Name, "O")];
    currentPlayerIndex = 0;
    gameActive = true;
    Gameboard.resetBoard();
    updateStatus();
  };

  const switchPlayer = () => {
    currentPlayerIndex = (currentPlayerIndex + 1) % 2;
  };

  const getCurrentPlayer = () => players[currentPlayerIndex];

  const makeMove = (index) => {
    if (gameActive && Gameboard.setCell(index, getCurrentPlayer().symbol)) {
      Gameboard.renderBoard();
      if (checkWin()) {
        gameActive = false;
        document.getElementById("game-status").textContent = `${
          getCurrentPlayer().name
        } wins!`;
      } else if (checkDraw()) {
        gameActive = false;
        document.getElementById("game-status").textContent = "It's a draw!";
      } else {
        switchPlayer();
        updateStatus();
      }
    }
  };

  const checkWin = () => {
    const board = Gameboard.getBoard();
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    return winPatterns.some((pattern) => {
      const [a, b, c] = pattern;
      return board[a] && board[a] === board[b] && board[a] === board[c];
    });
  };

  const checkDraw = () => {
    return Gameboard.getBoard().every((cell) => cell !== "");
  };

  const updateStatus = () => {
    document.getElementById("game-status").textContent = `${
      getCurrentPlayer().name
    }'s turn`;
  };

  return {
    initializeGame,
    makeMove,
  };
})();

document.getElementById("start-button").addEventListener("click", () => {
  const player1Name = document.getElementById("player1").value || "Player 1";
  const player2Name = document.getElementById("player2").value || "Player 2";
  GameController.initializeGame(player1Name, player2Name);
  Gameboard.renderBoard(); // Ensure the board is rendered after starting the game
});

document.getElementById("reset-button").addEventListener("click", () => {
  // Clear the player names
  document.getElementById("player1").value = "";
  document.getElementById("player2").value = "";

  // Reinitialize the game with default player names
  GameController.initializeGame("Player 1", "Player 2");

  // Clear the game status
  document.getElementById("game-status").textContent = "";
});
