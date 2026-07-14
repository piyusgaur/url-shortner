# Step 3 Implementation: URL Shortening Core

## What was implemented
- Added a MongoDB URL mapping model with unique `originalUrl` and `shortCode` fields.
- Implemented `POST /shorten` as the first real business endpoint.
- Added URL validation so only valid `http` and `https` URLs can be stored.
- Added URL-safe alias support using a restricted character set.
- Added automatic short-code generation using cryptographically random values plus database uniqueness checks.
- Standardized the duplicate-URL behavior so the same URL returns the existing mapping instead of creating a new one.

## Decisions made
- Chose to make shortening idempotent by default: the same long URL maps to one canonical short code.
- Chose to treat a new alias for an already-shortened URL as a conflict, because that keeps the behavior predictable.
- Used the generated short code itself as the stored identifier for custom aliases instead of keeping a separate alias field.
- Used `base64url` output from `crypto.randomBytes` because it is naturally URL-safe and compact.

## Tradeoffs
- The generator is probabilistic rather than sequential, but collision risk is reduced with DB uniqueness checks and retry logic.
- I returned `200` for reused URLs and `201` for newly created mappings so the API communicates whether anything new was created.
- I kept the model intentionally small and deferred analytics fields until the redirect spec, which keeps this step focused on core shortening only.

## Notes for the next step
- The service layer now centralizes validation and generation, which will make redirect lookup and future analytics easier to add.
- Error handling now supports deliberate `400` and `409` API responses, so later endpoints can use the same pattern.
