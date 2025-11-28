const Gameboard = (function() {
    const board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const setCell = (index, mark) => {
        if (board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };

    const reset = () => {
        for (let i = 0; i < board.length; i++) board[i] = "";
    };

    return { getBoard, setCell, reset };
})();


const Player = (name, mark) => ({ name, mark });

const gameController = (function() {

    const playerX = Player("Player 1", "X");
    const playerO = Player("Player 2", "O");

    let currentPlayer = playerX;
    let gameOver = false;

    const getCurrentPlayer = () => currentPlayer;
    const isGameOver = () => gameOver;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === playerX ? playerO : playerX;
    };

    const playRound = (index) => {

        if (gameOver) return; 

        const success = Gameboard.setCell(index, currentPlayer.mark);
        if (!success) return;

        const winner = checkWinner();

        if (winner) {
            gameOver = true;
            return winner;
        }

        switchPlayer();
        return null;
    };

    const checkWinner = () => {
        const board = Gameboard.getBoard();
        const winPatterns = [
            [0,1,2], [3,4,5], [6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6]
        ];

        for (let [a,b,c] of winPatterns) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a]; // "X" ili "O"
            }
        }

        if (!board.includes("")) return "tie";

        return null;
    };

    const reset = () => {
        Gameboard.reset();
        gameOver = false;
        currentPlayer = playerX;
    };

    return { playRound, getCurrentPlayer, checkWinner, reset, isGameOver };
})();



const displayController = (function() {

    const cells = document.querySelectorAll(".cell");
    const statusText = document.querySelector("#status");
    const resetBtn = document.querySelector("#reset");

    const render = () => {
    const board = Gameboard.getBoard();
    cells.forEach((cell, index) => {
      cell.textContent = board[index];        
      cell.classList.remove("X","O");        

    if (board[index] === "X") cell.classList.add("X");  
    if (board[index] === "O") cell.classList.add("O");  
  });
};


    const updateStatus = (text) => {
        statusText.textContent = text;
    };

    cells.forEach(cell => {
        cell.addEventListener("click", () => {
            const index = cell.dataset.index;

            const playerBefore = gameController.getCurrentPlayer();

            const winner = gameController.playRound(index);

            render();

            if (winner === "tie") {
                updateStatus("It's a tie!");
            } else if (winner === "X" || winner === "O") {
                updateStatus(`${playerBefore.name} wins!`);
            } else {
                updateStatus(`It's ${gameController.getCurrentPlayer().name}'s turn`);
            }
        });
    });

    resetBtn.addEventListener("click", () => {
        gameController.reset();
        render();
        updateStatus("Player 1's turn");
    });

    render();
    updateStatus("Player 1's turn");

})();
