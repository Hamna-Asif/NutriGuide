document.addEventListener("DOMContentLoaded", function () {
    const userId = localStorage.getItem("userId");
    const datePicker = document.getElementById("datePicker");

    // Set default date to today
    const currentDate = new Date().toISOString().split("T")[0];
    datePicker.value = currentDate;

    // Fetch and display food for today's date
    fetchAndDisplayFood(userId, currentDate);

    // Set default calorie breakdown
    divideCalories();
});

async function fetchAndDisplayFood(userId, selectedDate) {
    try {
        const response = await fetch(`http://localhost:3000/getfood/${encodeURIComponent(userId)}/${encodeURIComponent(selectedDate)}`);
        if (response.ok) {
            const mealData = await response.json();

            // Reset meal sections and macronutrient totals
            ["breakfast", "lunch", "dinner", "snacks"].forEach((meal) => {
                document.getElementById(`${meal}Items`).innerHTML = "";
                document.getElementById(`${meal}Calories`).textContent = "0";
            });

            let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFats = 0;

            // Populate meal data and calculate totals
            mealData.forEach((food) => {
                const mealSection = document.getElementById(`${food.meal_type}Items`);
                const mealCalories = document.getElementById(`${food.meal_type}Calories`);

                const foodItem = document.createElement("li");
                foodItem.textContent = food.food_name;
                mealSection.appendChild(foodItem);

                const currentCalories = parseInt(mealCalories.textContent) || 0;
                mealCalories.textContent = currentCalories + food.calories;

                totalCalories += food.calories;
                totalProtein += food.protein || 0;
                totalCarbs += food.carbohydrates || 0;
                totalFats += food.fats || 0;
            });

            // Display total calories
            document.getElementById("caloriesTaken").textContent = `${totalCalories} Kcal`;

            // Update macronutrients with consumed/target format
            divideCalories(totalProtein, totalCarbs, totalFats);
        } else {
            console.error("Failed to fetch food data:", response.statusText);
        }
    } catch (error) {
        console.error("Error fetching and displaying food:", error.message);
    }
}



function fetchAndDisplayFoodForDate() {
    const userId = localStorage.getItem("userId");
    const selectedDate = document.getElementById("datePicker").value;
    fetchAndDisplayFood(userId, selectedDate);
}

function goToFoodPage(mealType) {
    const selectedDate = document.getElementById("datePicker").value;
    window.location.href = `page1.html?mealType=${encodeURIComponent(mealType)}&date=${encodeURIComponent(selectedDate)}`;
}

function divideCalories(consumedProtein, consumedCarbs, consumedFat) {
    // Fetch the userId from local storage
    const userId = localStorage.getItem("userId");

    if (userId) {
        // Make an API call to fetch total daily calories
        fetch(`http://localhost:3000/user-calories/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch daily calories");
                }
                return response.json();
            })
            .then(data => {
                if (data && data.total_daily_calories) {
                    const dailyCalories = data.total_daily_calories; // Assign fetched calories

                    // Display total daily calories in the UI
                    const dailyCaloriesElement = document.getElementById("dailyCalories");
                    dailyCaloriesElement.textContent = `${dailyCalories.toFixed(0)} Kcal`;

                    // Calculate macronutrient targets
                    const carbsTarget = (dailyCalories * 0.50) / 4;  // 50% of calories from carbs
                    const proteinTarget = (dailyCalories * 0.20) / 4;  // 20% of calories from protein
                    const fatTarget = (dailyCalories * 0.30) / 9;  // 30% of calories from fat

                    // Update the DOM with calculated macronutrient targets
                    document.getElementById("carbs").textContent = `${consumedCarbs.toFixed(1)}/${carbsTarget.toFixed(1)}g`;
                    document.getElementById("protein").textContent = `${consumedProtein.toFixed(1)}/${proteinTarget.toFixed(1)}g`;
                    document.getElementById("fat").textContent = `${consumedFat.toFixed(1)}/${fatTarget.toFixed(1)}g`;
                } else {
                    console.warn("Calories not found in the response");
                }
            })
            .catch(error => {
                console.error("Error fetching daily calories:", error);
                // alert("Unable to fetch daily calorie data. Please try again.");
            });
    } else {
        console.error("User ID is not set in local storage");
        alert("Please log in to view your daily calories.");
    }
}

function toggleMeal(mealType) {
    const mealContent = document.getElementById(`${mealType}Content`);
    if (mealContent.style.display === "none" || mealContent.style.display === "") {
        mealContent.style.display = "block";
    } else {
        mealContent.style.display = "none";
    }
}

