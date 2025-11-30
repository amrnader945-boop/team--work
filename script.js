function get(id) {
    return document.getElementById(id);
}

function loadPatient() {
    const url = new URL(window.location.href);
    const pid = url.searchParams.get("id");

   fetch('patients.json')

        .then(res => res.json())
        .then(data => {
            get("id").innerText = data.id;
            get("name").innerText = data.name;
            get("age").innerText = data.age;
            get("gender").innerText = data.gender;
            get("clinic").innerText = data.clinic;
            get("doctor").innerText = data.doctor;
            get("phone").innerText = data.phone;

            get("abs").innerText = data.abs;
            get("conc").innerText = data.conc;
            get("trans").innerText = data.trans;
        });
}

loadPatient();

// WhatsApp btn
document.getElementById("sendWA").onclick = () => {
    const phone = get("phone").innerText;
    const link = window.location.href;

    window.open(
        `https://wa.me/${phone}?text=Your%20results%20are%20ready:%0A${link}`,
        "_blank"
    );
};

