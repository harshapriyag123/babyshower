'use strict';
// Paste the deployed Apps Script /exec URL here. It is public, not a secret.
const ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbwxqGkAZhoB4pYOcejiNeewX_KqbbGVAHYJ-UaXWX4klrUc1c132F2HwcsnnuciNfg1yA/exec';
const EVENT_DATE = new Date('2026-11-15T10:00:00-06:00');
// Closed at midnight after November 10 in America/Chicago (CST).
const RSVP_CLOSE = new Date('2026-11-11T00:00:00-06:00');
const form = document.querySelector('#rsvp-form');
const fields = document.querySelector('#rsvp-fields');
const status = document.querySelector('#form-status');
const submit = document.querySelector('#submit');
let busy = false;
function updateTime(now = new Date()) {
  const remaining = Math.max(0, EVENT_DATE - now);
  const seconds = Math.floor(remaining / 1000);
  const values = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
  ['days', 'hours', 'minutes', 'seconds'].forEach((key, i) => document.getElementById(key).textContent = String(values[i]).padStart(2, '0'));
  if (!remaining) document.querySelector('#countdown-note').textContent = 'The celebration day has arrived. Thank you for your blessings!';
  if (now >= RSVP_CLOSE) {
    fields.disabled = true;
    document.querySelector('#deadline').textContent = 'RSVP closed on November 10, 2026. Please contact the hosts for changes.';
  }
}
updateTime();
setInterval(updateTime, 1000);
function updateGuests() {
  const declined = form.attending.value === 'no';
  form.guests.disabled = declined;
  form.guests.required = !declined;
  form.guests.min = declined ? '0' : '1';
  form.guests.value = declined ? '0' : Math.max(1, Number(form.guests.value) || 1);
}
form.attending.addEventListener('change', updateGuests);
// Google Apps Script redirects JSON responses across origins, so verify saves
// using a JSONP lookup rather than trying to read a cross-origin POST response.
function checkSaved(requestId) {
  return new Promise((resolve) => {
    const callback = 'rsvpCallback_' + Math.random().toString(36).slice(2, 14);
    const script = document.createElement('script');
    let done = false;
    const finish = (value) => {
      if (done) return;
      done = true;
      clearTimeout(timeout);
      delete window[callback];
      script.remove();
      resolve(value);
    };
    window[callback] = (result) => finish(result && result.saved === true);
    const timeout = setTimeout(() => finish(false), 7000);
    script.onerror = () => finish(false);
    script.src = ENDPOINT_URL + '?callback=' + encodeURIComponent(callback) +
      '&requestId=' + encodeURIComponent(requestId) + '&t=' + Date.now();
    document.head.appendChild(script);
  });
}
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (busy) return;
  updateTime();
  if (new Date() >= RSVP_CLOSE || !form.reportValidity()) return;
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  if (!name) { status.textContent = 'Please enter your name.'; return; }
  if (data.get('website')) { status.textContent = 'Unable to submit this response.'; return; }
  if (!ENDPOINT_URL) { status.textContent = 'Online RSVP is not open yet. Please contact the hosts directly.'; return; }
  const requestId = form.dataset.requestId || (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2));
  form.dataset.requestId = requestId;
  const payload = new URLSearchParams({name, attending: form.attending.value, guests: form.attending.value === 'no' ? '0' : form.guests.value, website: String(data.get('website') || ''), requestId});
  busy = true; submit.disabled = true; submit.textContent = 'Sending…'; status.textContent = '';
  try {
    // The POST response is opaque; never treat that alone as proof of saving.
    // Keep the request ID for safe retries.
    await fetch(ENDPOINT_URL, {method: 'POST', mode: 'no-cors', body: payload, signal: AbortSignal.timeout(25000)});
    let saved = false;
    for (let attempt = 0; attempt < 5; attempt++) {
      await wait(attempt === 0 ? 1200 : 1600);
      if (await checkSaved(requestId)) { saved = true; break; }
    }
    if (!saved) throw new Error('RSVP not confirmed in Sheet');
    form.reset(); delete form.dataset.requestId; updateGuests();
    status.textContent = 'Thank you! Your RSVP has been received. We’re grateful for your love and blessings.';
  } catch (error) {
    status.textContent = 'We could not confirm your RSVP. Please retry or contact the hosts. A retry will not duplicate a response already saved.';
  } finally { busy = false; submit.disabled = false; submit.textContent = 'RSVP'; updateTime(); }
});
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), {threshold: .08});
  document.querySelectorAll('.reveal').forEach(section => observer.observe(section));
}
