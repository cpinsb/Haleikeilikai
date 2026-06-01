# Connecting the Live Availability Calendar

Your website shows a calendar that automatically blocks out nights already booked on
Airbnb. It does this by reading Airbnb's **official iCal export** — not by scraping —
so it's fully within Airbnb's rules.

Because your site is static (just files), it needs a tiny free helper (a Cloudflare
Worker) to fetch that calendar feed. One-time setup, then it runs itself.

---

## Step 1 — Get your Airbnb iCal export link

1. Open your Airbnb listing → **Calendar** (or **Availability**).
2. Find **Connect to another website** / **Sync calendars** → **Export calendar**.
3. Copy the link Airbnb gives you. It looks like:
   `https://www.airbnb.com/calendar/ical/17288601.ics?s=XXXXXXXX`

Keep this private — anyone with it can see your booked/free dates.

---

## Step 2 — Deploy the free Cloudflare Worker

1. Create a free account at **dash.cloudflare.com** (no credit card needed).
2. Go to **Workers & Pages → Create → Create Worker**. Give it a name like
   `ilikai-calendar`. Click **Deploy**, then **Edit code**.
3. Delete the sample code and paste in the contents of **`cloudflare-worker.js`**
   (in this folder).
4. In that code, replace `PASTE_YOUR_AIRBNB_ICAL_EXPORT_URL_HERE` with the Airbnb
   link from Step 1 (keep the quotes).
5. Click **Deploy**. Cloudflare gives you a public URL like:
   `https://ilikai-calendar.YOURNAME.workers.dev`
6. Test it: open that URL in your browser. You should see text starting with
   `BEGIN:VCALENDAR`. That means it works.

---

## Step 3 — Tell the website to use it

1. Open **`index.html`** and find this line (near the bottom, in the script):

   ```js
   var ICAL_PROXY_URL = "";
   ```

2. Paste your Worker URL inside the quotes:

   ```js
   var ICAL_PROXY_URL = "https://ilikai-calendar.YOURNAME.workers.dev";
   ```

3. Save and re-upload `index.html` to your host.

That's it. The calendar will now show booked nights in muted strikethrough and open
nights in green, refreshing every time someone visits (cached ~30 min for speed).

---

## Notes

- If you ever leave `ICAL_PROXY_URL` blank, the calendar still shows but simply
  invites visitors to send an inquiry — nothing breaks.
- The feed updates on Airbnb's schedule (typically refreshed every few hours), so a
  brand-new booking may take a little while to appear. Always confirm dates before
  accepting a direct booking.
- This is read-only availability. To take payments and instant bookings online,
  you'd move up to a direct-booking platform (OwnerRez, Lodgify, Hospitable, Smoobu) —
  just ask and I can set that path up.
