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


// helper function to hash the password

async function sha256(str) {
  const msgBuffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}


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

  // check if user already exists
  const users = JSON.parse(localStorage.getItem('memoryGameUsers') || '{}');
  if (users[email]) {
    alert('This email is already registered');
    return;
  }

  // store hashed password
  const hash = await sha256(pass)
  users[email] = {name, hash};
  localStorage.setItem('memoryGameUsers', JSON.stringify(users));

  // log the user in immediately
  localStorage.setItem('currentUser', JSON.stringify({ name: name || email.split('@')[0]}));
  window.location.href = 'start.html'
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

  const users = JSON.parse(localStorage.getItem('memoryGameUsers') || '{}');
  const user = users[email];

  if (!user) {
    alert('No account found with that email');
    return;
  }

  const hash = await sha256(pass);
  if (hash !== user.hash) {
    alert('Incorrect password');
    return
  }

  // successful login
  localStorage.setItem('currentUser', JSON.stringify({name: user.name || email.split('@')[0] }));
  window.location.href = 'start.html'
});
