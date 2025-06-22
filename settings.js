class NavigationManager {
    constructor() {
      // Bind all buttons to their respective elements
      this.backButton = document.getElementById('backBtn');
      this.logoutButton = document.getElementById('logoutBtn');
      this.contactButton = document.getElementById('contactBtn');
      this.copyrightButton = document.getElementById('copyrightBtn');
      this.homeButton = document.getElementById('homeBtn');
      this.diariesButton = document.getElementById('diariesBtn');
      this.settingsButton = document.getElementById('settingsBtn');
      this.profileButton = document.getElementById('profileBtn');
  
      // Add event listeners to buttons
      this.addEventListeners();
    }
  
    // Add event listeners to the buttons
    addEventListeners() {
      // Top navigation back button
      if (this.backButton) {
        this.backButton.addEventListener('click', () => this.navigateTo('settings.html'));
      }
  
      // Settings options
      if (this.logoutButton) {
        this.logoutButton.addEventListener('click', () => this.navigateTo('startingpage.html'));
      }
      if (this.contactButton) {
        this.contactButton.addEventListener('click', () => this.navigateTo('contactpage.html'));
      }
      if (this.copyrightButton) {
        this.copyrightButton.addEventListener('click', () => this.navigateTo('copyright.html'));
      }
  
      // Bottom navigation bar
      if (this.homeButton) {
        this.homeButton.addEventListener('click', () => this.navigateTo('startingpage.html'));
      }
      if (this.diariesButton) {
        this.diariesButton.addEventListener('click', () => this.navigateTo('diarypage.html'));
      }
      if (this.settingsButton) {
        this.settingsButton.addEventListener('click', () => this.navigateTo('settings.html'));
      }
      if (this.profileButton) {
        this.profileButton.addEventListener('click', () => this.navigateTo('profile.html'));
      }
    }
  
    // Navigation method to switch pages
    navigateTo(page) {
      if (page) {
        window.location.href = page;
      } else {
        console.error('Invalid page URL');
      }
    }
}
  
// Initialize the navigation manager once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new NavigationManager();
});