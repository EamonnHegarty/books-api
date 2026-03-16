# books-api

A RESTful API built with Node.js and TypeScript. The application itself is intentionally simple — the focus of this project is the infrastructure and DevOps pipeline that surrounds it.

Built to get hands-on experience with Docker, Terraform, GCP, and GitHub Actions CI/CD.

---

## What it does

Takes a natural language book query, uses Claude AI to transform it into an optimised search string, hits the Google Books API with that query and returns results.

**Example:** "I want a scary horror book set in space" → Claude transforms this to `intitle:horror space science fiction thriller` → Google Books returns matching results.

---

## Endpoints

| Method | Endpoint        | Description                                                  |
| ------ | --------------- | ------------------------------------------------------------ |
| GET    | `/health`       | Returns 200 OK with timestamp. Used for pipeline smoke tests |
| POST   | `/books/search` | Accepts a natural language query, returns book results       |
| GET    | `/books/:id`    | Returns a single book by Google Books ID                     |

### Example request

```bash
curl -X POST https://your-cloud-run-url/books/search \
  -H "Content-Type: application/json" \
  -d '{"query": "best books for learning python"}'
```

---

## Architecture

```
GitHub PR opened
      │
      ▼
GitHub Actions — run unit tests
      │
      ▼ (PR merged to main)
GitHub Actions — build Docker image
      │
      ▼
Push image to GCP Artifact Registry
      │
      ▼
Deploy to Cloud Run (staging)
      │
      ▼
Smoke test hits /health endpoint
      │
      ▼ (on pass)
Deploy to Cloud Run (production)
```

**Infrastructure** is defined in Terraform and provisioned on GCP:

- **Cloud Run** — serverless container hosting, scales to zero when idle
- **Artifact Registry** — stores Docker images
- **Secret Manager** — stores API keys, injected into Cloud Run at runtime

---

## Tech stack

| Layer            | Technology                        |
| ---------------- | --------------------------------- |
| Runtime          | Node.js + TypeScript              |
| Framework        | Express                           |
| AI               | Anthropic Claude API              |
| External API     | Google Books API                  |
| Testing          | Jest + Supertest                  |
| Containerisation | Docker (multi-stage build)        |
| Infrastructure   | Terraform                         |
| Cloud            | GCP Cloud Run + Artifact Registry |
| CI/CD            | GitHub Actions                    |

---

## Running locally

```bash
# Install dependencies
npm install

# Add environment variables
cp .env.example .env
# Fill in ANTHROPIC_API_KEY and GOOGLE_BOOKS_API_KEY

# Run in development
npm run dev

# Run tests
npm test

# Build and run with Docker
docker build -t books-api .
docker run -p 3000:3000 --env-file .env books-api
```

---

## Environment variables

| Variable               | Description                       |
| ---------------------- | --------------------------------- |
| `ANTHROPIC_API_KEY`    | Anthropic Console API key         |
| `GOOGLE_BOOKS_API_KEY` | GCP Books API key                 |
| `PORT`                 | Port to run on (defaults to 3000) |
