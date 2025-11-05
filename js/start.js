

// buttons
document.getElementById('selectGameBtn')?.addEventListener('click', () => {
	localStorage.setItem('mode', 'new');
	window.location.href = 'game.html';
});

document.getElementById('continueBtn')?.addEventListener('click', () => {
	localStorage.setItem('mode', 'continue');
	window.location.href = 'game.html';
});



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
			apply: 'Apply'
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
			apply: 'Применить'
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
			apply: 'Қолдану'
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