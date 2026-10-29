# Baby Shower & Gender Reveal

Simple, buildless invitation website for Sankarraj & Harsha Priya. The public site is https://harshapriyag123.github.io/babyshower/ .

## Event

Sunday, November 15, 2026, 10:00 AM onwards (Central Standard Time).
Elite India-BANQUET HALL & CATERING, 1106 N US Hwy 377, Roanoke, TX 76262. Please join us for lunch following the celebration.

The ivory, burgundy, olive and soft gold floral design matches the invitation. The visible RSVP form asks only for name, attendance and guest count. Declining sets the count to zero.

## Invitation files

- `assets/invitation.png`: 1500 × 2100 pixels, 300 DPI, 5 × 7 inches, with a scan-tested RSVP QR code.
- `assets/invitation.pdf`: matching 5 × 7 inch PDF. Website and QR open the RSVP form; venue/address open Google Maps directions. URLs are embedded and are not printed in the invitation.
- `assets/ceremony.ics`: calendar event titled **Baby Shower & Gender Reveal**, starting at 16:00 UTC / 10:00 AM CST on November 15. No end time is invented.

To use clickable invitation links, open/share the PDF as a document. A PNG or a screenshot of the PDF uses the QR code and has no embedded text hyperlinks.

## RSVP cutoff

All printed and website RSVP text says **November 10, 2026**. Both `script.js` and `Code.gs` close responses at `2026-11-11T00:00:00-06:00`, immediately after November 10 in America/Chicago. The backend clock is authoritative. The existing Apps Script endpoint and Google Sheet ID have been preserved.

### Apply the server-side cutoff

A GitHub commit does not update the deployed Google Apps Script. In the response Sheet, choose **Extensions → Apps Script**, replace the source with this repository's `Code.gs`, save, and choose **Deploy → Manage deployments → Edit → Version: New version → Deploy**. Keep **Execute as: Me** and **Who has access: Anyone**. Editing the existing deployment keeps the same `/exec` URL, already configured in `script.js`.

If this is the first setup, run `setup()` once to create the RSVP tab and headers; authorize spreadsheet access as the Sheet owner. The Sheet stays private. Guests never need spreadsheet access.

The backend supports the existing seven-column Sheet so earlier responses stay readable; removed phone/email and message fields are left blank for new responses. It validates fields and guest counts, blocks filled honeypots, escapes spreadsheet formulas, and reuses request IDs to avoid duplicate retry rows.

Success requires a readable `{ "ok": true }` response from Apps Script. Do not use `no-cors` to hide a failed request. Before sharing, submit a response from the public website and confirm it appears in the Sheet. No real guest/test RSVP is inserted by source checks.

## GitHub Pages

Files are deployed from the repository root. No build step is required. Keep `index.html`, `style.css`, `script.js`, `.nojekyll`, and `assets/` together. Existing GitHub Pages workflow/settings are preserved.

For a new repository, go to **Settings → Pages → Deploy from a branch → main → /(root) → Save**. For this repository, commits to `main` use its configured Pages workflow. Never put Sheet credentials or private keys in the frontend.

## Validation

The page includes labels, keyboard focus, a skip link, descriptive invitation alt text, reduced-motion support and live form feedback. Countdown ticks are not announced each second. Google Fonts and the embedded map need network access; font fallbacks and the directions link remain available.

Checks cover: JavaScript syntax; source and calendar links; exact PDF link annotations; QR decoding from PNG and rendered PDF; PNG dimensions/DPI; November 10 midnight boundaries; accept/decline guest behavior; desktop and 390-pixel browser layouts. Live Apps Script deployment permissions and Sheet writes must be checked on the deployed Google backend.
