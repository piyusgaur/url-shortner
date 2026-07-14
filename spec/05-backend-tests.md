# Step 5: Backend Tests

## Goal
Prove the backend behavior with automated tests.

## What to build
- Use Jest for test execution.
- Use Supertest for HTTP-level API testing.
- Cover success and failure cases for shortening and redirecting.
- Cover custom alias handling, duplicate URL behavior, and invalid URL validation.
- Cover unknown-code `404` behavior.

## What to avoid
- Do not write tests only for implementation details.
- Do not make tests overly coupled to database internals.

## Done when
- Core API paths are covered by tests.
- The tests document the intended behavior clearly.
- The suite can be run reliably from the command line.

## Suggested commit
- `test(backend): cover shorten and redirect flows`
