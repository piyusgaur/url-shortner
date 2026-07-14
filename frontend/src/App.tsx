import { FormEvent, useState } from "react";
import { shortenUrl } from "./api.js";

const DEFAULT_API_BASE_URL = "http://localhost:4000";

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
        </div>

        <form className="card form-card" onSubmit={handleSubmit}>
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
            </div>
          ) : null}
        </form>
      </section>
    </main>
  );
}
