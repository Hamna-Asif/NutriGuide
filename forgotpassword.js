document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const newPassword = document.getElementById('newPasswordField').value;
    const confirmPassword = document.getElementById('confirmPasswordField').value;
  
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    try {
      const userId = localStorage.getItem('userId'); // Retrieve from local storage
      if (!userId) {
        alert('User session expired. Please try again.');
        return;
      }
  
      const response = await fetch('http://localhost:3000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newPassword }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message);
        window.location.replace('loginpage.html');
      } else {
        alert(result.error || 'Password reset failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  });
  