### Gameboard Module

```javascript
const Gameboard = (() => {
```

This line defines a module called `Gameboard` using an immediately invoked function expression (IIFE). This keeps its variables and functions private, avoiding global scope pollution.

```javascript
let board = ["", "", "", "", "", "", "", "", ""];
```

This initializes an array `board` with 9 empty strings, representing the 9 cells of the Tic Tac Toe board.

```javascript
const resetBoard = () => {
  board = ["", "", "", "", "", "", "", "", ""];
  renderBoard();
};
```

The `resetBoard` function resets the board to its initial empty state and calls `renderBoard` to update the display.

```javascript
const getBoard = () => board;
```

The `getBoard` function returns the current state of the board.

```javascript
const setCell = (index, symbol) => {
  if (board[index] === "") {
    board[index] = symbol;
    return true;
  }
  return false;
};
```

The `setCell` function sets the symbol (`X` or `O`) at the specified index if the cell is empty, returning `true`. If the cell is already occupied, it returns `false`.

```javascript
const renderBoard = () => {
  const gameBoardElement = document.getElementById("game-board");
  gameBoardElement.innerHTML = "";
  board.forEach((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    cellElement.textContent = cell;
    cellElement.addEventListener("click", () => GameController.makeMove(index));
    gameBoardElement.appendChild(cellElement);
  });
};
```

The `renderBoard` function dynamically creates the game board in the HTML. It clears the existing content, then creates a `div` for each cell, sets its class to "cell", and sets its text content to the corresponding cell value (`X`, `O`, or empty). It also adds a click event listener to each cell to handle player moves.

```javascript
  return {
    resetBoard,
    getBoard,
    setCell,
    renderBoard,
  };
})();
```

This returns an object exposing the `resetBoard`, `getBoard`, `setCell`, and `renderBoard` functions, making them accessible outside the module.

### Player Factory Function

```javascript
const Player = (name, symbol) => {
  return { name, symbol };
};
```

This is a factory function that creates a `Player` object with a `name` and a `symbol` (`X` or `O`).

### GameController Module

```javascript
const GameController = (() => {
```

This defines a module called `GameController` using an IIFE.

```javascript
let players = [];
let currentPlayerIndex = 0;
let gameActive = true;
```

These variables keep track of the players, the index of the current player (0 or 1), and whether the game is active.

```javascript
const initializeGame = (player1Name, player2Name) => {
  console.log("Initializing game with players:", player1Name, player2Name);
  players = [Player(player1Name, "X"), Player(player2Name, "O")];
  currentPlayerIndex = 0;
  gameActive = true;
  Gameboard.resetBoard();
  updateStatus();
};
```

The `initializeGame` function initializes the game with two players, resets the board, and updates the status message.

```javascript
const switchPlayer = () => {
  currentPlayerIndex = (currentPlayerIndex + 1) % 2;
};
```

The `switchPlayer` function switches to the other player.

```javascript
const getCurrentPlayer = () => players[currentPlayerIndex];
```

The `getCurrentPlayer` function returns the current player.

```javascript
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
```

The `makeMove` function handles a player's move. If the game is active and the move is valid (the cell is empty), it updates the board and checks for a win or draw. If the game is won or drawn, it updates the status message accordingly. Otherwise, it switches to the other player and updates the status message.

```javascript
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
```

The `checkWin` function checks if there is a winning pattern on the board. It returns `true` if a winning pattern is found, otherwise `false`.

```javascript
const checkDraw = () => {
  return Gameboard.getBoard().every((cell) => cell !== "");
};
```

The `checkDraw` function checks if the board is full without a winner, indicating a draw. It returns `true` if all cells are occupied, otherwise `false`.

```javascript
const updateStatus = () => {
  document.getElementById("game-status").textContent = `${
    getCurrentPlayer().name
  }'s turn`;
};
```

The `updateStatus` function updates the game status message to indicate whose turn it is.

```javascript
  return {
    initializeGame,
    makeMove,
  };
})();
```

This returns an object exposing the `initializeGame` and `makeMove` functions, making them accessible outside the module.

### Event Listeners

```javascript
document.getElementById("start-button").addEventListener("click", () => {
  const player1Name = document.getElementById("player1").value || "Player 1";
  const player2Name = document.getElementById("player2").value || "Player 2";
  GameController.initializeGame(player1Name, player2Name);
  Gameboard.renderBoard(); // Ensure the board is rendered after starting the game
});
```

This adds an event listener to the "Start Game" button. When clicked, it retrieves the player names from the input fields (or uses default names if the fields are empty), initializes the game with these names, and renders the board.

```javascript
document.getElementById("reset-button").addEventListener("click", () => {
  // Clear the player names
  document.getElementById("player1").value = "";
  document.getElementById("player2").value = "";

  // Reinitialize the game with default player names
  GameController.initializeGame("Player 1", "Player 2");

  // Clear the game status
  document.getElementById("game-status").textContent = "";
});
```
