

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

    const askForNames = () => {
        const main = document.querySelector('main');
        const div = document.createElement('div');
        main.insertBefore(div, main.children[0]);

        const form = document.createElement('form');
        div.appendChild(form);

        const input1 = document.createElement('input');
        input1.type = 'text';
        input1.id = 'playerOne';
        input1.placeholder = 'Player 1';
        form.appendChild(input1);

        const input2 = document.createElement('input');
        input2.type = 'text';
        input2.id = 'playerTwo';
        input2.placeholder = 'Player 2';
        form.appendChild(input2);

        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Create Players';
        form.appendChild(submitButton);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const playerOne = document.getElementById('playerOne');
            const playerTwo = document.getElementById('playerTwo');
            game.players[0]['name'] = playerOne;
            game.players[1]['name'] = playerTwo;
            main.removeChild(main.firstElementChild);
        })
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
        const main = document.querySelector('main');
        const div = document.createElement('div');
        main.appendChild(div);

        const playerOne = document.createElement('div');
        playerOne.id = 'playerOneDiv';
        div.appendChild(playerOne);

        const playerTwo = document.createElement('div');
        playerOne.id = 'playerTwoDiv';
        div.appendChild(playerTwo);

        const playerOneToken = document.createElement('p');
        playerOneToken.id = 'playerOneToken';
        playerOneToken.textContent = 'X';
        playerOne.appendChild(playerOneToken);

        const playerOneName = document.createElement('p');
        playerOneName.id = 'playerOneName';
        // playerOneName.textContent = game.players[0]['name'];
        playerOneName.textContent = 'Player One';
        playerOne.appendChild(playerOneName);

        const playerOneScore = document.createElement('p');
        playerOneScore.id = 'playerOneScore';
        playerOneScore.textContent = 0;
        playerOne.appendChild(playerOneScore);

        const playerTwoToken = document.createElement('p');
        playerTwoToken.id = 'playerTwoToken';
        playerTwoToken.textContent = 'O';
        playerTwo.appendChild(playerTwoToken);

        const playerTwoName = document.createElement('p');
        playerTwoName.id = 'playerTwoName';
        // playerTwoName.textContent = game.players[1]['name'];
        playerTwoName.textContent = 'Player Two';
        playerTwo.appendChild(playerTwoName);
        
        const playerTwoScore = document.createElement('p');
        playerTwoScore.id = 'playerTwoScore';
        playerTwoScore.textContent = 0;
        playerTwo.appendChild(playerTwoScore);
    }

    return {
        getBoard,
        dropToken,
        printBoard,
        eventListener,
        askForNames
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
        board.askForNames();
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