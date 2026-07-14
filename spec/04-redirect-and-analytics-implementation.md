# Step 4 Implementation: Redirect and Analytics

## What was implemented
- Added `GET /:code` support through a dedicated redirect router.
- Looked up the short code in MongoDB and returned a `301` redirect to the original URL.
- Returned a `404` error when the code does not exist.
- Added lightweight analytics fields to the URL mapping model: `clickCount` and `lastAccessedAt`.
- Updated redirect resolution so each visit increments the click count and refreshes the last access timestamp.

## Decisions made
- Kept the redirect path narrow and synchronous in behavior: resolve the code, update analytics, then redirect.
- Used the same MongoDB record as the analytics source instead of introducing a separate tracking collection.
- Chose to keep analytics minimal because the assignment only asks for a light signal, not a reporting system.

## Tradeoffs
- Updating analytics during the redirect makes the read path slightly more expensive, but it keeps the data model simple.
- I stored only click count and last access time so the redirect remains fast to understand and easy to extend later.
- I did not expose analytics in an API yet because the spec only requires capture, not reporting.

## Notes for the next step
- The backend now supports the full shorten-then-redirect flow.
- The model is ready for later statistics or dashboard work if the next spec needs it.
