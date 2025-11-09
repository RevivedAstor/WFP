let level = 1;
let lives = 3;
let targetCount = 1;
let selectedCount = 0;
let targets = [];
let clickable = false;

const board = document.getElementById('board');
const levelDisplay = document.getElementById('levelDisplay');
const livesDisplay = document.getElementById('livesDisplay');
const startBtn = document.getElementById('startBtn');
const backBtn = document.getElementById('backBtn');
const themeBtn = document.getElementById('themeBtn');

function updateStatus() {
  levelDisplay.textContent = `Level: ${level}`;
  livesDisplay.textContent = 'Lives: ' + '❤️'.repeat(lives);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function setupBoard() {
  board.innerHTML = '';
  targetCount = level;
  const totalTiles = Math.max(targetCount * targetCount, 4);
  const gridSize = Math.sqrt(totalTiles);
  board.style.gridTemplateColumns = `repeat(${gridSize}, 70px)`;
  board.style.gridTemplateRows = `repeat(${gridSize}, 70px)`;

  for (let i = 0; i < totalTiles; i++) {
    const tile = document.createElement('div');
    tile.classList.add('card');
    tile.dataset.index = i;

    tile.innerHTML = `
      <div class="inner">
        <div class="front"></div>
        <div class="back">?</div>
      </div>
    `;

    tile.addEventListener('click', onTileClick);
    board.appendChild(tile);
  }

  targets = shuffle([...Array(totalTiles).keys()]).slice(0, targetCount);
}


function showTargetsThenHide() {
  const tiles = board.querySelectorAll('.card');
  targets.forEach(idx => tiles[idx].classList.add('flip'));
  setTimeout(() => {
    targets.forEach(idx => tiles[idx].classList.remove('flip'));
    clickable = true;
    selectedCount = 0;
  }, 1000 + level * 150);
}

function onTileClick(e) {
  if (!clickable) return;
  const tile = e.currentTarget;
  const idx = Number(tile.dataset.index);
  if (tile.classList.contains('flip')) return;

  tile.classList.add('flip');
  if (targets.includes(idx)) {
    selectedCount++;
    if (selectedCount === targetCount) {
      level++;
      clickable = false;
      updateStatus();
      setTimeout(startRound, 500);
    }
  } else {
    lives--;
    clickable = false;
    updateStatus();
    if (lives <= 0) {
      alert(`Game Over! You reached level ${level}`);
      resetGame();
    } else {
      setTimeout(startRound, 500);
    }
  }
}

function startRound() {
  updateStatus();
  setupBoard();
  setTimeout(showTargetsThenHide, 500);
}

function resetGame() {
  level = 1;
  lives = 3;
  updateStatus();
  startRound();
}

// ==========================
// Event listeners
// ==========================
startBtn.addEventListener('click', () => {
  startBtn.style.display = 'none';
  startRound();
});

backBtn.addEventListener('click', () => {
  window.location.href = 'start.html';
});

themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeBtn.textContent = document.body.classList.contains('dark') ? '🌙' : '☀️';
});

updateStatus();
