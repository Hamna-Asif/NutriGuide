document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector(".search-bar input");
    const backButton = document.querySelector(".back-button");
    const addFoodButton = document.querySelector(".add-food .nav-item");
    const searchResults = document.createElement("div");
    searchResults.className = "search-results";
    document.querySelector(".container").appendChild(searchResults);

    // Extract mealType and date from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const mealType = urlParams.get("mealType");
    const date = urlParams.get("date");
    const userId = localStorage.getItem("userId");

    // Back button functionality
    backButton.addEventListener("click", function () {
        window.location.href = "diarypage.html";
    });

    // Handle Enter keypress in the search bar
    searchInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            const foodName = searchInput.value.trim();
            if (foodName) {
                searchFood(foodName);
            } else {
                alert("Please enter a food name to search.");
            }
        }
    });

    // Add Food button functionality
    addFoodButton.addEventListener("click", function () {
        const selectedFood = document.querySelector(".food-item h3");
        if (selectedFood) {
            const foodName = selectedFood.textContent;
            addFood(userId, date, mealType, foodName);
        } else {
            alert("Please search and select a food item before adding.");
        }
    });
});

async function searchFood(foodName) {
    try {
        const response = await fetch(
            "http://localhost:3000/searchfood/" + encodeURIComponent(foodName),
            { method: "GET" }
        );

        if (response.ok) {
            const food = await response.json();
            const searchResults = document.querySelector(".search-results");
            searchResults.innerHTML = `
                <div class="food-item">
                    <h3>${food.food_name}</h3>
                    <p><strong>Calories:</strong> ${food.calories}</p>
                    <p><strong>Protein:</strong> ${food.protein} g</p>
                    <p><strong>Carbohydrates:</strong> ${food.carbohydrates} g</p>
                    <p><strong>Fats:</strong> ${food.fats} g</p>
                </div>
            `;
        } else if (response.status === 404) {
            alert("Food not found.");
        } else {
            alert("An error occurred while searching for food.");
        }
    } catch (error) {
        console.error("Error fetching food details:", error.message);
        alert("An error occurred. Please try again.");
    }
}

async function addFood(userId, date, mealType, foodName) {
    try {
        const response = await fetch("http://localhost:3000/addfooddiary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                userId, 
                dateEntered: date || null, // Send null if no date is available
                mealType, 
                foodName 
            }),
        });

        if (response.ok) {
            alert("Food added successfully!");
            window.location.href = "diarypage.html";
        } else {
            const error = await response.json();
            alert("Error: " + error.error);
        }
    } catch (error) {
        console.error("Error adding food:", error.message);
        alert("An error occurred. Please try again.");
    }
}

