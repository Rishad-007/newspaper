# Day 4: Supabase Integration in Next.js

**Date:** 17 April 2026  
**Duration:** ~2 hours  
**Status:** ✅ Complete  
**Output:** Auth-aware helpers, protected routes, centralized error handling, admin dashboard skeleton

---

## Objectives (from plan.md)

- Add server and browser Supabase clients with App Router-compatible utilities. ✅
- Add auth-aware helper functions for server components/actions. ✅
- Add protected route strategy for admin section. ✅
- Define centralized error format for DB/auth actions. ✅

---

## What Was Built

### 1. **Centralized Error Handling** (`lib/auth/errors.ts`)

Defines app-wide error types and factory functions to ensure consistent error handling across server and client.

**Exports:**

- `AppErrorType` enum: AUTH_REQUIRED, UNAUTHORIZED, NOT_FOUND, VALIDATION_ERROR, DATABASE_ERROR, UNKNOWN
- `AppError` interface: Typed error object with statusCode and original error context
- Factory functions: `createAuthError()`, `createUnauthorizedError()`, `createValidationError()`, etc.
- Utilities: `isAppError()`, `getErrorMessage()`, `logError()`

**Usage in Server Actions:**

```typescript
import { createAuthError, logError } from "@/lib/auth/errors";

export async function publishArticle(articleId: number) {
  try {
    // ... publish logic
  } catch (error) {
    logError("publishArticle", error);
    throw createDatabaseError(
      "Failed to publish article",
      error instanceof Error ? error : undefined,
    );
  }
}
```

---

### 2. **Server-Side Auth** (`lib/auth/server.ts`)

Provides server-side session management and role verification for Server Components and Server Actions.

**Exports:**

- `SessionUser` interface: { id, email?, role?, displayName?, avatarUrl? }
- `getSession()`: Returns current user or null (no throw)
- `requireAuth()`: Throws if not authenticated
- `requireRole(role)`: Throws if user lacks required role
- `requireEditor()`, `requireOwner()`: Convenience wrappers

**Role Hierarchy:** writer (1) < editor (2) < owner (3)

**Usage in Server Components:**

```typescript
import { getSession } from "@/lib/auth/server";

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    return <p>Please log in</p>;
  }

  return <p>Welcome, {session.email}</p>;
}
```

**Usage in Server Actions:**

```typescript
import { requireEditor } from "@/lib/auth/server";
import { createUnauthorizedError } from "@/lib/auth/errors";

export async function approveArticle(articleId: number) {
  const session = await requireEditor(); // Throws if not editor+
  // ... safe to proceed
}
```

---

### 3. **Client-Side Auth Hooks** (`lib/auth/hooks.ts`)

Provides React hooks for reading auth state in Client Components.

**Exports:**

- `useAuth()`: Returns { user, isLoading, error }
- `useIsAuthenticated()`: Boolean hook
- `useHasRole(role)`: Check specific role or higher
- `useIsEditor()`, `useIsOwner()`: Convenience hooks
- `useSignOut()`: Sign out and redirect

**Usage in Client Components:**

```typescript
"use client";

import { useAuth, useIsEditor } from "@/lib/auth/hooks";

export function ProfileCard() {
  const { user, isLoading } = useAuth();
  const isEditor = useIsEditor();

  if (isLoading) return <p>Loading...</p>;
  if (!user) return <p>Not signed in</p>;

  return (
    <div>
      <p>{user.email}</p>
      {isEditor && <button>Approve Articles</button>}
    </div>
  );
}
```

**Auth State Subscription:**

- Automatically subscribes to Supabase auth state changes
- Syncs user role from profiles table on every session
- Unsubscribes on cleanup to prevent memory leaks

---

### 4. **Route Protection Middleware** (`middleware.ts`)

Protects `/admin/*` routes from unauthenticated access.

**Behavior:**

- Routes not matching `/admin/:path*` pass through unchanged
- Routes matching `/admin/:path*` check for `sb-auth-token` cookie
- If missing, redirects to `/login?redirectTo=/admin/original-path`
- If present, allows request to proceed (detailed role check happens in layout)

**Limitations:**

- Only checks session existence, not role
- Detailed role enforcement happens in layout/page (Server Component)

---

### 5. **Admin Layout with Access Control** (`app/(admin)/layout.tsx`)

Server Component layout that enforces writer+ role on all admin routes.

**Features:**

- Calls `requireRole("writer")` to enforce minimum writer role
- Redirects to `/login` if not authenticated
- Provides admin header and content wrapper
- Safe for nested admin pages (articles, review queue, etc.)

**Structure:**

```
/admin
  /layout.tsx      (enforces auth, renders header)
  /page.tsx        (admin dashboard)
  /articles/       (nested admin pages)
  /review-queue/   (nested admin pages)
  /settings/       (nested admin pages)
```

---

### 6. **Admin Dashboard Skeleton** (`app/(admin)/page.tsx`)

Stub dashboard showing welcome message and navigation cards.

**Features:**

- Displays current user email and role
- Shows placeholder cards for Articles, Review Queue, Categories
- Server Component (can read session safely)

---

## Architecture Decisions

### Why Separate `useAuth()` from `getSession()`?

- **Server:** `getSession()` is async, safe to call from Server Components/Actions, returns null on failure
- **Client:** `useAuth()` is a hook, manages loading/error state, automatically syncs with auth changes
- **Design:** No mixing of Server and Client patterns; each layer has idiomatic APIs

### Why Middleware + Layout for Route Protection?

- **Middleware:** Catches unauthenticated users early (before Server Component render)
- **Layout:** Enforces detailed role rules (writer+ vs editor+ vs owner)
- **Two-layer defense:** Fast cookie check + detailed database check

### Error Handling Pattern

- Server Actions throw `AppError` objects
- Client catches and displays via UI state
- Server Components use `getSession()` (no throw) or `requireAuth()` (throw on failure)
- Consistent error logging via `logError(context, error)`

---

## Testing Checklist

Run these smoke tests before Day 5:

### Auth Flows

- [ ] Log in as writer → redirect to `/admin`
- [ ] Log in as editor → redirect to `/admin`
- [ ] Log in as owner → redirect to `/admin`
- [ ] Log out → redirect to `/`
- [ ] Visit `/admin` unauthenticated → redirect to `/login`
- [ ] Sign in from `/admin` → stay on admin

### Component Tests

- [ ] `useAuth()` hook: loads user, shows email and role
- [ ] `useIsEditor()`: true only for editor/owner
- [ ] `useIsOwner()`: true only for owner
- [ ] Admin header: displays user email

### Error Handling

- [ ] Invalid env var → see clear error message on startup
- [ ] Unauthorized action → see 403 message
- [ ] Network error → see useful error text

---

## Files Created

```
lib/auth/
  ├── errors.ts          (error types + factories)
  ├── server.ts          (server session + role checks)
  └── hooks.ts           (client auth hooks)

app/(admin)/
  ├── layout.tsx         (auth enforcement + header)
  └── page.tsx           (dashboard skeleton)

middleware.ts            (route protection)
```

---

## Next Steps (Day 5)

- Build auth UI: sign-up and sign-in pages
- Add Google OAuth callback handling
- Add session persistence and redirect logic post-login
- Add form validation and error messages
- Test both email/password and Google flows

---

## Common Patterns

### Protect a Server Action

```typescript
import { requireEditor } from "@/lib/auth/server";
import { createUnauthorizedError } from "@/lib/auth/errors";

export async function deleteArticle(articleId: number) {
  const session = await requireEditor(); // throws on unauthorized
  // ... now safe to proceed
}
```

### Conditionally Render in Client Component

```typescript
"use client";
import { useIsEditor } from "@/lib/auth/hooks";

export function ApproveButton() {
  const isEditor = useIsEditor();
  if (!isEditor) return null;
  return <button onClick={() => approve()}>Approve</button>;
}
```

### Display User in Any Component (Server)

```typescript
import { getSession } from "@/lib/auth/server";

export async function UserGreeting() {
  const session = await getSession();
  return <p>Hi {session?.email || "Guest"}</p>;
}
```

---

## Summary

Day 4 established a **two-layer auth pattern**:

1. **Server layer** (getSession, requireRole) validates auth at data access time
2. **Client layer** (useAuth, useIsEditor) drives UI reactivity and role visibility
3. **Middleware** redirects unauthenticated browsers before Server Components run
4. **Errors** are typed and logged consistently
5. **Admin section** is protected and extensible for Day 6+ work

Auth infrastructure is **stable and testable**. Ready for Day 5 (auth UI).
