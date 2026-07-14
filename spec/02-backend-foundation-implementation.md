# Step 2 Implementation: Backend Foundation

## What was implemented
- Added a small backend structure around the Express app with request logging, 404 handling, and centralized error handling.
- Split MongoDB connection logic into a dedicated helper so startup is easier to reason about and later test.
- Added environment helpers to keep runtime configuration explicit and fail fast when required values are missing.
- Kept the health route lightweight and isolated from the rest of the future URL-shortening logic.

## Decisions made
- Kept logging simple with a custom middleware instead of adding another logging dependency.
- Returned JSON for 404 and error responses so later API endpoints can follow the same response style.
- Used a separate `connectMongo()` helper because startup code is easier to evolve when database setup is not embedded directly in `server.ts`.
- Continued to avoid any shortening business logic so this step stays purely about backend foundation.

## Tradeoffs
- The request logger is intentionally minimal and uses `console.log`; that is enough for the take-home and avoids overengineering observability.
- I did not wire a CORS origin whitelist yet because the assignment only needs a working backend shell at this stage.
- The backend still uses a simple startup flow rather than a full lifecycle manager; that keeps the code readable for the next spec.

## Notes for the next step
- The backend now has the scaffolding needed for the URL mapping model and the `POST /shorten` endpoint.
- Error and 404 responses are standardized, which will make the later API surface more consistent.
