# Step 4: Redirect and Analytics

## Goal
Make the short code resolve back to the original URL and optionally capture usage data.

## What to build
- Implement `GET /:code`.
- Look up the short code in MongoDB.
- Return a `301` redirect to the original URL.
- Return `404` when the code does not exist.
- Optionally store click count, last accessed time, or similar lightweight analytics.

## What to avoid
- Do not build heavy reporting dashboards yet.
- Do not complicate the redirect path with extra unrelated logic.

## Done when
- A shortened URL redirects correctly.
- Unknown codes return `404`.
- Any analytics fields are updated predictably.

## Suggested commit
- `feat(backend): add redirect endpoint and link tracking`
