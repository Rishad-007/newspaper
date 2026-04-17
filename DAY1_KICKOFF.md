# Day 1 Kickoff: Exact Execution Checklist

This document is the operational playbook for Day 1 only.
Goal: complete project foundation without blocking future days.

## Day 1 Deliverable (must be true before ending the day)

- Supabase project exists and credentials are available.
- Local environment contract exists with all required variables.
- Core dependencies are installed.
- App constants for roles/status/locales are added.
- Project runs locally and passes lint/type-check baseline.
- README has a short Day 1 setup section.

## Timebox Plan

- Block 1 (60-90 min): Supabase project + credentials
- Block 2 (45-60 min): Local env contract + dependency install
- Block 3 (60-90 min): App constants + helper scaffolding
- Block 4 (30-45 min): Validate and document

## Preflight (5 minutes)

1. Confirm you are in repo root.
2. Confirm Node version is usable for Next.js 16.
3. Confirm package manager (`npm`) is available.

Run:

```bash
pwd
node -v
npm -v
```

Expected:

- `pwd` ends in `/newspaper`
- `node -v` is modern (Node 20+ recommended)
- `npm -v` returns a valid version

If Node is outdated:

- Install/update Node LTS via nvm or your preferred manager before continuing.

## Step A: Create Supabase project and capture credentials

1. Go to Supabase dashboard and create a new project.
2. Choose closest region to your users.
3. Save these values in a secure place:

- Project URL
- anon key
- service role key

Optional CLI setup (recommended later but can be done now):

```bash
# macOS Homebrew
brew install supabase/tap/supabase
supabase --version
```

If CLI is installed, login:

```bash
supabase login
```

Checkpoint A success criteria:

- You can open project settings and copy URL + keys.

## Step B: Install core dependencies

Run:

```bash
npm install @supabase/supabase-js @supabase/ssr zod clsx tailwind-merge @heroicons/react
```

Why each package:

- `@supabase/supabase-js`: Supabase client
- `@supabase/ssr`: App Router-friendly auth/session helpers
- `zod`: runtime input validation
- `clsx` + `tailwind-merge`: class composition utilities
- `@heroicons/react`: icons for admin/share UI

Checkpoint B success criteria:

- `package.json` and lockfile updated
- install command exits successfully

## Step C: Add local environment contract

1. Create `.env.local` (do not commit secrets).
2. Add placeholders:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Fill the first three values from Supabase dashboard.

4. Create or update `.env.example` with the same keys but empty values.

Checkpoint C success criteria:

- `.env.local` exists with real values locally
- `.env.example` exists without real secrets

## Step D: Add constants and naming rules

Create these files/folders if missing:

- `lib/constants/roles.ts`
- `lib/constants/article-status.ts`
- `lib/constants/locales.ts`
- `lib/constants/pagination.ts`

Use these values:

- Roles: `writer`, `editor`, `owner`
- Status: `draft`, `submitted`, `approved`, `published`, `rejected`
- Locales: `en`, `bn`
- Default pagination: page size 10 (adjust later)

Naming conventions to lock today:

- Table names: snake_case plural (example: `article_tags`)
- Route segments: kebab-case (example: `review-queue`)
- Storage bucket: `news-images`
- Slugs: lowercase, hyphen-separated

Checkpoint D success criteria:

- constants compile
- naming conventions documented in README

## Step E: Add minimal Supabase client scaffolding

Create initial scaffolding files:

- `lib/supabase/client.ts` (browser client)
- `lib/supabase/server.ts` (server client)
- `lib/supabase/env.ts` (env access and validation)

Rules:

- Do not hardcode secrets.
- Read env values through one place (`env.ts`).
- Fail fast on missing env values with clear error messages.

Checkpoint E success criteria:

- app can import these modules without runtime crash

## Step F: Validate Day 1 baseline

Run:

```bash
npm run lint
npm run build
```

If build fails:

1. Fix env/key access first.
2. Fix TypeScript import path issues.
3. Re-run lint and build.

Checkpoint F success criteria:

- lint passes
- build passes

## Step G: Document what was done

Update README with a new section:

- `Day 1 Setup`
- Required environment variables
- How to run app locally
- Where constants live
- Naming conventions locked today

Suggested commands for quick smoke:

```bash
npm run dev
```

Open `http://localhost:3000` and verify app loads.

## End-of-Day Verification Checklist

- [ ] Supabase project created
- [ ] URL/keys configured in local env
- [ ] Core dependencies installed
- [ ] `.env.example` added without secrets
- [ ] constants for roles/status/locales/pagination added
- [ ] minimal supabase client/server/env scaffolding added
- [ ] lint passes
- [ ] build passes
- [ ] README updated

## If You Get Blocked

Blocker: Supabase dashboard/keys unavailable

- Continue by creating `.env.example` and scaffolding with placeholder env values.
- Resume key wiring once credentials are available.

Blocker: OAuth setup confusion

- Skip OAuth setup today. OAuth is Day 5. Keep Day 1 focused on foundation.

Blocker: dependency install errors

- Delete `node_modules` and lockfile only if install is corrupted, then reinstall.
- Confirm Node version and retry.

## Commit Strategy for Day 1

Commit 1:

- dependency and env contract changes

Commit 2:

- constants and supabase scaffolding

Commit 3:

- README setup updates

Suggested commit messages:

- `chore: add supabase dependencies and env contract`
- `feat: add app constants and supabase client scaffolding`
- `docs: add day-1 setup instructions`
