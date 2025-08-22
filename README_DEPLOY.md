### Deploying ResumeCraft

This app includes an Express server and a Vite React client. In production, the server serves the client from `dist/public`.

#### Prerequisites
- Node 20.x
- Postgres database (Neon recommended)
- Environment variables
  - `PORT`: Port to run the server (default 5000)
  - `DATABASE_URL`: Postgres connection string (required)
  - `HUGGINGFACE_API_KEY`: Optional
  - `OPENAI_API_KEY`: Optional

#### Local Production Run
1. Install deps and build
```bash
cd ResumeCraft
npm ci
npm run build
```
2. Run the server
```bash
npm run start
```

#### Docker
Build and run:
```bash
# From repo root
docker build -f ResumeCraft/Dockerfile -t resumecraft:latest .

docker run --rm -p 5000:5000 \
  -e PORT=5000 \
  -e DATABASE_URL=postgres://user:pass@host/db \
  resumecraft:latest
```

#### Render (suggested)
- New Web Service
  - Root Directory: `ResumeCraft`
  - Build Command: `npm ci && npm run build`
  - Start Command: `npm run start`
  - Runtime: Node 20
- Environment Variables
  - `DATABASE_URL` (required)
  - `HUGGINGFACE_API_KEY` (optional)
  - `OPENAI_API_KEY` (optional)

The server binds to `0.0.0.0:${PORT}` and serves static assets from `dist/public`.
