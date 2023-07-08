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

    const printBoard = () => {
        const boardValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardValues[0][0] === "_");
        const boardDiv = document.getElementById('board');
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
        printBoard
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

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`)
    }

    const checkForWinner = () => {
        for (let i = 0; i < 3; i++) {
            if (board[i][0].getValue() === board[i][1].getValue() === board[i][2].getValue()) return board[i][0];
        };
        for (let j = 0; j < 3; j++) {
            if (board[0][j] === board[1][j] === board[2][j]) return board[0][j];
        };
        if (board[0][0] === board[1][1] === board[2][2]) return board[0][0];
        if (board[0][2] === board[1][1] === board[2][0]) return board[0][2];
        return "No winner";
    }

    const playRound = (row, column) => {
        board.dropToken(row, column, getActivePlayer().token);
        // console.log(checkForWinner());

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer
    };
}

const game = GameController();