const themeToggleBtn = document.getElementById('theme-toggle');

if (themeToggleBtn) {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggleBtn.textContent = '☀️'; 
  } else {
    themeToggleBtn.textContent = '🌙'; 
  }


  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}  

const slider = document.querySelector('.team-slider');
const leftBtn = document.querySelector('.slide-btn.left');
const rightBtn = document.querySelector('.slide-btn.right');

if (slider) {
  const step = 305;
  
  rightBtn.addEventListener('click', () => {
    slider.scrollBy({ left: step, behavior: 'smooth' });
  });

  leftBtn.addEventListener('click', () => {
    slider.scrollBy({ left: -step, behavior: 'smooth' });
  });
}
