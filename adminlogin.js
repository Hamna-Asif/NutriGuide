// Handle form submission and integrate with backend API
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('emailField').value;
    const password = document.getElementById('passwordField').value;
  
    try {
      const response = await fetch('http://localhost:3000/adminlogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message);
        localStorage.setItem("adminId", result.adminId);
        //console.log(result.user);
        window.location.replace('admin2.html');
      } else {
        alert(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
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
