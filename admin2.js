class NavigationManager {
  // Navigate to different pages
  static navigateTo(page) {
    switch (page) {
      case 'home':
        window.location.href = 'startingpage.html';
        break;
      case 'settings':
        window.location.href = 'settings.html';
        break;
      // case 'diaries':
      //   window.location.href = 'diaries.html';
      //   break;
      case 'profile-comment':
        window.location.href = 'admin2.html';
        break;
      case 'addfood': // Add Food navigation
        window.location.href = 'addfood.html';
        break;
      default:
        console.error('Page not found');
        break;
    }
  }

  // Navigate back to the previous page
  static navigateBack() {
    window.location.href = 'startingpage.html';  // Adjust to your main admin page
  }

  // Handle Search User functionality
  static searchUser() {
    window.location.href = 'searchuser.html';
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const adminId = localStorage.getItem("adminId");

  if (!adminId) {
      alert("Admin not logged in. Please log in again.");
      window.location.href = "startingpage.html";
      return;
  }

  try {
      const response = await fetch("http://localhost:3000/admin/" + adminId);
      if (!response.ok) {
        throw new Error("Failed to fetch admin data");
      }

      const { name, id, email, phone } = await response.json();

      document.getElementById('profileName').textContent = name;
      document.getElementById('profileId').textContent = id;
      document.getElementById('profileEmail').textContent = email;
      document.getElementById('profilePhone').textContent = "+92 " + phone;

  } catch (error) {
      console.error("Error fetching admin profile:", error);
      alert("An error occurred while fetching admin details.");
  }
});

