# URL Shortner

A full-stack URL shortener built with a focus on clear design decisions, simple APIs, and a clean user flow.

## What It Does

- Shortens long URLs into short codes
- Redirects short codes back to the original URL with a `301`
- Supports custom aliases
- Stores mappings in MongoDB
- Validates URLs before saving them
- Reuses the same short code when the same URL is shortened again
- Tracks lightweight analytics such as click count and last access time
- Lets you view analytics for a short code from the UI

## Tech Stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, TypeScript
- Database: MongoDB with Mongoose
- Testing: Jest, Supertest

## Project Structure

- `frontend/` - React UI for shortening URLs and viewing analytics
- `backend/` - Express API, MongoDB models, services, and tests
- `spec/` - step-by-step implementation specs and implementation notes
- `write-up.md` - required one-page submission write-up

## Architecture Overview

The app is split into two layers:

1. The frontend sends a `POST /shorten` request to create a short link.
2. The backend validates the URL, stores or reuses the mapping, and returns the short code.
3. Visitors use `GET /{code}` to resolve the short code.
4. The backend looks up the code in MongoDB and sends a `301` redirect to the original URL.
5. Redirect visits update `clickCount` and `lastAccessedAt`.
6. The frontend can request `GET /analytics/:code` to view the usage summary.

## Core Behavior

- Same URL shortened twice returns the same existing short code
- Custom aliases are treated as explicit short codes
- Invalid URLs are rejected
- Unknown codes return `404`
- Short codes are URL-safe and collision-checked

## API

### `POST /shorten`

Request body:

```json
{
  "url": "https://example.com",
  "alias": "launch-day"
}
```

Response:

```json
{
  "originalUrl": "https://example.com/",
  "shortCode": "launch-day",
  "shortUrl": "http://localhost:4000/launch-day",
  "created": true
}
```

### `GET /{code}`

- Redirects to the original URL with `301`
- Returns `404` if the code does not exist

### `GET /analytics/:code`

Returns the summary for a short code:

```json
{
  "originalUrl": "https://example.com/",
  "shortCode": "launch-day",
  "clickCount": 4,
  "lastAccessedAt": "2026-07-14T14:00:00.000Z",
  "createdAt": "2026-07-14T13:00:00.000Z",
  "updatedAt": "2026-07-14T14:00:00.000Z"
}
```

## Environment Variables

### Backend

Create `backend/.env` with:

```bash
PORT=4000
MONGODB_URI=mongodb://localhost:27017/url_shortner
CORS_ORIGIN=http://localhost:5173
```

- `PORT` - backend port
- `MONGODB_URI` - MongoDB connection string
- `CORS_ORIGIN` - optional comma-separated list of allowed frontend origins

### Frontend

Create `frontend/.env` if you want to point the UI at a different backend:

```bash
VITE_API_BASE_URL=http://localhost:4000
```

- `VITE_API_BASE_URL` - backend API base URL used by the frontend

## Setup

### 1. Install dependencies

From the repo root:

```bash
npm install
```

### 2. Configure environment

Add the backend and frontend env files shown above.

### 3. Run the backend

```bash
npm run dev:backend
```

### 4. Run the frontend

In a second terminal:

```bash
npm run dev:frontend
```

### 5. Open the app

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:4000/health`

## Testing

Run the available automated test suites from the repo root:

```bash
npm run test
```

You can also run the backend alone:

```bash
npm run test --workspace backend
```

The backend workspace contains the core Jest coverage for the service and API flows.
The frontend workspace is configured so its test command exits cleanly even though no
dedicated frontend tests have been added yet.

## Build

```bash
npm run build
```

This builds both workspaces:
- backend TypeScript build
- frontend production build

## Design Decisions

- Duplicate URL handling is intentional and idempotent
- Random URL-safe codes were chosen over sequential IDs
- Analytics are lightweight and stored with the mapping document
- The UI is intentionally focused on one primary flow instead of a dashboard
- The repo is split into small milestone specs to make the commit history easy to review

## Notes for Reviewers

- The project was built in incremental steps rather than one large commit.
- The required write-up is included in [write-up.md](./write-up.md).
- The implementation notes for each milestone live under `spec/`.
