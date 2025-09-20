/* ==========================
   Simple rule-based "AI" Coping Buddy
   - Replace or augment with real AI API calls in sendToAI()
   - Safety: detects crisis words and opens crisis modal
   ========================== */

   const chat = document.getElementById('chat');
   const form = document.getElementById('msgForm');
   const input = document.getElementById('msgInput');
   
   const breathBtn = document.getElementById('breathBtn');
   const groundBtn = document.getElementById('groundBtn');
   const affirmBtn = document.getElementById('affirmBtn');
   
   const breathOverlay = document.getElementById('breathOverlay');
   const breathCircle = document.getElementById('breathCircle');
   const breathText = document.getElementById('breathText');
   let breathInterval = null;
   
   const crisisBtn = document.getElementById('crisisBtn');
   const crisisOverlay = document.getElementById('crisisOverlay');
   const closeCrisis = document.getElementById('closeCrisis');
   const callEmergency = document.getElementById('callEmergency');
   
   const affirmations = [
     "You are doing your best and that is enough.",
     "This feeling is temporary — you will get through it.",
     "You are worthy of care, compassion, and rest.",
     "Small steps count. Celebrate the tiny wins."
   ];
   
   const groundingSteps = [
     "Look around and name 5 things you can see.",
     "Name 4 things you can touch (or imagine touching).",
     "Listen and identify 3 things you can hear.",
     "Notice 2 things you can smell (or remember a scent).",
     "Identify 1 positive thing about yourself."
   ];
   
   const crisisWords = ["suicide","kill myself","harm myself","end my life","want to die","hurting myself","i'm going to die"];
   
   /* Helper: append a message */
   function appendMessage({from='bot', text}) {
     const wrapper = document.createElement('div');
     wrapper.className = (from === 'bot') ? 'bot-msg' : 'user-msg';
     wrapper.innerHTML = `
       <div class="avatar">${from === 'bot' ? 'CB' : 'You'}</div>
       <div class="bubble">${escapeHtml(text)}</div>
     `;
     chat.appendChild(wrapper);
     chat.scrollTop = chat.scrollHeight;
   }
   
   /* Simple HTML escape */
   function escapeHtml(s) {
     return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
   }
   
   /* Detect crisis words (case-insensitive) */
   function detectCrisis(text) {
     const t = text.toLowerCase();
     return crisisWords.some(w => t.includes(w));
   }
   
   /* Basic intent detection (very simple) */
   function detectIntent(text) {
     const t = text.toLowerCase();
     if (/breath|breathe|breathing|panic|panic attack|hypervent/i.test(t)) return 'breathing';
     if (/anxious|anxiety|nervous|stressed|stress/i.test(t)) return 'anxiety';
     if (/help|support|talk|listening/i.test(t)) return 'support';
     if (/ground|5-4-3|54321|54321|5 4 3 2 1/i.test(t)) return 'grounding';
     if (/affirm|positive|encouragement/i.test(t)) return 'affirmation';
     return 'chat';
   }
   
   /* "AI" response orchestrator */
   async function processMessage(text) {
     appendMessage({from:'user', text});
     if (detectCrisis(text)) {
       // Show crisis modal and a caring reply
       appendMessage({from:'bot', text: "I'm really sorry you're feeling this way. If you're in immediate danger, call your local emergency number. I've opened resources for you."});
       openCrisis();
       return;
     }
   
     const intent = detectIntent(text);
     if (intent === 'breathing') {
       appendMessage({from:'bot', text: "Let's try a short breathing exercise. I'll open the guided view — follow the circle."});
       openBreathing();
       return;
     }
     if (intent === 'grounding') {
       appendMessage({from:'bot', text: "Try this grounding exercise. I'll list the steps for you."});
       showGrounding();
       return;
     }
     if (intent === 'affirmation') {
       const a = randomFrom(affirmations);
       appendMessage({from:'bot', text: a});
       return;
     }
     if (intent === 'anxiety') {
       appendMessage({from:'bot', text: "I hear you. Would you like a quick breathing exercise, a grounding exercise, or an affirmation?"});
       return;
     }
   
     // Default small talk / supportive reply using canned responses.
     appendMessage({from:'bot', text: await sendToAI(text)});
   }
   
   /* Placeholder for sending to a real AI — currently returns canned responses */
   async function sendToAI(text) {
     // === OPTIONAL: Plug your API here ===
     // Example: call your backend which proxies to OpenAI and returns a reply.
     // This function must be async if you replace with fetch().
   
     // Simple simulated reply logic:
     const lowered = text.toLowerCase();
     if (lowered.includes('sad') || lowered.includes('depressed')) {
       return "I'm sorry you're feeling sad. It might help to try a grounding exercise or reach out to someone you trust. Would you like that?";
     }
     if (lowered.includes('ok') || lowered.includes('fine')) {
       return "Thanks for sharing. If anything changes, I'm here. Want a breathing exercise to relax?";
     }
     // generic empathetic response
     return "Thanks for telling me. Tell me more, or click a tool: Breathing, Grounding, or Affirmation.";
   }
   
   /* Utilities */
   function randomFrom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
   
   /* Event: form submit */
   form.addEventListener('submit', (e)=>{
     e.preventDefault();
     const text = input.value.trim();
     if(!text) return;
     input.value = '';
     processMessage(text);
   });
   
   /* Quick tool handlers */
   breathBtn.addEventListener('click', ()=> {
     appendMessage({from:'bot', text: "Starting a short breathing guide for you."});
     openBreathing();
   });
   groundBtn.addEventListener('click', ()=> {
     appendMessage({from:'bot', text: "Let's do the 5-4-3-2-1 grounding exercise."});
     showGrounding();
   });
   affirmBtn.addEventListener('click', ()=> {
     const a = randomFrom(affirmations);
     appendMessage({from:'bot', text: a});
   });
   
   /* Breathing overlay flow */
   function openBreathing(){
     breathOverlay.classList.remove('hidden');
     startBreathingAnimation();
   }
   function closeBreathing(){
     breathOverlay.classList.add('hidden');
     stopBreathingAnimation();
   }
   document.getElementById('stopBreath').addEventListener('click', closeBreathing);
   document.getElementById('startBreath').addEventListener('click', ()=> {
     // start a 2-minute guided cycle (for demo we'll do 60s)
     runGuidedBreath(60); // seconds
   });
   
   /* breathing animation logic */
   function startBreathingAnimation(){
     breathCircle.classList.add('pulse');
     // simple css class pulsates via CSS transition (we animate via JS too)
   }
   function stopBreathingAnimation(){
     breathCircle.classList.remove('pulse');
     if (breathInterval) { clearInterval(breathInterval); breathInterval = null; }
     breathText.textContent = 'Breathe in';
     breathCircle.querySelector('::after');
   }
   
   /* run guided breath sequence (in seconds) */
   function runGuidedBreath(seconds){
     // 4s inhale, 4s hold, 6s exhale cycle -> 14s cycle
     let remaining = seconds;
     const cycle = async ()=>{
       if (remaining <= 0) { appendMessage({from:'bot', text: "Great job — that was a short breathing session. How do you feel now?"}); closeBreathing(); return; }
       // inhale
       breathText.textContent = 'Breathe in';
       animateBreath(1.2, 4000);
       await wait(4000);
       // hold
       breathText.textContent = 'Hold';
       await wait(3000);
       // exhale
       breathText.textContent = 'Exhale slowly';
       animateBreath(0.6, 6000);
       await wait(6000);
       remaining -= 13;
       cycle();
     };
     cycle();
   }
   
   /* animate breath circle by scaling the inner dot */
   function animateBreath(scale, duration){
     const inner = breathCircle.querySelector('::after');
     // We don't have access to ::after in JS — instead, toggle a transform via CSS variables.
     breathCircle.style.setProperty('--breath-scale', scale);
     // We instead animate via toggling a class that uses CSS transitions:
     breathCircle.animate([
       { transform: `scale(${scale})` },
       { transform: `scale(${scale})` }
     ], { duration, fill: 'forwards' });
   }
   
   /* simple wait helper */
   function wait(ms){ return new Promise(res => setTimeout(res, ms)); }
   
   /* Grounding display */
   function showGrounding(){
     // append steps as bot messages
     groundingSteps.forEach((s, i) => {
       setTimeout(()=> appendMessage({from:'bot', text: `${i+1}. ${s}`}), i*900);
     });
   }
   
   /* Crisis modal control */
   function openCrisis(){ crisisOverlay.classList.remove('hidden'); }
   crisisBtn.addEventListener('click', ()=> {
     appendMessage({from:'bot', text: "If you're in immediate danger or feeling like harming yourself, please call emergency services now. I'm opening help resources."});
     openCrisis();
   });
   closeCrisis.addEventListener('click', ()=> crisisOverlay.classList.add('hidden'));
   callEmergency.addEventListener('click', ()=> {
     // For demo: open tel: link (device/browser will handle)
     window.location.href = 'tel:112'; // example emergency number — replace as needed
   });
   
   /* OPTIONAL: Keyboard shortcuts */
   window.addEventListener('keydown', (e)=>{
     if (e.key === 'Escape') {
       breathOverlay.classList.add('hidden');
       crisisOverlay.classList.add('hidden');
     }
   });
   
   /* Finish: initial greeting */
   appendMessage({from:'bot', text: "If at any point you feel in danger, press 'I Need Help Now' or call local emergency services."});
   