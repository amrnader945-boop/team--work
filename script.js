document.getElementById("loginBtn").addEventListener("click", function () {

    const name = document.getElementById("name").value.trim().toLowerCase();
    const id = document.getElementById("id").value.trim();

    if (!name || !id) {
        alert("⚠️ Please enter both name and ID");
        return;
    }

    fetch("https://amrnader945-boop.github.io/team--work/data/patients.json")
        .then(response => response.json())
        .then(data => {

            if (!data[id]) {
                alert("❌ Incorrect Name or ID");
                return;
            }

            const patient = data[id];
            const savedName = patient.name.toLowerCase();

            if (savedName === name) {
                localStorage.setItem("patientData", JSON.stringify(patient));
                window.location.href = "patient.html?id=" + id;
            } else {
                alert("❌ Incorrect Name or ID");
            }

        })
        .catch(err => {
            console.error("Fetch Error:", err);
            alert("⚠️ Error loading data.");
        });

});
