fetch("https://amrnader945-boop.github.io/team--work/data/patients.json")
    .then(response => response.json())
    .then(data => {
        const name = document.getElementById("name").value.trim();
        const id = document.getElementById("id").value.trim();

        if (data[id] && data[id].name.toLowerCase() === name.toLowerCase()) {
            localStorage.setItem("patientData", JSON.stringify(data[id]));
            window.location.href = "patient.html";
        } else {
            alert("❌ Incorrect Name or ID");
        }
    })
    .catch(err => {
        console.error("Fetch Error:", err);
        alert("Error loading data.");
    });
