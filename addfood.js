// Handle Back button click
document.getElementById("back-btn").addEventListener("click", function () {
    window.history.back(); // Navigate to the previous page
});



document.getElementById("add-food-btn").addEventListener("click", async function () {
    const fields = [
        { id: "food-name", errorId: "food-name-error", errorMessage: "Please enter the food name." },
        { id: "calories", errorId: "calories-error", errorMessage: "Please enter the calories." },
        { id: "protein", errorId: "protein-error", errorMessage: "Please enter the protein content." },
        { id: "carbohydrates", errorId: "carbohydrates-error", errorMessage: "Please enter the carbohydrates content." },
        { id: "fat", errorId: "fat-error", errorMessage: "Please enter the fat content." },
        { id: "vitamins", errorId: "vitamins-error", errorMessage: "Please enter the vitamins." },
        { id: "minerals", errorId: "minerals-error", errorMessage: "Please enter the minerals." }
    ];

    let isValid = true;

    fields.forEach(field => {
        const input = document.getElementById(field.id);
        const error = document.getElementById(field.errorId);

        if (input.value.trim() === "") {
            error.textContent = field.errorMessage;
            error.style.display = "block";
            isValid = false;
        } else {
            error.textContent = "";
            error.style.display = "none";
        }
    });

    if (isValid) {
        // Collect form data
        const foodData = {
            foodName: document.getElementById("food-name").value.trim(),
            calories: parseInt(document.getElementById("calories").value.trim(), 10),
            protein: parseFloat(document.getElementById("protein").value.trim()),
            carbohydrates: parseFloat(document.getElementById("carbohydrates").value.trim()),
            fats: parseFloat(document.getElementById("fat").value.trim()),
            vitamins: document.getElementById("vitamins").value.trim(),
            minerals: document.getElementById("minerals").value.trim()
        };

        try {
            const response = await fetch('http://localhost:3000/addfood', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(foodData)
            });

            if (response.ok) {
                alert("Food item added successfully!");
                fields.forEach(field => {
                    document.getElementById(field.id).value = "";
                });
            } else {
                const errorData = await response.json();
                alert("Error: " + errorData.error);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to add food item. Please try again.");
        }
    }
});
