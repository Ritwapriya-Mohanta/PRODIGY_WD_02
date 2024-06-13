let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let scoreX = 0;
let scoreO = 0;
const isSinglePlayer = false; // Set to true if you want single-player mode against AI

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const message = document.getElementById('message');
const clickSound = new Audio('click.mp3');
const winSound = new Audio('win.mp3');
const drawSound = new Audio('draw.mp3');

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);

function handleCellClick(event) {
    const cell = event.target;
    const cellIndex = parseInt(cell.getAttribute('data-index'));

    if (board[cellIndex] !== '' || !isGameActive) {
        return;
    }

    makeMove(cellIndex, currentPlayer);

    if (!isGameActive) return;

    if (isSinglePlayer) {
        setTimeout(() => {
            const aiMove = getBestMove();
            makeMove(aiMove, 'O');
        }, 500);
    }
}

function makeMove(index, player) {
    board[index] = player;
    const cell = document.querySelector(`.cell[data-index='${index}']`);
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
    clickSound.play();

    if (checkWin()) {
        message.textContent = `Player ${player} wins!`;
        winSound.play();
        updateScore(player);
        isGameActive = false;
    } else if (!board.includes('')) {
        message.textContent = 'Game is a draw!';
        drawSound.play();
        isGameActive = false;
    } else {
        currentPlayer = player === 'X' ? 'O' : 'X';
    }
}

function checkWin() {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            highlightWinningCells([a, b, c]);
            return true;
        }
    }
    return false;
}

function highlightWinningCells(cells) {
    cells.forEach(index => {
        document.querySelector(`.cell[data-index='${index}']`).classList.add('highlight');
    });
}

function getBestMove() {
    const emptyCells = board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
}

function updateScore(player) {
    if (player === 'X') {
        scoreX += 1;
        document.getElementById('scoreX').textContent = scoreX;
    } else {
        scoreO += 1;
        document.getElementById('scoreO').textContent = scoreO;
    }
}

function resetGame() {
    board.fill('');
    isGameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell';
    });
    message.textContent = '';
}
