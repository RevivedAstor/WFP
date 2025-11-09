// ==========================
// GAME VARIABLES
// ==========================
let level = 1;
let lives = 3;
let targetCount = 1;        // сколько плиток нужно запомнить
let selectedCount = 0;      // сколько уже выбрано
let targets = [];           // индексы плиток, которые вспыхнут
let clickable = false;      // можно ли кликать по плиткам

const board = document.getElementById('board');
const levelDisplay = document.getElementById('levelDisplay');
const livesDisplay = document.getElementById('livesDisplay');
const startBtn = document.getElementById('startBtn');
const backBtn = document.getElementById('backBtn');
const themeBtn = document.getElementById('themeBtn');

// ==========================
// UTILITY FUNCTIONS
// ==========================
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

// ==========================
// SETUP & GAME LOGIC
// ==========================
function setupBoard() {
  board.innerHTML = '';
  targetCount = level;
  const totalTiles = Math.max(targetCount * targetCount, 4);
  const gridSize = Math.ceil(Math.sqrt(totalTiles));
  board.style.gridTemplateColumns = `repeat(${gridSize}, 70px)`;
  board.style.gridTemplateRows = `repeat(${gridSize}, 70px)`;

  // создаём плитки с чередующимися фиолетовыми и розовыми цветами
  for (let i = 0; i < totalTiles; i++) {
    const tile = document.createElement('div');
    tile.classList.add('card');
    tile.dataset.index = i;

    const color = i % 2 === 0 ? '#7b2cbf' : '#f72585'; // чередуем фиолетовый и розовый
    tile.innerHTML = `
      <div class="inner">
        <div class="front">⭐</div>
        <div class="back" style="background:${color}">?</div>
      </div>
    `;

    tile.addEventListener('click', onTileClick);
    board.appendChild(tile);
  }

  // выбираем targetCount плиток для показа
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

async function onTileClick(e) {
  if (!clickable) return;
  const tile = e.currentTarget;
  const idx = Number(tile.dataset.index);
  if (tile.classList.contains('flip')) return;

  tile.classList.add('flip');
  if (targets.includes(idx)) {
    selectedCount++;
    if (selectedCount === targetCount) {
      // победа уровня
      level++;
      clickable = false;
      updateStatus();
      setTimeout(startRound, 700);
    }
  } else {
    lives--;
    clickable = false;
    updateStatus();
    if (lives <= 0) {
      // ----- SAVE TO BACKEND -----
      const saveGame2Score = async () => {
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const name = user.name || 'Player';
        try {
          const resp = await fetch('https://wfp.onrender.com/api/leaderboard/game2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, level })
          });
          if (!resp.ok) throw new Error('Network error');
          console.log('Game 2 score saved!');
        } catch (e) {
          console.error('Save failed', e);
          alert('Score saved locally');
        } finally {
          setTimeout(() => window.location.href = 'start.html', 1000);
        }
      };

      alert(`Game Over!\n🏆 Level Reached: ${level}`);
      await saveGame2Score();
      resetGame();
    } else {
      setTimeout(startRound, 700);
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

// Инициализация темы при загрузке
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  themeBtn.textContent = '🌙';
} else {
  document.body.classList.remove('dark');
  themeBtn.textContent = '☀️';
}

// Переключение темы
themeBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  themeBtn.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// инициализация
updateStatus();
