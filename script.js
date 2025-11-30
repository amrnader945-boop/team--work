// script.js used by index.html and admin.html and patient pages

// -------- Patient login logic (index.html) ----------
if (document.getElementById('loginBtn')) {
  document.getElementById('loginBtn').addEventListener('click', () => {
    const name = document.getElementById('name').value.trim();
    const id = document.getElementById('id').value.trim();
    if (!name || !id) return alert('Please fill both fields');

    fetch('/patients/get', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name, id })
    })
    .then(r=>r.json())
    .then(resp=>{
      if (!resp.success) return alert('Wrong name or ID');
      localStorage.setItem('patientData', JSON.stringify(resp.patient));
      // redirect to patient page (with id param so page can reload from server copy as well)
      window.location.href = `/patient.html?id=${resp.patient.id}`;
    })
    .catch(e=>{
      console.error(e);
      alert('Error connecting to server');
    });
  });
}

// -------- Admin logic (admin.html) ----------
if (document.getElementById('adminLoginBtn')) {
  const loginBtn = document.getElementById('adminLoginBtn');
  const adminArea = document.getElementById('adminArea');
  const adminPassInput = document.getElementById('adminPass');

  loginBtn.addEventListener('click', () => {
    const pw = adminPassInput.value.trim();
    if (!pw) return alert('Enter admin password');
    fetch('/admin/login', {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({password: pw})
    })
    .then(r=>r.json()).then(j=>{
      if (!j.success) return alert('Bad password');
      adminArea.style.display = 'block';
      loadPatients();
    });
  });

  function loadPatients(){
    fetch('/api/patients').then(r=>r.json()).then(j=>{
      if (!j.success) return alert('Cannot load patients');
      window._patients = j.patients || {};
      renderPatients(j.patients);
    });
  }

  function renderPatients(data){
    const tbody = document.querySelector('#patientsTable tbody');
    tbody.innerHTML = '';
    const filter = (document.getElementById('filterName')||{value:''}).value.toLowerCase();
    Object.keys(data).sort().forEach(id=>{
      const p = data[id];
      if (filter && !(`${id} ${p.name}`.toLowerCase().includes(filter))) return;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${id}</td>
        <td>${p.name}</td>
        <td>${p.clinic||''}</td>
        <td>${p.doctor||''}</td>
        <td>${p.phone||''}</td>
        <td class="row-actions">
          <button data-id="${id}" class="editBtn">Edit</button>
          <button data-id="${id}" class="delBtn">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.editBtn').forEach(b=>{
      b.addEventListener('click', e=>{
        const id = e.target.dataset.id;
        const p = window._patients[id];
        if (!p) return;
        document.getElementById('p_id').value = p.id;
        document.getElementById('p_name').value = p.name;
        document.getElementById('p_age').value = p.age || '';
        document.getElementById('p_phone').value = p.phone || '';
        document.getElementById('p_clinic').value = p.clinic || '';
        document.getElementById('p_doctor').value = p.doctor || '';
        document.getElementById('r_abs').value = p.results?.ABS || '';
        document.getElementById('r_conc').value = p.results?.CONC || '';
        document.getElementById('r_trans').value = p.results?.TRANS || '';
      });
    });

    tbody.querySelectorAll('.delBtn').forEach(b=>{
      b.addEventListener('click', e=>{
        const id = e.target.dataset.id;
        if (!confirm('Delete patient '+id+'?')) return;
        fetch('/api/patients/' + id, { method: 'DELETE' })
          .then(r=>r.json()).then(j=>{
            if (!j.success) return alert('Delete failed');
            loadPatients();
          });
      });
    });
  }

  document.getElementById('saveBtn').addEventListener('click', ()=>{
    const id = document.getElementById('p_id').value.trim();
    if (!id) return alert('Enter ID');
    const p = {
      id,
      name: document.getElementById('p_name').value.trim(),
      age: parseInt(document.getElementById('p_age').value) || '',
      phone: document.getElementById('p_phone').value.trim(),
      clinic: document.getElementById('p_clinic').value.trim(),
      doctor: document.getElementById('p_doctor').value.trim(),
      results: {
        ABS: parseFloat(document.getElementById('r_abs').value) || null,
        CONC: parseFloat(document.getElementById('r_conc').value) || null,
        TRANS: parseFloat(document.getElementById('r_trans').value) || null
      }
    };
    fetch('/api/patients', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(p) })
      .then(r=>r.json()).then(j=>{
        if (!j.success) return alert('Save failed');
        alert('Saved');
        loadPatients();
      });
  });

  document.getElementById('filterName').addEventListener('input', ()=>{
    if (window._patients) renderPatients(window._patients);
  });
}
