# AI Case Manager — Prototype

A minimal, readable skeleton for an AI Case Manager platform: static frontend
served by **Cloudflare Pages**, with a small **Pages Functions** API. Built with
vanilla HTML/JS and no heavy dependencies.

> **Demo only.** No real PHI. Placeholder auth, no real document storage.

## Structure

```
ai-case-manager/
├── public/               # Static frontend (deployed as Pages assets)
│   ├── index.html        # Home / overview
│   ├── patient.html      # Patient profile form (name, DOB, phone, insurance)
│   ├── upload.html       # File-upload stub (TODO: R2 + encryption in production)
│   └── admin.html        # Admin login (stub auth, demo only)
├── functions/            # Cloudflare Pages Functions (API)
│   └── api/
│       ├── patient.js    # GET/POST /api/patient — profile storage
│       └── login.js      # POST /api/login — placeholder password check
├── wrangler.toml         # Pages config + D1 binding (database_id filled in later)
└── package.json          # npm scripts (dev/deploy via wrangler)
```

## Run locally

```bash
npm run dev        # npx wrangler pages dev public --port 8788
```

Then open http://localhost:8788. The patient API works out of the box using a
JSON stand-in when no D1 binding is configured (see `functions/api/patient.js`).

## Deploy to Cloudflare (GitHub integration)

1. Push this repo to GitHub (already done: `github.com/ofm34/ai-case-manager`).
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Import from GitHub**.
3. Select the `ofm34/ai-case-manager` repo and the `main` branch.
4. Build settings:
   - Build command: *(none)*
   - Build output directory: `public`
5. Deploy. Future pushes to `main` auto-deploy.

## Next steps

- **D1 (database):** `npx wrangler d1 create ai-case-manager-db`, paste the returned
  `database_id` into `wrangler.toml`, create the `patients` table with a migration
  (`wrangler d1 execute ... --local/--remote`), and switch `functions/api/patient.js`
  fully onto the `env.DB` code path (the stand-in path can then be removed).
- **R2 (document storage):** replace the upload stub in `public/upload.html` with a
  real `POST /api/upload` function that writes objects to an R2 bucket. R2 objects
  are encrypted at rest; before any real PHI, add customer-managed encryption keys
  and per-object access controls.
- **Real authentication:** replace the placeholder password check in
  `functions/api/login.js` with Cloudflare Access or a proper session/token flow.
- **Agents SDK:** the long-term goal is AI case-management agents; see the Cloudflare
  Agents SDK (https://developers.cloudflare.com/agents/) for building stateful AI
  workers on top of this platform.
