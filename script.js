const Player = (name, token) => {
    const getName = () => name;
    const getToken = () => token;
    return {getName, getToken};
}

const Cell = () => {
    let value = "_";

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addToken,
        getValue
    };
}

const gameBoard = (() => {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board.map((row) => row.map((cell) => cell.getValue()));

    const initBoard = () => {
        const boardValues = board.map((row) => row.map((cell) => cell.getValue()));
        for (let i = 0; i < 3; i++) {
            let row = document.querySelectorAll(`[row="${i}"]`);
            for (let j = 0; j < 3; j++) {
                let cell = row[j];
                cell.addEventListener('click', () => {gameController.playRound(i,j)});
                cell.innerHTML = boardValues[i][j];
            }
        }
    }

    const printBoard = () => {
        const boardValues = board.map((row) => row.map((cell) => cell.getValue()));
        for (let i = 0; i < 3; i++) {
            let row = document.querySelectorAll(`[row="${i}"]`);
            for (let j = 0; j < 3; j++) {
                let cell = row[j];
                cell.innerHTML = boardValues[i][j];
            }
        }
    }

    const dropToken = (row, column, player) => {
        if (board[row][column].getValue() !== "_") return;

        board[row][column].addToken(player);
        printBoard();
    }

    return {
        dropToken,
        printBoard,
        initBoard,
        getBoard
    };
})();

const gameController = (() => {

    const playerOne = Player(prompt("Player 1, enter your name: ", "Player 1"), "X");
    const playerTwo = Player(prompt("Player 2, enter your name: ", "Player 2"), "O");
    const players = [
        {
            name: playerOne.getName(),
            token: playerOne.getToken()
        },
        {
            name: playerTwo.getName(),
            token: playerTwo.getToken()
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const playRound = (row, column) => {
        gameBoard.dropToken(row, column, getActivePlayer().token);
        let winner = checkForWinner();
        const div = document.querySelector('#text-input');
        if (winner !== "No winner") {
        div.textContent = winner;
        } else {
        switchPlayerTurn();
        div.textContent = `${getActivePlayer().name}'s turn.`;
        }
    }

    const checkForWinner = () => {
        const currentBoard = gameBoard.getBoard();
        let gameContinues = false;
        for (let i = 0; i < 3; i++) {
            if (currentBoard[i].includes("_")) {
                gameContinues = true;
            } else if (currentBoard[i][0] === currentBoard[i][1] && currentBoard[i][0] === currentBoard[i][2]) return currentBoard[i][0];
        };
        for (let j = 0; j < 3; j++) {
            if (!currentBoard[0][j].includes("_") && currentBoard[0][j] === currentBoard[1][j] && currentBoard[0][j] === currentBoard[2][j]) return currentBoard[0][j];
        };
        if (currentBoard[0][0] !== "_" && currentBoard[0][0] === currentBoard[1][1] && currentBoard[0][0] === currentBoard[2][2]) return currentBoard[0][0];
        if (currentBoard[0][2] !== "_" && currentBoard[0][2] === currentBoard[1][1] && currentBoard[0][2] === currentBoard[2][0]) return currentBoard[0][2];
        if (gameContinues) return "No winner";
        return "Draw";
    }

    return {
        playRound,
        getActivePlayer
    }
})();


gameBoard.initBoard()

