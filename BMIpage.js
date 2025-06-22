function goBack() {
    window.location.href = "infopage2.html";  // Redirect back to infopage2.html
}

document.addEventListener("DOMContentLoaded", async function () {
    const userId = localStorage.getItem("userId"); // Assume userId is stored in localStorage

    if (!userId) {
        alert("User not identified. Please log in.");
        window.location.href = "login.html"; // Redirect to login
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/BMIpage/" + userId);
        if (!response.ok) {
            throw new Error("Failed to fetch BMI data");
        }

        const { height, weight, bmi, category } = await response.json();

        document.getElementById("userHeight").textContent = height + " cm";
        document.getElementById("userWeight").textContent = weight + " kg";
        document.getElementById("userBMI").textContent = `${bmi} (${category})`;
        document.getElementById("userWeightStatus").textContent = category;
    } catch (error) {
        alert("Error loading BMI data: " + error.message);
        window.location.href = "infopage2.html"; // Redirect if data cannot be loaded
    }
    // Add functionality for the "Your Target" button
    const targetButton = document.getElementById("targetButton");
    if (targetButton) {
        targetButton.addEventListener("click", function () {
            window.location.href = "targetpage.html"; // Redirect to the target page
        });
    }
});
