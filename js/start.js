// buttons
document.getElementById('selectGameBtn')?.addEventListener('click', () => {
	document.getElementById('gameChoices').classList.remove('hidden');
	document.getElementById('selectGameBtn').classList.add('hidden');
});

document.getElementById('playGame1Btn')?.addEventListener('click', () => {
	localStorage.setItem('selectedGame', 'game1');
	window.location.href = 'game.html';
});

document.getElementById('playGame2Btn')?.addEventListener('click', () => {
	localStorage.setItem('selectedGame', 'game2');
	window.location.href = 'game2.html';
});


// Leaderboard API functions
async function fetchLeaderboard(filter = 'all') {
	try {
		let url = 'https://wfp.onrender.com/api/leaderboard';
		if (filter === 'game2') {
			url += '/game2';
		} else if (filter !== 'all') {
			url += `?difficulty=${filter}`;
		}

		const response = await fetch(url);
		if (!response.ok) throw new Error('Failed to fetch');
		return await response.json();
	} catch (error) {
		console.error('Error fetching leaderboard:', error);
		return [];
	}
}

async function saveGameResult(username, difficulty, time) {
	try {
		const response = await fetch('https://wfp.onrender.com/api/leaderboard', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				username,
				difficulty,
				time
			})
		});

		if (!response.ok) {
			throw new Error('Failed to save game result');
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error saving game result:', error);
		return null;
	}
}

function formatTime(seconds) {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

function renderLeaderboard(data, filter = 'all') {
	const leaderboardList = document.getElementById('leaderboardList');

	if (!data || data.length === 0) {
		leaderboardList.innerHTML = '<div class="empty-leaderboard">No records yet. Be the first!</div>';
		return;
	}

	let html = '';
	data.forEach((entry, index) => {
		const rank = index + 1;
		let rankClass = 'leaderboard-rank';
		if (rank === 1) rankClass += ' gold';
		else if (rank === 2) rankClass += ' silver';
		else if (rank === 3) rankClass += ' bronze';
		const medal = rank === 1 ? 'First' : rank === 2 ? 'Second' : rank === 3 ? 'Third' : rank;

		if (filter === 'game2') {
			// Game 2: Show Level
			html += `
        <div class="leaderboard-item">
          <div class="${rankClass}">${medal}</div>
          <div class="leaderboard-info">
            <div class="leaderboard-name">${entry.username || 'Anonymous'}</div>
            <div class="leaderboard-details">Advanced • ${new Date(entry.date).toLocaleDateString()}</div>
          </div>
          <div class="leaderboard-time">Level ${entry.level}</div>
        </div>
      `;
		} else {
			// Game 1: Show Time
			html += `
        <div class="leaderboard-item">
          <div class="${rankClass}">${medal}</div>
          <div class="leaderboard-info">
            <div class="leaderboard-name">${entry.username || 'Anonymous'}</div>
            <div class="leaderboard-details">${entry.difficulty || 'Unknown'} • ${new Date(entry.date).toLocaleDateString()}</div>
          </div>
          <div class="leaderboard-time">${formatTime(entry.time)}</div>
        </div>
      `;
		}
	});

	leaderboardList.innerHTML = html;
}

async function loadLeaderboard(filter = 'all') {
	const leaderboardList = document.getElementById('leaderboardList');
	leaderboardList.innerHTML = '<div class="loading-spinner">Loading...</div>';

	const data = await fetchLeaderboard(filter);
	renderLeaderboard(data, filter);
}

// Expose function globally so game.html can call it
window.saveGameResult = saveGameResult;
window.loadLeaderboard = loadLeaderboard;

$(document).ready(function () {

	const translations = {
		English: {
			welcome: 'Welcome to Memory Game',
			description: 'Train your brain and test your memory skills!',
			play: 'Play',
			settings: 'Settings',
			footer: '© 2025 Memory Game | All rights reserved.',
			playTitle: 'Play',
			selectGame: 'Select Game',
			continue: 'Continue',
			close: 'Close',
			settingsTitle: 'Settings',
			language: '🌍 Language:',
			gridSize: '📏 Grid Size:',
			apply: 'Apply',
			leaderboard: '🏆 Leaderboard',
			allDifficulties: 'All Difficulties',
			loading: 'Loading...',
			noRecords: 'No records yet. Be the first!'
		},
		Русский: {
			welcome: 'Добро пожаловать в Memory Game',
			description: 'Тренируйте мозг и проверьте свою память!',
			play: 'Играть',
			settings: 'Настройки',
			footer: '© 2025 Memory Game | Все права защищены.',
			playTitle: 'Играть',
			selectGame: 'Выбрать игру',
			continue: 'Продолжить',
			close: 'Закрыть',
			settingsTitle: 'Настройки',
			language: '🌍 Язык:',
			gridSize: '📏 Размер сетки:',
			apply: 'Применить',
			leaderboard: '🏆 Таблица лидеров',
			allDifficulties: 'Все сложности',
			loading: 'Загрузка...',
			noRecords: 'Пока нет записей. Будьте первым!'
		},
		Қазақша: {
			welcome: 'Memory Gameге қош келдіңіз',
			description: 'Миыңызды жаттықтырыңыз және жад қабілетіңізді тексеріңіз!',
			play: 'Ойнау',
			settings: 'Баптаулар',
			footer: '© 2025 Memory Game | Барлық құқықтар қорғалған.',
			playTitle: 'Ойнау',
			selectGame: 'Ойынды таңдау',
			continue: 'Жалғастыру',
			close: 'Жабу',
			settingsTitle: 'Баптаулар',
			language: '🌍 Тіл:',
			gridSize: '📏 Тор өлшемі:',
			apply: 'Қолдану',
			leaderboard: '🏆 Көшбасшылар тақтасы',
			allDifficulties: 'Барлық қиындықтар',
			loading: 'Жүктелуде...',
			noRecords: 'Әзірге жазба жоқ. Бірінші болыңыз!'
		}
	};

	function changeLanguage(lang) {
		const t = translations[lang];

		const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
		const name = user.name || 'Player';

		$('.content h2').text(t.welcome + `, ${name}!`);

		$('.content p').text(t.description);
		$('#playBtn').text(t.play);
		$('#settingsBtn').text(t.settings);
		$('footer').text(t.footer);

		$('#playModal h2').text(t.playTitle);
		$('#selectGameBtn').text(t.selectGame);
		$('#continueBtn').text(t.continue);
		$('#playModal .close-modal-btn').text(t.close);

		$('#settingsModal h2').text(t.settingsTitle);
		$('.setting label').eq(0).text(t.language);
		$('.setting label').eq(1).text(t.gridSize);
		$('#applyBtn').text(t.apply);
		$('#settingsModal .close-modal-btn').text(t.close);

		$('.leaderboard h2').text(t.leaderboard);
		$('#difficultyFilter option[value="all"]').text(t.allDifficulties);

		localStorage.setItem('language', lang);
	}

	$('#playBtn').on('click', function () {
		$('#playModal').removeClass('hidden');
	});

	$('#settingsBtn').on('click', function () {
		$('#settingsModal').removeClass('hidden');
	});

	$('.close-modal-btn').on('click', function () {
		$('#playModal').addClass('hidden');
		$('#settingsModal').addClass('hidden');
	});

	$('.modal').on('click', function (e) {
		if ($(e.target).hasClass('modal')) {
			$(this).addClass('hidden');
		}
	});

	$('#selectGameBtn').on('click', function () {
		console.log('Select Game clicked');
	});

	$('#continueBtn').on('click', function () {
		console.log('Continue clicked');
	});

	$('#applyBtn').on('click', function () {
		const selectedLang = $('#langSelect').val();
		if (selectedLang && translations[selectedLang]) {
			changeLanguage(selectedLang);
			$('#settingsModal').addClass('hidden');
		}
	});

	$('#themeBtn').on('click', function () {
		const darkMode = $('body').toggleClass('dark-theme').hasClass('dark-theme');
		$(this).text(darkMode ? '🌙' : '☀️');
		localStorage.setItem('theme', darkMode ? 'dark' : 'light');
	});

	const savedTheme = localStorage.getItem('theme');
	if (savedTheme === 'dark') {
		$('body').addClass('dark-theme');
		$('#themeBtn').text('🌙');
	} else {
		$('#themeBtn').text('☀️');
	}

	let savedLang = localStorage.getItem('language');

	if (!savedLang || !translations[savedLang]) {
		savedLang = 'English';
		localStorage.setItem('language', 'English');
	}

	$('#langSelect').val(savedLang);
	changeLanguage(savedLang);

	// Leaderboard filter
	$('#difficultyFilter').on('change', function () {
		const difficulty = $(this).val();
		loadLeaderboard(difficulty);
	});

	// Initial leaderboard load
	loadLeaderboard('all');

	$('#difficultyFilter').on('change', function () {
		const filter = $(this).val();
		loadLeaderboard(filter);
	});

	$(document).on('keydown', function (e) {
		if (e.key === 'Escape') {
			$('.modal').addClass('hidden');
		}
	});

	$('button').on('mouseenter', function () {
		$(this).css('transform', 'scale(1.05)');
	}).on('mouseleave', function () {
		$(this).css('transform', 'scale(1)');
	});

});