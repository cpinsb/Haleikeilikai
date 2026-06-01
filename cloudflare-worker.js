/**
 * Hale ʻIke Ilikai — Airbnb calendar proxy
 *
 * Airbnb gives every listing a private iCal export URL. A static website can't
 * read it directly because Airbnb doesn't send CORS headers. This tiny Cloudflare
 * Worker fetches your Airbnb iCal and re-serves it WITH the right header, so your
 * site's availability calendar can read it. No scraping — this is Airbnb's own,
 * officially supported calendar feed.
 *
 * SETUP: paste your Airbnb iCal export URL below, deploy the Worker (free),
 * then copy the Worker's URL into ICAL_PROXY_URL in index.html.
 * Full steps are in availability-setup.md.
 */

const AIRBNB_ICAL_URL = "PASTE_YOUR_AIRBNB_ICAL_EXPORT_URL_HERE";

export default {
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
        },
      });
    }

    try {
      const upstream = await fetch(AIRBNB_ICAL_URL, {
        cf: { cacheTtl: 1800, cacheEverything: true }, // cache 30 min
        headers: { "User-Agent": "HaleIkeIlikai-Calendar/1.0" },
      });

      if (!upstream.ok) {
        return new Response("Calendar upstream error", { status: 502 });
      }

      const body = await upstream.text();
      return new Response(body, {
        headers: {
          "Content-Type": "text/calendar; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=1800",
        },
      });
    } catch (err) {
      return new Response("Calendar fetch failed", { status: 500 });
    }
  },
};
