# Step 1 Implementation: Project Bootstrap

## What was implemented
- Established a workspace-based repo layout with `frontend/`, `backend/`, and `spec/`.
- Added starter package manifests and TypeScript configs for both apps.
- Created a minimal React shell so the frontend has a real entry point.
- Created a minimal Express shell with a health route so the backend can be started and verified.
- Added example environment files for both apps.
- Updated the root README and ignore rules for a clean first milestone.

## Decisions made
- Chose Vite for the frontend because it gives a fast React + TypeScript dev loop with little setup.
- Chose Express for the backend because the assignment is API-focused and the framework stays easy to explain.
- Chose MongoDB as the future datastore path because it fits the shortener document model and alias lookups cleanly.
- Kept the first step intentionally thin: only scaffolding, not business logic.
- Used npm workspaces so the repo can run both apps from one root without needing a monorepo tool.

## Tradeoffs
- I did not run dependency installation yet, so the manifests are ready but the environment is still lightweight.
- I used placeholder UI and backend logic to keep the bootstrap step focused on structure rather than features.
- I added basic testing hooks now, even though the real test coverage will come in later specs, so the project is test-ready from the start.

## Notes for the next step
- The backend already has a health route and MongoDB connection wiring, which makes the next spec easier to build.
- The frontend shell is intentionally simple so the URL-shortening form can replace it without reworking the app layout.
