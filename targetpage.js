// Function to navigate back to the BMI page
function goBack() {
    window.location.href = "BMIpage.html"; // Navigate back to BMI page
}

// DOMContentLoaded ensures the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", function () {
    const height = parseFloat(localStorage.getItem("height")); // Height in cm
    const weight = parseFloat(localStorage.getItem("weight")); // Current weight in kg

    // Calculate healthy weight range based on height and display it
    const minHealthyWeight = (18.5 * (height / 100) ** 2).toFixed(1);
    const maxHealthyWeight = (24.9 * (height / 100) ** 2).toFixed(1);
    document.getElementById("healthyRange").textContent = `${minHealthyWeight} - ${maxHealthyWeight} kg`;

    // Provide a weight loss suggestion
    // const targetWeight = parseFloat(minHealthyWeight); // Suggest lowest healthy weight as target
    // const weightToLose = (weight - targetWeight).toFixed(1);
    // document.getElementById("suggestion").textContent = `To lose ${weightToLose} kg in 135 days.`;

    // Handle unit selection buttons
    let currentUnit = localStorage.getItem("unit") || "kg"; // Default to kg

    document.getElementById("kgButton").addEventListener("click", function () {
        currentUnit = "kg";
        toggleActiveButton("kgButton", "lbsButton");
    });

    document.getElementById("lbsButton").addEventListener("click", function () {
        currentUnit = "lbs";
        toggleActiveButton("lbsButton", "kgButton");
    });

    function toggleActiveButton(activeButtonId, inactiveButtonId) {
        document.getElementById(activeButtonId).classList.add("active");
        document.getElementById(inactiveButtonId).classList.remove("active");
    }

    // Handle the "Let's see" button with API interaction
    document.getElementById("letsSeeButton").addEventListener("click", async function () {
        const targetWeight = document.getElementById("targetWeight").value;
        const durationDays = document.getElementById("durationDays").value;
        const id = localStorage.getItem("userId"); // Assuming user email is stored after login

        if (!targetWeight || !durationDays) {
            alert("Please complete all fields before proceeding.");
            return;
        }

        try {
            // API call to save target weight and duration
            const response = await fetch("http://localhost:3000/targetpage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: id,
                    targetWeight: parseFloat(targetWeight),
                    durationDays: parseInt(durationDays),
                    unit: currentUnit, // Pass the selected unit
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Your target has been saved successfully!");
                localStorage.setItem("targetWeight", targetWeight);
                localStorage.setItem("durationDays", durationDays);
                localStorage.setItem("unit", currentUnit); // Store the selected unit (kg or lbs)
                window.location.href = "finishpage.html"; // Redirect to next page
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("Error saving target:", error);
            alert("Failed to save your target. Please try again later.");
        }
    });
});
