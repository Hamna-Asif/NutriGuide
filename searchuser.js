class NavigationManager {
    // Function to navigate back to the previous screen
    static navigateBack() {
        console.log("Navigating Back");
        window.location.href = "admin2.html";
    }

    // Function to handle the search functionality
    static async searchUser() {
        // Trigger search only when 'Enter' key is pressed
        if (event.key !== "Enter") return;
        
        const searchInput = document.getElementById("search-input").value.trim();

        if (!searchInput) {
            alert("Please enter a username to search.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/searchuser/" + encodeURIComponent(searchInput), {
                method: "GET",
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    alert("User not found.");
                } else {
                    alert("An error occurred while searching for the user.");
                }
                return;
            }

            const userData = await response.json();
            console.log("User found:", userData);

            // Display user data in a user-friendly format (example)
            alert(
                `Name: ${userData.name}\nNickname: ${userData.nickname}\nEmail: ${userData.email}\nPhone: ${userData.phone}\nHeight: ${userData.height}\nWeight: ${userData.weight}\nTarget Weight: ${userData.target_weight}`
            );
        } catch (error) {
            console.error("Error searching for user:", error.message);
            alert("Failed to search for the user. Please try again.");
        }
    }

    // Function to delete a user
    static async deleteUser() {
        // // Trigger search only when 'Enter' key is pressed
        // if (event.key !== "Enter") return;

        const searchInput = document.getElementById("search-input").value.trim();
    
        if (!searchInput) {
            alert("Please enter a username to delete.");
            return;
        }
    
        const confirmation = confirm(`Are you sure you want to delete user: ${searchInput}?`);
        if (!confirmation) return;
    
        try {
            const response = await fetch("http://localhost:3000/searchuser/" + encodeURIComponent(searchInput), {
                method: "DELETE",
            });            
    
            if (response.ok) {
                alert("User deleted successfully.");
                document.getElementById("search-input").value = ""; // Clear input field
            } else if (response.status === 404) {
                alert("User not found. Unable to delete.");
            } else {
                alert("An error occurred while deleting the user.");
            }
        } catch (error) {
            console.error("Error deleting user:", error.message);
            alert("Failed to delete the user. Please try again.");
        }
    }
    

    // Navigation functions remain unchanged
    static navigateToHome() {
        console.log("Navigating to Home");
        window.location.href = "startingpage.html";
    }

    static navigateToDiaries() {
        console.log("Navigating to Diaries");
        window.location.href = "dairies.html";
    }

    static navigateToProfile() {
        console.log("Navigating to Profile");
        window.location.href = "admin2.html";
    }

    static navigateToSettings() {
        console.log("Navigating to Settings");
        window.location.href = "settings.html";
    }
}
