// toggle logic (the cool shift thingamabob)
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});


// signup logic is here
const signUpForm = document.getElementById('signup-form');

signUpForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim().toLowerCase();
  const pass = document.getElementById('signup-pass').value;
  const confirmPass = document.getElementById('signup-confirm-pass').value;

  if (!name || !email || !pass || !confirmPass) {
    alert('Please fill in all fields');
    return;
  }

  if (pass !== confirmPass) {
    alert('Passwords do not match!');
    return;
  }

  try {
    const response = await fetch('https://wfp.onrender.com/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: name, email, password: pass })
    });

    const data = await response.json();

    if (!response.ok) {
      const data = await response.json();
      alert(data.error || 'Registration failed');
      return;
    }

    
    console.log('Registered:', data);
    localStorage.setItem('currentUser', JSON.stringify({ name: data.username }));
    window.location.href = 'start.html';
  } catch (err) {
    console.error(err);
    alert('Server unavailable.');
  }
});



const signInForm = document.getElementById('signin-form');

signInForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('signin-email').value.trim().toLowerCase();
  const pass = document.getElementById('signin-pass').value;

  if (!email || !pass) {
    alert('Please enter email and password');
    return;
  }

  try {
    const response = await fetch('https://wfp.onrender.com/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });

    const data = await response.json();
    

    if (!response.ok) {
      alert(data.error || 'Login failed');
      return;
    }

    // save minimal session info client-side
    // for some reason, even if I change the flow of the data from login route, it still comes as {'Login successful', user: {...}}
    // so I just adjusted to that instead of trying to fix it backend-side for now
    localStorage.setItem('currentUser', JSON.stringify({ name: data.user.username }));
    window.location.href = 'start.html';
  } catch (err) {
    console.error(err);
    alert('Server unavailable.');
  }
});

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