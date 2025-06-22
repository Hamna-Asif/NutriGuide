console.log('infopage2.js loaded successfully');

document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('#info-form input, #info-form select');
    inputs.forEach(input => input.disabled = false);
    console.log('Inputs initialized and enabled');
});

document.getElementById('calculateBMI').addEventListener('click', async function (event) {
    event.preventDefault();

    const id = localStorage.getItem("userId"); // Retrieve the user ID
    const height = document.getElementById('height').value.trim();
    const weight = document.getElementById('weight').value.trim();
    const gender = document.getElementById('gender').value;
    const exercise = document.getElementById('exercise').value.trim();
    const birthdate = document.getElementById('birthdate').value;
    const heightUnit = document.getElementById("heightUnit").value;
    const weightUnit = document.getElementById("weightUnit").value;

    // Validate inputs
    if (!height || isNaN(height) || height <= 0 || 
        !weight || isNaN(weight) || weight <= 0 || 
        !gender || !exercise || !birthdate) {
        alert("Please enter valid inputs for all fields.");
        return;
    }

    const heightInCm = heightUnit === "ft" ? height * 30.48 : height;
    const weightInKg = weightUnit === "lb" ? weight * 0.453592 : weight;

    try {
        const response = await fetch("http://localhost:3000/infopage2", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: id, height: heightInCm, weight: weightInKg, gender, exercise, birthdate }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Details saved successfully.");
            window.location.href = "BMIpage.html";
        } else {
            alert(data.error || "Failed to save details.");
        }
    } catch (err) {
        console.error("Error:", err);
        alert("An error occurred. Please try again.");
    }
});
