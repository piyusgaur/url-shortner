# Step 3: URL Shortening Core

## Goal
Implement the main business logic for creating short URLs.

## What to build
- Create the MongoDB model for URL mappings.
- Implement `POST /shorten`.
- Validate incoming long URLs before saving them.
- Generate a short code that is URL-safe.
- Support custom aliases when provided by the client.
- Decide and document what happens when the same long URL is shortened twice.

## What to avoid
- Do not build the redirect endpoint yet.
- Do not add analytics until the mapping workflow is stable.
- Do not accept invalid URLs just to make tests pass.

## Done when
- A valid request returns a short code.
- Custom aliases are stored and respected.
- Duplicate URL behavior is consistent and documented.

## Suggested commit
- `feat(backend): add shorten url service and validation`
