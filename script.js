function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const dropToken = (row, column, player) => {
        if (board[row][column].getValue() !== "_") return;

        board[row][column].addToken(player);
    }

    const eventListener = () => {
        const boardValues = board.map((row) => row.map((cell) => cell.getValue()));
        for (let i = 0; i < 3; i++) {
            let row = document.querySelectorAll(`[row="${i}"]`);
            for (let j = 0; j < 3; j++) {
                let cell = row[j];
                cell.addEventListener('click', function() {game.playRound(i,j)});
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

    return {
        getBoard,
        dropToken,
        printBoard,
        eventListener
    }
}

function Cell() {
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

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            token: "X"
        },
        {
            name: playerTwoName,
            token: "O"
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const initGame = () => {
        board.eventListener();
        board.printBoard();
        console.log(`${getActivePlayer().name} begins.`)
    }

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`)
    }

    const checkForWinner = () => {
        const currentBoard = board.getBoard().map((row) => row.map((cell) => cell.getValue()));
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

    const playRound = (row, column) => {
        board.dropToken(row, column, getActivePlayer().token);
        const gameStatus = checkForWinner();
        if (gameStatus === "No winner") {
            switchPlayerTurn();
            printNewRound();
        } else {
            console.log(gameStatus)
        }
    };

    initGame();

    return {
        playRound,
        getActivePlayer
    };
}

const game = GameController();