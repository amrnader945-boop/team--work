// public/script.js
document.getElementById('loginBtn').addEventListener('click', function () {
  const name = document.getElementById('name').value.trim();
  const id = document.getElementById('id').value.trim();
  if (!name || !id) return alert('Please fill both fields.');

  fetch('/patients/get', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ name, id })
  })
  .then(r=>r.json())
  .then(j=>{
    if (j.success) {
      // store patient locally to speed up rendering
      const patient = j.patient;
      patient.id = id;
      localStorage.setItem('patientData', JSON.stringify(patient));
      window.location.href = `/patient.html?id=${id}`;
    } else {
      alert('Wrong name or ID');
    }
  })
  .catch(e=>{
    console.error(e); alert('Error contacting server');
  });
});
