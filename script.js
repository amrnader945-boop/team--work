document.getElementById("loginBtn").addEventListener("click", function () {
    const btn = this; // Reference to the button
    const nameInput = document.getElementById("name");
    const idInput = document.getElementById("id");

    const name = nameInput.value.trim();
    const id = idInput.value.trim();

    // 1. Basic Validation
    if (!name || !id) {
        alert("⚠ Please enter both Name and ID");
        return;
    }

    // 2. UX: Show Loading State
    const originalText = btn.innerText;
    btn.innerText = "Searching...";
    btn.disabled = true;
    btn.style.opacity = "0.7";

    // 3. Fetch Data
    fetch("https://amrnader945-boop.github.io/team--work/data/patients.json")
        .then(res => {
            if (!res.ok) throw new Error("HTTP error " + res.status);
            return res.json();
        })
        .then(data => {
            // Check if ID exists as a Key in the JSON object
            if (!data[id]) {
                alert("❌ ID not found in database.");
                resetButton();
                return;
            }

            const patient = data[id];

            // Case-insensitive name check
            if (patient.name.toLowerCase() !== name.toLowerCase()) {
                alert("❌ Name does not match the ID provided.");
                resetButton();
                return;
            }

            // 4. Pack Data (Flatten results for the next page)
            const pack = {
                id: id,
                name: patient.name,
                age: patient.age,
                gender: patient.gender,
                phone: patient.phone,
                email: patient.email,
                // Extract nested results to top level
                ABS: patient.results.ABS,
                CONC: patient.results.CONC,
                TRANS: patient.results.TRANS
            };

            // 5. Save and Redirect
            localStorage.setItem("patientData", JSON.stringify(pack));
            window.location.href = "patient.html";
        })
        .catch(err => {
            console.error(err);
            alert("⚠ Connection Error: Could not load patient database.");
            resetButton();
        });

    // Helper to reset button if validation fails
    function resetButton() {
        btn.innerText = originalText;
        btn.disabled = false;
        btn.style.opacity = "1";
    }
});
