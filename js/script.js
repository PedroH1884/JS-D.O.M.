document.addEventListener('DOMContentLoaded', () => {

    const menu = document.querySelector('.menu');
    const gameScreen = document.getElementById('game');
    const gameOverScreen = document.getElementById('game-over-screen');
    const startButton = document.getElementById('iniciar');
    const nameInput = document.getElementById('nome');
    const scoreDisplay = document.getElementById('score');
    const timeDisplay = document.getElementById('time');
    const colorNameDisplay = document.getElementById('color-name');
    const cells = document.querySelectorAll('.cell');
    const finalScoreDisplay = document.getElementById('final-score');
    const playAgainButton = document.getElementById('play-again-button');
    const viewRankButton = document.getElementById('view-rank-button');
    const rankModal = document.getElementById('janela1');
    const howToPlayModal = document.getElementById('janela2');
    const rankButton = document.getElementById('rank');
    const howToPlayButton = document.getElementById('comojogar');
    const closeButtons = document.querySelectorAll('.fechar');
    const rankingList = document.getElementById('ranking-list');

    let score = 0, timeLeft = 5, initialTime = 5;
    let timerInterval, currentColor = '', userName = '';

    function saveScore(name, score) {
        const rankings = JSON.parse(localStorage.getItem('colorGameRankings')) || [];
        rankings.push({ name, score });
        rankings.sort((a, b) => b.score - a.score);
        const top10 = rankings.slice(0, 10);
        localStorage.setItem('colorGameRankings', JSON.stringify(top10));
    }

    function updateRankingDisplay() {
        const rankings = JSON.parse(localStorage.getItem('colorGameRankings')) || [];
        rankingList.innerHTML = '';
        if (rankings.length === 0) {
            rankingList.innerHTML = '<li>Ninguém jogou ainda. Seja o primeiro!</li>';
            return;
        }
        rankings.forEach((player, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${player.name} - ${player.score} pontos`;
            rankingList.appendChild(li);
        });
    }

    function iniciarJogo() {
        menu.style.display = 'none';
        gameOverScreen.style.display = 'none';
        gameScreen.style.display = 'flex';

        score = 0;
        initialTime = 5;
        
        startNewRound();
    }

    rankButton.addEventListener('click', () => {
        updateRankingDisplay();
        rankModal.style.display = 'flex';
    });

    howToPlayButton.addEventListener('click', () => { howToPlayModal.style.display = 'flex'; });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            rankModal.style.display = 'none';
            howToPlayModal.style.display = 'none';
        });
    });

    playAgainButton.addEventListener('click', () => {
        iniciarJogo();
    });

    viewRankButton.addEventListener('click', () => {
        gameOverScreen.style.display = 'none';
        updateRankingDisplay();
        rankModal.style.display = 'flex';
    });
    
    startButton.addEventListener('click', () => {
        userName = nameInput.value;
        if (!userName) { alert("Por favor, insira seu nome para começar!"); return; }
        
        iniciarJogo();
    });

    cells.forEach(cell => { cell.addEventListener('click', checkColor); });
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function startNewRound() {
        clearInterval(timerInterval);
        timeLeft = initialTime;
        updateDisplay();
        let colors = ["red", "green", "blue", "yellow", "orange", "purple", "pink", "brown", "gray"];
        const colorNames = {
            red: "VERMELHO", green: "VERDE", blue: "AZUL", yellow: "AMARELO",
            orange: "LARANJA", purple: "ROXO", pink: "ROSA", brown: "MARROM", gray: "CINZA"
        };
        shuffleArray(colors);
        cells.forEach((cell, index) => {
            const color = colors[index];
            cell.setAttribute('data-color', color);
            cell.style.backgroundColor = color;
        });
        currentColor = colors[Math.floor(Math.random() * colors.length)];
        colorNameDisplay.textContent = colorNames[currentColor];
        timerInterval = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft <= 0) { endGame(); }
        }, 1000);
    }

    function checkColor(event) {
        if (timeLeft <= 0) return;
        const selectedColor = event.target.getAttribute('data-color');
        if (selectedColor === currentColor) {
            score++;
            if (score > 0 && score % 5 === 0) { initialTime = Math.max(2, initialTime - 1); }
        } else {
            score = Math.max(0, score - 1);
        }
        startNewRound();
    }

    function updateDisplay() {
        scoreDisplay.textContent = `Pontuação: ${score}`;
        timeDisplay.textContent = `Tempo: ${timeLeft}s`;
    }

    function endGame() {
        clearInterval(timerInterval);
        saveScore(userName, score);
        finalScoreDisplay.textContent = score;
        
        gameScreen.style.display = 'none';
        gameOverScreen.style.display = 'flex';
    }

    updateRankingDisplay();

});