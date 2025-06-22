class NavigationManager {
    // Navigate back to the previous page
    static navigateBack() {
      console.log('Navigating Back');
      // Add your navigation logic here, for example:
      window.location.href = 'startingpage.html';  // Adjust with the page you want to go back to
    }
  
    // // Handle "Search User" button click
    static searchUser() {
      console.log('Searching for User');
      // Add your search logic here
      window.location.href = 'infopage1.html';  // Adjust with the search results page
    }
    static logout() {
        console.log('loging out ');
        // Add your search logic here
        window.location.href = 'startingpage.html';  // Adjust with the search results page
      }
    // Navigate to the Home page
    static navigateToHome() {
      console.log('Navigating to Home');
      window.location.href = 'startingpage.html';  // Adjust with the Home page
    }
  
    // Navigate to the Diaries page
    static navigateToDiaries() {
      console.log('Navigating to Diaries');
      window.location.href = 'diarypage.html';  // Adjust with the Diaries page
    }
  
    // Navigate to the Profile page
    static navigateToProfile() {
      console.log('Navigating to Profile');
      window.location.href = 'profile.html';  // Adjust with the Profile page
    }
  
    // Navigate to the Settings page
    static navigateToSettings() {
      console.log('Navigating to Settings');
      window.location.href = 'settings.html';  // Adjust with the Settings page
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        alert("User not logged in. Please log in again.");
        window.location.href = "startingpage.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/profile/" + userId);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const { name, nickname, id, email, phone, height, weight, target_weight } = await response.json();

        document.getElementById("userName").textContent = name;
        document.getElementById("userNickname").textContent = nickname;
        document.getElementById("userId").textContent = id;
        document.getElementById("userEmail").textContent = email;
        document.getElementById("userPhone").textContent = "+92 " + phone;
        document.getElementById("userWeight").textContent = weight + " kg";
        document.getElementById("userHeight").textContent = height + " cm";
        document.getElementById("userTarget").textContent = target_weight + " kg";

    } catch (error) {
        console.error("Error fetching user profile:", error);
        alert("An error occurred while fetching user details.");
    }
});

// NavigationManager.editinfo = () => {
//     // const userId = localStorage.getItem("userId");
//     // if (!userId) {
//     //     alert("User not logged in. Please log in again.");
//     //     window.location.href = "startingpage.html";
//     //     return;
//     // }
//     window.location.replace(`infopage1.html`);
// };

  