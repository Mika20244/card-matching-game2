const cards = [
    '2_of_clubs.png',
    '2_of_clubs.png',
    '3_of_diamonds.png',
    '3_of_diamonds.png',
    '4_of_spades.png',
    '4_of_spades.png',
    'ace_of_hearts.png',
    'ace_of_hearts.png',
    'queen_of_clubs2.png',
    'queen_of_clubs2.png'
];

let flippedCards = [];
let matchedCards = [];
let moves = 0;
let timer = 0;
let timerInterval;
let gameStarted = false; // Flag to track if the game has started
const cardsContainer = document.getElementById('cards-container');
const movesElement = document.getElementById('moves');
const timerElement = document.getElementById('timer');
const titleElement = document.querySelector('.game-title');
const tickElement = document.getElementById('tick');
const correctSound = new Audio('correct.mp3');

function startGame() {
    moves = 0;
    timer = 0;
    matchedCards = [];
    flippedCards = [];
    updateMoves();
    shuffleCards();
    createCards();

    // Set title color to black at the start of the game
    titleElement.style.color = 'black';
}

function shuffleCards() {
    cards.sort(() => Math.random() - 0.5);
}

function createCards() {
    cardsContainer.innerHTML = '';
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.style.backgroundImage = `url('back.png')`; // Set initial back image
        cardElement.setAttribute('data-index', index); // Store original index for comparison
        cardElement.addEventListener('click', () => flipCard(cardElement, index));
        cardElement.addEventListener('touchstart', () => flipCard(cardElement, index)); // Touch event for mobile
        cardsContainer.appendChild(cardElement);
    });
}

function flipCard(cardElement, index) {
    if (!gameStarted) {
        gameStarted = true;
        startTimer();
    }

    if (flippedCards.length < 2 && !flippedCards.includes(cardElement) && !cardElement.classList.contains('matched')) {
        flippedCards.push(cardElement);
        cardElement.classList.add('flipped');
        cardElement.style.backgroundImage = `url(${cards[index]})`; // Show card image
        moves++;

        if (flippedCards.length === 2) {
            const card1Index = parseInt(flippedCards[0].getAttribute('data-index'));
            const card2Index = parseInt(flippedCards[1].getAttribute('data-index'));

            if (cards[card1Index] === cards[card2Index]) {
                setTimeout(() => {
                    flippedCards.forEach(card => card.classList.add('matched'));
                    matchedCards.push(card1Index, card2Index);

                    if (matchedCards.length === cards.length) {
                        setTimeout(() => {
                            alert(`Congratulations! You've matched all cards in ${moves} moves. Time taken: ${timer} seconds.`);
                        }, 500);
                        clearInterval(timerInterval);
                    }

                    // Show tick image for correct match and change title color to green
                    tickElement.style.display = 'block';
                    titleElement.style.color = 'green';

                    // Play correct sound
                    correctSound.currentTime = 0; // Rewind sound to start
                    correctSound.play();

                    // Hide tick and revert title color after 1 second
                    setTimeout(() => {
                        tickElement.style.display = 'none';
                        titleElement.style.color = 'black';
                    }, 1000);

                    flippedCards = [];
                }, 500);
            } else {
                setTimeout(() => {
                    flippedCards.forEach(card => {
                        card.classList.remove('flipped');
                        card.style.backgroundImage = `url('back.png')`; // Revert to back image
                    });
                    flippedCards = [];
                }, 1000);
            }
            updateMoves();
        }
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        timerElement.textContent = timer;
    }, 1000);
}

function updateMoves() {
    movesElement.textContent = moves;
}

startGame();
