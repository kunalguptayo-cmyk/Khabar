# Khabar

Your news. No noise.

Khabar is a multi-user news digest app with JWT auth. It fetches RSS sources on a schedule, deduplicates related stories, ranks them by each user's topic preferences, and serves a clean React UI.

## Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI |
| Frontend | React + Vite, served by nginx in production |
| Database | PostgreSQL |
| Queue | Redis + Celery |
| Embeddings | sentence-transformers, all-MiniLM-L6-v2 |
| Optional rewriting | Anthropic API |
| Local infrastructure | Docker Compose |

## Run Locally

Prerequisite: Docker Desktop installed and running.

```bash
docker compose up --build
```

Then open:

- App: http://localhost:5174
- Backend health: http://localhost:8001/health

The first digest can take a minute because the pipeline fetches feeds, downloads the embedding model, embeds articles, deduplicates them, and ranks the first set.

## Using Khabar

1. Open http://localhost:5174.
2. Create an account with any email and a password of at least 8 characters.
3. Log in to see your digest.
4. Use thumbs up/down to tune future ranking toward your interests.

Each account has independent preferences.

## Environment Variables

Local Docker Compose provides development defaults for required backend variables. For production, set these explicitly:

```bash
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
SECRET_KEY=your_random_32_byte_hex_secret
CORS_ORIGINS=https://your-frontend.up.railway.app
ANTHROPIC_API_KEY=optional
ANTHROPIC_MODEL=claude-3-haiku-20240307
ACCESS_TOKEN_EXPIRE_MINUTES=10080
```

Generate a secret:

```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

The frontend uses `VITE_API_URL` at build time:

```bash
VITE_API_URL=https://your-backend.up.railway.app
```

## Railway Deployment

The repository includes two Railway config files:

- `railway.toml` for the FastAPI backend service.
- `frontend/railway.toml` for the React/nginx frontend service.

### Backend service

```bash
npm install -g @railway/cli
railway login
railway init
railway add --plugin postgresql
railway add --plugin redis
railway up
```

Set backend environment variables in Railway:

```bash
SECRET_KEY=<output from python3 -c "import secrets; print(secrets.token_hex(32))">
DATABASE_URL=<provided by Railway Postgres>
REDIS_URL=<provided by Railway Redis>
CORS_ORIGINS=https://your-frontend.up.railway.app
```

After deploy, verify:

```bash
curl https://your-backend.up.railway.app/health
```

### Frontend service

In the Railway dashboard:

1. Create a new service from the GitHub repo.
2. Set the root directory to `frontend`.
3. Add `VITE_API_URL=https://your-backend.up.railway.app`.
4. Deploy.

After the frontend URL is available, add it to the backend service's `CORS_ORIGINS` and redeploy the backend if needed.

## Manual Pipeline Trigger

```bash
curl -X POST http://localhost:8001/api/pipeline/run
```

Celery Beat also runs this automatically every 30 minutes.

## Auth API

```bash
curl -X POST http://localhost:8001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"yourpassword"}'

curl -X POST http://localhost:8001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"yourpassword"}'

curl http://localhost:8001/api/digest/today \
  -H "Authorization: Bearer <your_token>"

curl -X POST http://localhost:8001/api/feedback \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"article_id":"<uuid>","feedback":"up"}'
```
