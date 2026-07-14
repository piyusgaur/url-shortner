import { FormEvent, useState } from "react";
import { shortenUrl } from "./api.js";

const DEFAULT_API_BASE_URL = "http://localhost:4000";

function validateUrl(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Enter a URL to shorten.";
  }

  try {
    const parsed = new URL(trimmed);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "Use an http or https URL.";
    }

    return null;
  } catch {
    return "Enter a valid URL, like https://example.com.";
  }
}

function validateAlias(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (!/^[A-Za-z0-9_-]{3,64}$/.test(trimmed)) {
    return "Alias should be 3-64 characters and use letters, numbers, underscores, or dashes.";
  }

  return null;
}

export default function App() {
  const [longUrl, setLongUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatusMessage("");

    const urlError = validateUrl(longUrl);
    if (urlError) {
      setError(urlError);
      return;
    }

    const aliasError = validateAlias(alias);
    if (aliasError) {
      setError(aliasError);
      return;
    }

    setLoading(true);

    try {
      const result = await shortenUrl({
        apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
        url: longUrl,
        alias: alias.trim() === "" ? undefined : alias.trim(),
      });

      setShortUrl(result.shortUrl);
      setStatusMessage(result.created ? "New short link created." : "That URL already had a short link.");
      setLongUrl("");
      setAlias("");
    } catch (submitError) {
      setShortUrl("");
      setError(
        submitError instanceof Error ? submitError.message : "Something went wrong while shortening the URL."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">URL Shortner</p>
          <h1>Short links, without the clutter.</h1>
          <p className="lead">
            Paste a long URL, optionally add a custom alias, and get back a clean short link you can share
            immediately.
          </p>
          <div className="feature-strip" aria-label="Key features">
            <span>Validates URLs</span>
            <span>Supports aliases</span>
            <span>Returns reusable short links</span>
          </div>
        </div>

        <form className="card form-card" onSubmit={handleSubmit}>
          <p className="form-intro">
            Shorten a link and immediately test the redirect by opening the generated URL.
          </p>

          <label className="field">
            <span>Long URL</span>
            <input
              type="url"
              placeholder="https://example.com/very/long/path"
              value={longUrl}
              onChange={(event) => setLongUrl(event.target.value)}
              autoComplete="off"
              required
            />
          </label>

          <label className="field">
            <span>Custom alias <span className="muted">(optional)</span></span>
            <input
              type="text"
              placeholder="launch-day"
              value={alias}
              onChange={(event) => setAlias(event.target.value)}
              autoComplete="off"
            />
          </label>

          <div className="actions">
            <button type="submit" disabled={loading}>
              {loading ? "Shortening..." : "Create short link"}
            </button>
          </div>

          {error ? (
            <div className="message message-error" role="alert">
              {error}
            </div>
          ) : null}

          {statusMessage ? (
            <div className="message message-success" role="status">
              {statusMessage}
            </div>
          ) : null}

          {shortUrl ? (
            <div className="result">
              <span className="result-label">Your short URL</span>
              <a className="result-link" href={shortUrl} target="_blank" rel="noreferrer">
                {shortUrl}
              </a>
              <p className="result-note">
                Open the link to confirm the redirect is working end to end.
              </p>
            </div>
          ) : null}
        </form>
      </section>
    </main>
  );
}
