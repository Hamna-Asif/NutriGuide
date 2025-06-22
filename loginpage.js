// Handle form submission and integrate with backend API

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent the form from submitting normally

  const email = document.getElementById('emailField').value;
  const password = document.getElementById('passwordField').value;

  try {
    // Make a POST request to the backend /login endpoint
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }), // Send email and password in request body
    });

    const result = await response.json();

    if (response.ok) {
      // If login is successful, store the userId in localStorage
      localStorage.setItem('userId', result.userId);
      alert(result.message); // Show success message
      window.location.replace('profile.html'); // Redirect to the profile page
    } else {
      // Handle login failure (e.g., invalid credentials)
      alert(result.error || 'Login failed');
      console.error('Backend response:', result);
    }
  } catch (error) {
    // Handle network or other errors
    console.error('Error during login:', error);
    alert('An error occurred. Please try again.');
  }
});

// Toggle password visibility
document.getElementById("togglePassword").addEventListener("click", () => {
  const passwordField = document.getElementById("passwordField");
  const type = passwordField.type === "password" ? "text" : "password";
  passwordField.type = type;
});

// Focus on the email field after the page loads
document.addEventListener('DOMContentLoaded', () => {
  const emailField = document.getElementById('emailField');
  if (emailField) {
    emailField.focus();
  }
});

document.getElementById('forgotPasswordLink').addEventListener('click', async () => {
  const email = document.getElementById('emailField').value;

  if (!email) {
    alert('Please enter your email');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (response.ok) {
      localStorage.setItem('userId', result.userId);
      window.location.replace('forgotpassword.html');
    } else {
      alert(result.error || 'Email not found');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
});
