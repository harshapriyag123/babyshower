# Harsha & Sankarraj — Seemantham & Valaikappu

A buildless, mobile-first invitation. Upload these files directly to GitHub Pages. No npm, framework or build step is required.

## Before sharing

1. The supplied Google Apps Script `/exec` endpoint is configured in `script.js`. Before sharing, confirm anonymous Web app access and submit a response through the website to check that it reaches the Sheet.
2. Add an approved host phone number or email in the footer of `index.html`. No contact details were provided, so none are invented. Example: `<a href="mailto:YOUR_EMAIL">Contact the hosts</a>`.
3. The website and downloadable invitation use **9th Month Seemantham & Valaikappu, November 15, 2026, 10:00 AM onwards, Elite India–Banquet Hall & Catering, 1106 N US Hwy 377, Roanoke, TX 76262**. The updated invitation includes a verified scannable QR code linking to https://harshapriyag123.github.io/babyshower/#rsvp . Deity crops and decorative assets come from the supplied reference.

## Files

- `index.html`, `style.css`, `script.js`: website.
- `Code.gs`: Google Apps Script backend; not run by GitHub Pages.
- `assets/invitation.png`: updated 5 × 7 inch invitation, 1500 × 2100 pixels at 300 DPI.
- `assets/deity-left.png`, `deity-right.png`: the original framed deity panels.
- `assets/garland.png`, `lamp.png`, `flowers.png`: cropped original artwork. Brass lamps also appear in the framed source panels.
- `assets/ceremony.ics`: downloadable calendar event. Start is 16:00 UTC, equivalent to November 15 at 10:00 AM CST. No end time is invented.

## Google Sheet + Apps Script setup

1. Create a private Google Sheet called **Seemantham RSVPs**. Keep it private; guests never need spreadsheet access.
2. Copy its spreadsheet ID: the portion between `/d/` and `/edit` in its URL.
3. From that Sheet choose **Extensions → Apps Script**.
4. Replace the editor contents with the complete contents of `Code.gs` in this package.
5. The supplied response Sheet ID is already configured in `Code.gs`: `101RrVt0vfOJSt36vHg3S6Gvy-6DkcsG0CxExJLMHLJM`. Save.
6. Select `setup` in the function dropdown and click **Run**. Review and grant the requested spreadsheet access using the account that owns the Sheet. This creates the `RSVPs` tab and its headers. Do not run `doPost` manually.
7. Choose **Deploy → New deployment → Select type → Web app**. Set **Execute as: Me**, **Who has access: Anyone**. Deploy and authorize if prompted. Your organization's policy may prevent anonymous web apps; use an account that permits this if needed.
8. Copy the deployed web-app URL ending in `/exec` (not `/dev`). Paste it into the `ENDPOINT_URL` string in `script.js`.
9. Commit that change to GitHub. Test from the published GitHub Pages site in a signed-out/private window. Submit a test RSVP and confirm a row appears in the private Sheet and the page displays success. Test both yes and no; declined responses store 0 guests.
10. When changing backend code later, use **Deploy → Manage deployments → Edit → New version → Deploy**. Merely saving the editor does not update the deployed version.

The request uses `fetch()` with a form-encoded body and follows the Apps Script ContentService redirect. There is no JSON preflight and no `no-cors` mode. Success requires a readable `{ "ok": true }` response. If fetch fails, check the `/exec` URL, anonymous access and the Apps Script execution logs. A sign-in page, restricted deployment, browser policy or CORS failure must be fixed; never mask it with `no-cors`, which cannot confirm a saved row.

Backend protections: server-side name/guest validation (optional contact is supported for older forms), honeypot, deadline enforcement, formula-injection escaping, request IDs and a script lock for retries. The endpoint is public by design; a honeypot is basic spam resistance, not authentication. Do not put secret API keys in JavaScript. RSVP data is sent only on submit, not saved in browser storage.

The same request ID is reused after a failed/uncertain submission, preventing duplicate rows for retries in that page session. A refreshed page starts a new request. Review the Sheet for separate submissions by the same family.

## GitHub Pages: no build required

1. Sign in to GitHub and create a new repository, for example `seemantham-invitation`. A public repo works with standard free GitHub Pages. Public repo contents and the public site can be viewed by anyone.
2. Extract this ZIP. Upload **the contents of the `seemantham` folder** so `index.html` is at the repository root, alongside `style.css`, `script.js`, `README.md` and `assets/`. Commit to `main`.
3. Open the repository **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose **main** and **/(root)**, then click **Save**.
6. Wait for GitHub's Pages deployment to finish. Open the URL shown there, usually `https://YOUR_USERNAME.github.io/seemantham-invitation/`.
7. Test the page, maps, calendar, image download and live RSVP before sharing its link. Subsequent commits to `main` update the site.

All asset links are relative so the site works beneath a GitHub Pages repository subpath. Google Fonts and the map require internet; local serif/sans-serif fonts and the directions link remain available if embeds/fonts fail.

## Timing and accessibility

- Countdown: `2026-11-15T10:00:00-06:00` (CST).
- RSVP closes: `2026-11-01T00:00:00-05:00` (CDT), immediately after October 31. Frontend and backend both enforce this boundary. Guest device clocks affect the frontend; the server remains authoritative.
- After the ceremony start the countdown stays at zero with a celebration message.
- No-JS visitors can read the invitation, open directions and download the calendar/artwork; the form explains that JavaScript is required.
- Visible labels, keyboard focus, skip link, descriptive alt text, live submission status, and reduced-motion support are included. Countdown ticks are not announced each second.

## Local checks

Serve the folder with `python3 -m http.server 8000` and open `http://localhost:8000` (run the command inside `seemantham`). Test narrow and wide screens, keyboard navigation, no selection, yes/guest counts, no/zero guests, success/error responses, and dates immediately before/at the close boundary. Do not change production cutoff dates merely to test; use mocks or an isolated test copy.

The included source checks verify JavaScript syntax, local asset references, deadline/countdown boundaries and backend response behavior with a mocked Sheet. A real Google deployment and browser integration check are still required after you supply the endpoint. No live RSVP Sheet or GitHub repository has been provisioned by this package.

## Minimal RSVP update

The visible form now asks only for name, attending yes/no, and total guests including the respondent. Phone/email and blessings have been removed. The server continues to support optional contact/message values for backward compatibility with the existing seven-column Sheet. If already deployed, replace the Apps Script with this updated `Code.gs` and deploy a new version so contact is no longer required. `ENDPOINT_URL` now contains the supplied deployed Apps Script URL. A live submission still requires that deployment to permit anonymous visitors.

Response spreadsheet: https://docs.google.com/spreadsheets/d/101RrVt0vfOJSt36vHg3S6Gvy-6DkcsG0CxExJLMHLJM/edit . Keep its sharing restricted to the hosts; do not use the spreadsheet edit link as a guest-facing RSVP link. The public RSVP link is https://harshapriyag123.github.io/babyshower/#rsvp .
