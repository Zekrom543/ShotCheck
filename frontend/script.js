// frontend/script.js
// Handles theme toggle, PDF upload, shot list rendering, voice recognition, and reset

document.addEventListener('DOMContentLoaded', () => {
    // Dark mode toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('change', e => {
        document.body.classList.toggle('dark', e.target.checked);
      });
    }
  
    // Element references
    const pdfInput = document.getElementById('pdfUpload');
    const processBtn = document.getElementById('processPdfButton');
    const startBtn = document.getElementById('startVoiceButton');
    const stopBtn = document.getElementById('stopVoiceButton');
    const resetBtn = document.getElementById('resetButton');
    const statusP = document.getElementById('voiceStatus');
    const listUl = document.getElementById('shotList');
  
    let shots = [], currentIndex = 0, recognition;
  
    // Process PDF
    processBtn.addEventListener('click', async () => {
      const file = pdfInput.files[0];
      if (!file) return alert('Select a PDF first.');
      statusP.textContent = 'Processing...';
      try {
        const fd = new FormData();
        fd.append('shotListPdf', file);
        const res = await fetch('/upload_shot_list', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        shots = data.shots; currentIndex = 0;
        renderList();
        startBtn.disabled = resetBtn.disabled = shots.length === 0;
        statusP.textContent = 'PDF ready. Start voice to check.';
      } catch (err) {
        alert(err.message);
        statusP.textContent = 'Error: ' + err.message;
      }
    });
  
    // Render shot list
    function renderList() {
      listUl.innerHTML = '';
      shots.forEach((s,i) => {
        const li = document.createElement('li');
        li.textContent = s.description;
        if (s.checked) li.classList.add('checked');
        if (i === currentIndex && !s.checked) li.classList.add('current');
        listUl.appendChild(li);
      });
    }
  
    // Voice recognition setup
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onresult = e => {
        const result = e.results[e.resultIndex];
        const txt = result[0].transcript.trim().toLowerCase();
        statusP.textContent = `Heard: "${txt}"`;
        if (result.isFinal && txt.includes('check')) advanceShot();
      };
      recognition.onstart = () => { statusP.textContent = 'Listening...'; startBtn.disabled = true; stopBtn.disabled = false; };
      recognition.onend = () => { statusP.textContent = 'Paused.'; startBtn.disabled = currentIndex >= shots.length; stopBtn.disabled = true; };
      recognition.onerror = e => { statusP.textContent = 'Error: ' + e.error; };
    }
  
    // Start/Stop buttons
    startBtn.addEventListener('click', () => recognition?.start());
    stopBtn.addEventListener('click', () => recognition?.stop());
  
    // Reset with double confirm
    resetBtn.addEventListener('click', () => {
      if (!confirm('Reset all checks?')) return;
      if (!confirm('Are you sure?')) return;
      shots.forEach(s => s.checked = false);
      currentIndex = 0;
      renderList();
      recognition?.stop();
      statusP.textContent = 'Reset done.';
      startBtn.disabled = resetBtn.disabled = shots.length === 0;
    });
  
    // Advance shot
    function advanceShot() {
      shots[currentIndex].checked = true;
      renderList();
      const next = shots.findIndex(s => !s.checked);
      if (next >= 0) {
        currentIndex = next; renderList();
      } else {
        recognition.stop(); alert('All shots checked!');
      }
    }
  });