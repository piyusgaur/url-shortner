# Step 9: Link Analytics

## Goal
Expose the usage data already captured by the redirect flow so the owner can inspect how a
short link is performing.

## What to build
- Add a backend endpoint to fetch analytics for a specific short code.
- Return the link metadata needed for reporting, such as the original URL, short code,
  click count, and last accessed time.
- Validate unknown codes and return `404` for links that do not exist.
- Add a simple frontend view or panel that displays the analytics summary for a link.

## What to avoid
- Do not build a complex reporting system or charts unless they add clear value.
- Do not introduce a second analytics store unless the current model can no longer support the
  reporting needs.
- Do not change redirect behavior while adding reporting.

## Done when
- A link owner can request analytics for a valid short code.
- Unknown codes return `404`.
- The frontend can show the analytics data in a simple, readable format.
- The new reporting path does not affect shortening or redirect behavior.

## Suggested commit
- `feat(backend): add analytics summary`
