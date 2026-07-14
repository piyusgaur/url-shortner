# Step 6 Implementation: Frontend App

## What was implemented
- Replaced the placeholder screen with a real URL shortener form.
- Added inputs for the long URL and optional custom alias.
- Wired the form to the backend `POST /shorten` API with a small fetch helper.
- Added loading, success, and error states.
- Displayed the generated short URL as a clickable result after success.
- Gave the page a more intentional visual treatment so it feels like a real product rather than a default scaffold.

## Decisions made
- Used a small `api.ts` helper so the UI stays focused on presentation and form state.
- Read the backend base URL from `VITE_API_BASE_URL` with a sensible local default.
- Kept the alias field visible and optional instead of hiding it behind advanced UI, because the backend supports it and the assignment mentions it explicitly.
- Kept the screen to one strong user flow instead of building a dashboard, since the take-home values clarity over feature bloat.

## Tradeoffs
- I did not add copy-to-clipboard or a link history panel, because they are useful but not required for the core flow.
- I used the browser's built-in URL validation plus backend validation rather than duplicating complex parsing logic in the UI.
- I kept the frontend dependency surface small and did not introduce a form library, which makes the code easier to read and explain.

## Notes for the next step
- The frontend can now call the backend end to end.
- The interface is ready for polish/documentation work, and the API contract is visible from the form behavior.
