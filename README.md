# Newspaper

Next.js 16 foundation for a bilingual newspaper platform.

## Day 1 Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create `.env.local` in the project root with the following keys:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`lib/supabase/env.ts` validates these values at runtime and throws clear errors when they are missing.

### 3) Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

### 4) Validate baseline

```bash
npm run lint
npm run build
```

## Day 1 Foundation Files

- Constants:
	- `lib/constants/roles.ts`
	- `lib/constants/article-status.ts`
	- `lib/constants/locales.ts`
	- `lib/constants/pagination.ts`
- Supabase scaffolding:
	- `lib/supabase/env.ts`
	- `lib/supabase/client.ts`
	- `lib/supabase/server.ts`

## Naming Conventions (Locked)

- Table names: snake_case plural (example: `article_tags`)
- Route segments: kebab-case (example: `review-queue`)
- Storage bucket: `news-images`
- Slugs: lowercase, hyphen-separated
