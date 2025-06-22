class AdminScreen {
    constructor() {
      // Get the back button element by its ID
      this.backButton = document.getElementById('backButton');
      
      // Initialize events
      this.initializeEvents();
    }
  
    // Method to initialize event listeners
    initializeEvents() {
      this.backButton.addEventListener('click', () => this.navigateBack());
    }
  
    // Method for navigating back to the desired page
    navigateBack() {
      // Replace 'your_target_page.html' with the actual page you want to link to
      window.location.href = 'admin2.html';
    }
  }
  
  // Initialize the class when the page loads
  new AdminScreen();
  