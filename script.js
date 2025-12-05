// script.js — shared client logic (works on pages that include it)

/*
  Features:
  - Adds a floating Serial Connect button (top-right)
  - Offers connect / disconnect via Web Serial API (Chrome/Edge)
  - Provides helpers serialWrite(), serialIsOpen(), serialInfo()
  - Graceful errors if browser doesn't support Web Serial
*/

// Serial state (module-level)
let __serialPort = null;
let __serialWriter = null;
let __serialReader = null;
let __serialInfo = { path: null };

// create floating UI and mount handlers
function initSerialFloating(){
  const container = document.getElementById('serial-floating');
  if (!container) return;

  container.innerHTML = `
    <div id="serialBtn" class="serial-btn" title="Connect to Arduino">
      <span class="serial-small">🔌 Serial</span>
      <span id="serialStatus" class="serial-badge">—</span>
    </div>`;

  const btn = document.getElementById('serialBtn');
  const status = document.getElementById('serialStatus');

  updateSerialBadge();

  btn.addEventListener('click', async () => {
    if (!('serial' in navigator)) {
      alert('Web Serial API not supported in this browser. Use Chrome/Edge on desktop.');
      return;
    }
    if (serialIsOpen()) {
      // ask to disconnect
      const ok = confirm('Arduino is connected. Disconnect?');
      if (ok) await serialDisconnect();
      return;
    }
    // connect flow
    try {
      await serialConnect();
      alert('Arduino connected successfully.');
    } catch (e) {
      alert('Connect failed: ' + (e.message || e));
    }
    updateSerialBadge();
  });

  // keep badge updated
  setInterval(updateSerialBadge, 800);
}

function updateSerialBadge(){
  const el = document.getElementById('serialStatus');
  if (!el) return;
  el.innerText = serialIsOpen() ? 'ON' : 'OFF';
  el.style.background = serialIsOpen() ? '#c7ffd8' : '#fff';
}

// returns boolean
function serialIsOpen(){ return !!(__serialPort && __serialPort.readable && __serialPort.writable); }

// return info object
function serialInfo(){ return __serialInfo; }

// connect using Web Serial API
async function serialConnect(){
  if (!('serial' in navigator)) throw new Error('Web Serial API not available');
  // request port
  const port = await navigator.serial.requestPort();
  // open with 9600 by default (you can change)
  await port.open({ baudRate: 9600 });

  __serialPort = port;
  __serialInfo.path = 'web-serial-port';

  // setup writer
  const writer = port.writable.getWriter();
  __serialWriter = writer;

  // optional: reader loop to log incoming lines
  try {
    const decoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(decoder.writable);
    const reader = decoder.readable.getReader();
    __serialReader = reader;

    (async () => {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) console.log('[ARDUINO >> BROWSER]', value);
      }
    })();
  } catch (err) {
    console.warn('Serial read not started:', err);
  }
  updateSerialBadge();
}

// disconnect
async function serialDisconnect(){
  try {
    if (__serialReader) {
      try { await __serialReader.cancel(); } catch(e){/*ignore*/ }
      __serialReader.releaseLock();
      __serialReader = null;
    }
    if (__serialWriter) {
      try { __serialWriter.releaseLock(); } catch(e){}
      __serialWriter = null;
    }
    if (__serialPort) {
      await __serialPort.close();
      __serialPort = null;
    }
    __serialInfo = { path: null };
    updateSerialBadge();
    return true;
  } catch (e) {
    console.error('Disconnect error', e);
    throw e;
  }
}

// write text to serial (string)
async function serialWrite(text){
  if (!serialIsOpen()) throw new Error('Serial not open');
  const data = typeof text === 'string' ? text : String(text);
  const encoder = new TextEncoder();
  const writer = __serialPort.writable.getWriter();
  await writer.write(encoder.encode(data));
  writer.releaseLock();
  return true;
}

// export small helpers to global (so pages can call serialWrite etc.)
window.initSerialFloating = initSerialFloating;
window.serialWrite = serialWrite;
window.serialIsOpen = serialIsOpen;
window.serialDisconnect = serialDisconnect;
window.serialConnect = serialConnect;
window.serialInfo = serialInfo;
