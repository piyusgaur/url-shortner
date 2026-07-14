# Step 2: Backend Foundation

## Goal
Create the backend skeleton and the basic Express server shape.

## What to build
- Set up an Express app in TypeScript.
- Add a health check route such as `GET /health`.
- Add centralized error handling.
- Add request parsing, logging, and basic middleware.
- Connect the app to MongoDB using the chosen driver or Mongoose.

## What to avoid
- Do not add shortening business logic yet.
- Do not add frontend integration yet.
- Do not expose database internals in API responses.

## Done when
- The backend starts cleanly.
- The health route responds successfully.
- MongoDB connection is established through app startup.

## Suggested commit
- `feat(backend): initialize express server and database connection`
