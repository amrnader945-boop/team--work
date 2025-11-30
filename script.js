document.getElementById("loginBtn").addEventListener("click", function () {

    const name = document.getElementById("name").value.trim();
    const id = document.getElementById("id").value.trim();

    fetch("https://amrnader945-boop.github.io/team--work/data/patients.json")
        .then(response => response.json())
        .then(data => {

            if (!data[id]) {
                alert("❌ Incorrect Name or ID");
                return;
            }

            const patient = data[id];

            if (patient.name.toLowerCase() === name.toLowerCase()) {
                localStorage.setItem("patientData", JSON.stringify(patient));
                window.location.href = "patient.html";
            } else {
                alert("❌ Incorrect Name or ID");
            }

        })
        .catch(err => {
            console.error("Fetch Error:", err);
            alert("⚠️ Error loading data.");
        });

});
