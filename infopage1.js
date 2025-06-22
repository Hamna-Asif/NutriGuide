console.log('infopage1.js loaded successfully');

document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('#info-form input, #info-form select');
    inputs.forEach(input => input.disabled = false);
    console.log('Inputs initialized and enabled');
});

document.getElementById('next-btn').addEventListener('click', function() {
    event.preventDefault();
    const id = localStorage.getItem("userId"); // Retrieve the user ID stored during signup
    //const id = localStorage.getItem('userId')||123; // Fallback to hardcoded value
    //const id = 123;
    //console.log('Using userId:', id);

    const name = document.getElementById('name').value.trim();
    const nickname = document.getElementById('nickname').value.trim();
    const email = document.getElementById('email').value.trim();
    const country = document.getElementById('country').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const purpose = document.getElementById('purpose').value.trim();

    if (!name || !nickname || !email || !country || !phone || !purpose) {
        alert("Please fill out all fields.");
        return;
    }

    

    fetch("http://localhost:3000/infopage1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, name, nickname, email, country, phone, purpose }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.replace("infopage2.html"); // Navigate to the next page
            } else {
                alert(data.error || "Failed to save details.");
            }
        })
        .catch(err => console.error("Error:", err));
});

// document.getElementById("calculateBMI").addEventListener("click", async function () {
    

//     const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
//     const name = document.getElementById("name").value;
//     const nickname = document.getElementById("nickname").value;
//     const email = document.getElementById("email").value;
//     const country = document.getElementById("country").value;
//     const phone = document.getElementById("phone").value;
//     const purpose = document.getElementById("purpose").value;
//     // const height = parseFloat(document.getElementById("height").value);
//     // const weight = parseFloat(document.getElementById("weight").value);
//     // const gender = document.getElementById("gender").value;
//     // const birthdate = document.getElementById("birthdate").value;

//     // const heightUnit = document.getElementById("heightUnit").value;
//     // const weightUnit = document.getElementById("weightUnit").value;

//     // let heightInCm = height;
//     // let weightInKg = weight;

//     // // Convert height and weight units
//     // if (heightUnit === "ft") heightInCm = height * 30.48;
//     // if (weightUnit === "lb") weightInKg = weight * 0.453592;


//     const data = { userId, name, nickname, email, country, phone, purpose };

//     // Validate fields on the frontend before making the request
//     if (!data.userId || !data.name || !data.nickname || !data.email || !data.country || !data.phone || !data.purpose ) {
//         alert("Please complete all fields.");
//         return;
//     }

//     try {
//         // Send data to the backend
//         const response = await fetch("/savePage2", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(data),
//         });

//         const result = await response.json();

//         if (response.ok) {
//             // alert(`Data saved successfully. Your BMI is ${result.bmi} (${result.category}).`);
//             // localStorage.setItem("bmi", result.bmi); // Store BMI locally for further use
//             // localStorage.setItem("bmiCategory", result.category);
//             window.location.href = "targetpage.html";
//         } else {
//             alert(`Error: ${result.error}`);
//         }
//     } catch (error) {
//         console.error("Error saving Page 2 data:", error);
//         alert("An error occurred while saving data. Please try again later.");
//     }
// });