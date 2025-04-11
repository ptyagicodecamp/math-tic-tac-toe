document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const restartButton = document.getElementById('restartButton');
    const moveCountElement = document.getElementById('moveCount');
    const scoresContainer = document.getElementById('scoresContainer');
    
    let currentPlayer = 1; // Player 1 is X, Player 2 is O
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let problems = [];
    let answers = [];
    let moveCount = 0;

    // API endpoints
    const API_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:3000/api'
        : '/api';

    // Fetch and display scores
    async function fetchScores() {
        try {
            const response = await fetch(`${API_URL}/scores`);
            const data = await response.json();
            displayScores(data.scores);
        } catch (error) {
            console.error('Error fetching scores:', error);
        }
    }

    // Display scores in the scoreboard
    function displayScores(scores) {
        scoresContainer.innerHTML = scores
            .sort((a, b) => b.id - a.id)
            .slice(0, 10)
            .map(score => `
                <div class="score-item">
                    <span>Player ${score.winner}</span>
                    <span>${score.moves} moves</span>
                    <span>${new Date(score.date).toLocaleDateString()}</span>
                </div>
            `)
            .join('');
    }

    // Save score to backend
    async function saveScore(winner) {
        try {
            await fetch(`${API_URL}/scores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    winner,
                    moves: moveCount,
                    date: new Date().toISOString()
                })
            });
            fetchScores();
        } catch (error) {
            console.error('Error saving score:', error);
        }
    }

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    function generateProblem() {
        const operations = ['+', '-', '*'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let num1, num2, answer;

        switch(operation) {
            case '+':
                num1 = Math.floor(Math.random() * 20) + 1;
                num2 = Math.floor(Math.random() * 20) + 1;
                answer = num1 + num2;
                break;
            case '-':
                num1 = Math.floor(Math.random() * 20) + 1;
                num2 = Math.floor(Math.random() * num1) + 1;
                answer = num1 - num2;
                break;
            case '*':
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                answer = num1 * num2;
                break;
        }

        return {
            problem: `${num1} ${operation} ${num2} = ?`,
            answer: answer
        };
    }

    function handleSubmit(e) {
        const cell = e.target.closest('.cell');
        const cellIndex = parseInt(cell.getAttribute('data-cell-index'));
        const input = cell.querySelector('.math-input');
        const userAnswer = parseInt(input.value);

        if (userAnswer === answers[cellIndex]) {
            gameState[cellIndex] = currentPlayer;
            cell.classList.add('marked');
            cell.setAttribute('data-mark', currentPlayer);
            cell.innerHTML = '';
            
            // Add spring animation
            cell.style.animation = 'none';
            cell.offsetHeight; // Trigger reflow
            cell.style.animation = 'sway 1s ease-out';

            moveCount++;
            moveCountElement.textContent = moveCount;
            checkWin();
        } else {
            input.value = '';
            input.style.borderColor = 'red';
            setTimeout(() => {
                input.style.borderColor = '#ccc';
            }, 1000);
        }
    }

    function checkWin() {
        let roundWon = false;

        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (
                gameState[a] !== '' &&
                gameState[a] === gameState[b] &&
                gameState[a] === gameState[c]
            ) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            status.textContent = `Player ${currentPlayer} (${currentPlayer === 1 ? 'X' : 'O'}) Wins!`;
            gameActive = false;
            disableAllCells();
            saveScore(currentPlayer);
            return;
        }

        if (!gameState.includes('')) {
            status.textContent = 'Game Draw!';
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 1 ? 2 : 1;
        status.textContent = `Player ${currentPlayer}'s Turn (${currentPlayer === 1 ? 'X' : 'O'})`;
        disableAllCells();
        setTimeout(enableAllUnmarkedCells, 300);
    }

    function disableAllCells() {
        cells.forEach(cell => {
            if (!cell.classList.contains('marked')) {
                const input = cell.querySelector('.math-input');
                const submitBtn = cell.querySelector('.submit-btn');
                input.disabled = true;
                submitBtn.disabled = true;
            }
        });
    }

    function enableAllUnmarkedCells() {
        cells.forEach(cell => {
            if (!cell.classList.contains('marked')) {
                const input = cell.querySelector('.math-input');
                const submitBtn = cell.querySelector('.submit-btn');
                input.disabled = false;
                submitBtn.disabled = false;
            }
        });
    }

    function initializeGame() {
        cells.forEach((cell, index) => {
            const problemDiv = cell.querySelector('.problem');
            const input = cell.querySelector('.math-input');
            const submitBtn = cell.querySelector('.submit-btn');

            const { problem, answer } = generateProblem();
            problems[index] = problem;
            answers[index] = answer;

            problemDiv.textContent = problem;
            input.value = '';

            // Remove previous event listeners
            const newSubmitBtn = submitBtn.cloneNode(true);
            submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
            const newInput = input.cloneNode(true);
            input.parentNode.replaceChild(newInput, input);

            // Add new event listeners
            newSubmitBtn.addEventListener('click', handleSubmit);
            newInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    handleSubmit(e);
                }
            });
        });
        
        // Enable cells for first player only
        disableAllCells();
        setTimeout(enableAllUnmarkedCells, 300);
    }

    function restartGame() {
        currentPlayer = 1;
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        problems = [];
        answers = [];
        moveCount = 0;
        moveCountElement.textContent = '0';
        status.textContent = "Player 1's Turn (X)";
        
        cells.forEach(cell => {
            cell.classList.remove('marked');
            cell.removeAttribute('data-mark');
        });

        initializeGame();
    }

    restartButton.addEventListener('click', restartGame);
    initializeGame();
    fetchScores(); // Load initial scores
});
