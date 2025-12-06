<!-- script.js -->
document.getElementById("loginBtn").addEventListener("click", function () {

    const name = document.getElementById("name").value.trim();
    const id = document.getElementById("id").value.trim();

    if (!name || !id) {
        alert("⚠ Please enter both Name and ID");
        return;
    }

    fetch("https://amrnader945-boop.github.io/team--work/data/patients.json")
        .then(res => res.json())
        .then(data => {

            if (!data[id]) {
                alert("❌ Incorrect Name or ID");
                return;
            }

            const patient = data[id];

            if (patient.name.toLowerCase() !== name.toLowerCase()) {
                alert("❌ Incorrect Name or ID");
                return;
            }

            // pack full patient data
            const pack = {
                id,
                ...patient,
                ABS: patient.results.ABS,
                CONC: patient.results.CONC,
                TRANS: patient.results.TRANS
            };

            localStorage.setItem("patientData", JSON.stringify(pack));

            window.location.href = "patient.html";
        })
        .catch(err => {
            console.error(err);
            alert("⚠ Error loading patient data.");
        });
});
