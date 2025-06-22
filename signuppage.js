console.log('signup.js script started executing');

// Check if DOMContentLoaded event is triggering
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
});


// Back Button Functionality
function goBack() {
  window.history.back(); // Navigate back to the previous page
}

// Password Visibility Toggle
function togglePassword() {
  const passwordField = document.getElementById('password');
  const type = passwordField.type === 'password' ? 'text' : 'password';
  passwordField.type = type;
}

// Sign-Up Form Submission Handling
async function signupHandler(event) {
  event.preventDefault(); // Prevent form from refreshing the page

  const email = document.querySelector('input[type="email"]').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.querySelector('input[type="password"]:nth-of-type(2)').value;

  if (password !== confirmPassword) {
    alert("Passwords do not match. Please try again.");
    return;
  }

  // Check if all fields are filled
  if (!email || !password || !confirmPassword) {
    alert("Please fill in all the fields.");
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    //console.log('Raw response from backend:', response);

    const data = await response.json();
    //console.log('Parsed data:', data);

    if (response.ok) {
        alert(data.message);
        localStorage.setItem('userId', data.userId);

        window.location.replace('infopage1.html');
    } 
    else {
        alert(data.error || 'Sign-up failed.');
      }
    } 
    catch (err) {
    console.error('Error during sign-up:', err);
  }

}

// Attach the named function as the event listener
document.getElementById('signup-form').addEventListener('submit', signupHandler);
