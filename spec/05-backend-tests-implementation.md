# Step 5 Implementation: Backend Tests

## What was implemented
- Added Jest configuration for the backend workspace with TypeScript support.
- Added Supertest so the Express app can be exercised through HTTP requests.
- Wrote service-level tests for URL shortening and redirect resolution.
- Wrote app-level tests for the health check, shorten endpoint, redirect endpoint, and 404 behavior.
- Covered invalid URL input, invalid aliases, duplicate URL reuse, alias conflicts, and unknown code handling.

## Decisions made
- Chose a mix of unit and HTTP-level tests so the suite proves behavior without overcoupling to the database.
- Mocked the Mongo model and service layer where appropriate to keep tests deterministic and fast.
- Kept the tests focused on the public API contract and core URL logic rather than internal implementation details.

## Tradeoffs
- I did not spin up a real MongoDB instance for the tests, which keeps the suite lightweight but means this is not a full integration test setup.
- The tests use mocked services and models, so they validate behavior and contracts more than database wiring.
- I enabled `--runInBand` for Jest to keep Windows execution and mocking behavior predictable in this workspace.

## Notes for the next step
- The backend now has an executable test suite for the critical API paths.
- The next frontend step can be built with confidence that the backend contract is documented by tests.
