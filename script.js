document.getElementById("loginBtn").addEventListener("click", function () {

    const name = document.getElementById("name").value.trim();
    const id = document.getElementById("id").value.trim();

    if (!name || !id) {
        alert("⚠️ Please enter Name and ID");
        return;
    }

    // رابط RAW المضمون
    const dataURL = "https://raw.githubusercontent.com/amrnader945-boop/team--work/main/data/patients.json";

    fetch(dataURL)
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP Error: " + response.status);
            }
            return response.json();
        })
        .then(data => {

            // check id exists
            if (!data[id]) {
                alert("❌ Incorrect Name or ID");
                return;
            }

            const patient = data[id];

            // check name matches
            if (patient.name.toLowerCase() === name.toLowerCase()) {

                // save patient data
                localStorage.setItem("patientData", JSON.stringify(patient));

                // go to patient page
                window.location.href = "patient.html";

            } else {
                alert("❌ Incorrect Name or ID");
            }

        })
        .catch(err => {
            console.error("Fetch Error:", err);
            alert("⚠️ Error loading patient data.");
        });

});
