const user = localStorage.getItem("user");
const mode = localStorage.getItem("mode");
console.log("Logged in as:", user, "Mode:", mode);

const gameBoard = document.getElementById("gameBoard");
const difficultySelect = document.getElementById("difficulty");
const restartBtn = document.getElementById("restart");
const movesEl = document.getElementById("moves");
const timeEl = document.getElementById("time");
const themeToggle = document.getElementById("themeToggle");

const emojis = ["🍎", "🍋", "🍇", "🍉", "🥝", "🍒", "🍍", "🍓", "🥑", "🍊", "🍌", "🥥"];
const gridSizes = { easy: [3, 4], medium: [4, 4], hard: [6, 4] };

let firstCard = null, lockBoard = false;
let moves = 0, timer = 0, interval;
let matched = 0;

// simple sounds
const flipSound = new Audio("https://cdn.jsdelivr.net/gh/diar-ai/audio/flip.mp3");
const matchSound = new Audio("https://cdn.jsdelivr.net/gh/diar-ai/audio/match.mp3");
const winSound = new Audio("https://cdn.jsdelivr.net/gh/diar-ai/audio/win.mp3");

function startGame() {
  clearInterval(interval);
  firstCard = null;
  lockBoard = false;
  moves = 0; timer = 0; matched = 0;
  movesEl.textContent = 0;
  timeEl.textContent = 0;

  const [rows, cols] = gridSizes[difficultySelect.value];
  gameBoard.style.gridTemplateColumns = `repeat(${cols},1fr)`;

  const totalCards = rows * cols;
  const selected = emojis.slice(0, totalCards / 2);
  const cardValues = [...selected, ...selected].sort(() => Math.random() - 0.5);

  gameBoard.innerHTML = "";
  cardValues.forEach(val => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="inner">
        <div class="front">${val}</div>
        <div class="back">?</div>
      </div>`;
    card.onclick = () => flipCard(card, val);
    gameBoard.appendChild(card);
  });

  interval = setInterval(() => {
    timer++;
    timeEl.textContent = timer;
  }, 1000);
}

function flipCard(card, val) {
  if (lockBoard || card.classList.contains("flip")) return;

  card.classList.add("flip");
  flipSound.currentTime = 0;
  flipSound.play();

  if (!firstCard) {
    firstCard = card;
    return;
  }

  moves++;
  movesEl.textContent = moves;

  const firstVal = firstCard.querySelector(".front").textContent;

  if (firstVal === val) {
    matchSound.play();
    matched += 2;

    firstCard.classList.add("matched");
    card.classList.add("matched");
    firstCard = null;

    if (matched === gameBoard.children.length) {
      clearInterval(interval);
      winSound.play();

      setTimeout(() => {
        alert(`🎉 Победа!
⏱ Время: ${timer}s
🎯 Ходы: ${moves}`);
        startGame();
      }, 400);
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flip");
      card.classList.remove("flip");
      firstCard = null;
      lockBoard = false;
    }, 700);
  }
}

restartBtn.onclick = startGame;

difficultySelect.onchange = () => {
  startGame();
};

themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
};

const backBtn = document.getElementById("backBtn");

backBtn.onclick = () => {
  window.location.href = "start.html"; 
};


startGame();
