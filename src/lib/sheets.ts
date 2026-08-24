import "server-only";

/**
 * Appends a home-page popup signup to the Google Sheet database, via a
 * Google Apps Script Web App bound to that sheet — see .env.example for the
 * one-time setup on the sheet itself. No Google Cloud project or service
 * account needed: the script runs as the sheet owner and Apps Script issues
 * its own webhook URL.
 *
 * Best-effort: a failure here must not break the popup's own success state
 * (the email still goes out via lib/email.ts regardless), so this only logs.
 */
export async function appendSignupToSheet(email: string) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) {
    console.warn(
      "GOOGLE_SHEETS_WEBHOOK_URL is not set — signup was not written to the sheet.",
    );
    return;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        source: "Home page popup",
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      console.error(`Google Sheets webhook: HTTP ${res.status}`);
    }
  } catch (error) {
    console.error("Google Sheets webhook failed:", error);
  }
}
