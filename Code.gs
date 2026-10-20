// Google Apps Script. Set the Sheet ID, run setup(), then deploy as a web app.
const SHEET_ID = 'PASTE_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME = 'RSVPs';
const CLOSE_AT = new Date('2026-11-01T00:00:00-05:00');
const HEADERS = ['Request ID', 'Received', 'Name', 'Phone or Email', 'Attending', 'Total Guests', 'Blessings'];
function setup() {
  const book = SpreadsheetApp.openById(SHEET_ID);
  const sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  sheet.setFrozenRows(1);
}
function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
function safeCell_(text) {
  // Prevent guest-supplied strings from becoming spreadsheet formulas.
  return /^[=+\-@\t\r\n]/.test(text) ? "'" + text : text;
}
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const p = e && e.parameter || {};
    if (String(p.website || '').trim()) return json_({ok: false, error: 'Invalid submission'});
    const id = String(p.requestId || '');
    if (!/^[a-zA-Z0-9-]{8,100}$/.test(id)) return json_({ok: false, error: 'Invalid request ID'});
    lock.waitLock(15000);
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet || sheet.getLastRow() < 1) return json_({ok: false, error: 'Run setup first'});
    const last = sheet.getLastRow();
    // Confirm an earlier successful request even if a retry arrives after closing.
    if (last > 1 && sheet.getRange(2, 1, last - 1, 1).createTextFinder(id).matchEntireCell(true).findNext()) return json_({ok: true});
    if (new Date() >= CLOSE_AT) return json_({ok: false, error: 'RSVP is closed'});
    const name = String(p.name || '').trim();
    const contact = String(p.contact || '').trim();
    const message = String(p.message || '').trim();
    const attending = String(p.attending || '');
    const guests = Number(p.guests);
    const digits = contact.replace(/\D/g, '');
    const validContact = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) || (/^[+\d\s().-]+$/.test(contact) && digits.length >= 10 && digits.length <= 15);
    if (!name || name.length > 100 || contact.length > 150 || !validContact || message.length > 2000 || !['yes', 'no'].includes(attending) || !Number.isInteger(guests) || (attending === 'yes' ? guests < 1 || guests > 50 : guests !== 0)) return json_({ok: false, error: 'Invalid fields'});
    sheet.appendRow([id, new Date(), safeCell_(name), safeCell_(contact), attending, guests, safeCell_(message)]);
    SpreadsheetApp.flush();
    return json_({ok: true});
  } catch (error) { return json_({ok: false, error: 'Unable to save. Please retry.'}); }
  finally { if (lock.hasLock()) lock.releaseLock(); }
}
