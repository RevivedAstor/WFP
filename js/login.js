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
  e.preventDefault(); // stops page from refreshing
  
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim().toLowerCase();
  const pass = document.getElementById('signup-pass').value;

  if (!name || !email || !pass) {
    alert('Please fill in all fields');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: name, email, password: pass })
    });

    const data = await response.json()

    if (response.ok) {
      // store current user in localStorage so the rest of the site still works
      localStorage.setItem('currentUser', JSON.stringify({ name: data.username}));
      window.location.href = 'start.html';
    } else {
      alert(data.error || 'Registration failed');
    }
  } catch (err) {
    console.error('Error', err);
    alert('Server unreachable');
  }
});



const signInForm = document.getElementById('signin-form');

signInForm.addEventListener('submit', async e => {
  e.preventDefault();
  
  const email = document.getElementById('signin-email').value.trim().toLowerCase();
  const pass = document.getElementById('signin-pass').value;

  if (!email || !pass) {
    alert('Please enter email and password');
    return;
  }

  try {
    const response = await fetch('http://localhost:500/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });

    const data = await response.json();

    if (response.ok) {
      localStorageStorage.setItem('currentUser', JSON.stringify({ name: data.user.username }));
      window.location.href = 'start.html';
    } else {
      alert(data.error || 'Login failed');
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Server unreachable');
  }
});
