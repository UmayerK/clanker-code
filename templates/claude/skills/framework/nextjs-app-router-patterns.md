---
name: nextjs-app-router-patterns
description: RSC by default; add 'use client' only when needed; metadata via export.
triggers: next.js, nextjs, app router, rsc, server component, use client, layout, metadata
---

## Problem
Overusing client components ships JS you do not need and loses server-side data access. App Router rewards keeping work on the server.

## Rule
- Server Component is the default; do not add 'use client' reflexively.
- Add 'use client' only for: useState, useEffect, event handlers, browser APIs.
- Push client components to leaves; keep parents server.
- Fetch data in server components with async/await; no useEffect for data.
- Use `generateMetadata` or static `metadata` export, not `<Head>`.
- Cache with `fetch` options or `unstable_cache`; revalidate intentionally.

## Example
```tsx
// app/users/page.tsx  (server component)
import { UsersList } from './users-list';
export const metadata = { title: 'Users' };

export default async function Page() {
  const users = await fetch('https://api/users', { next: { revalidate: 60 } }).then(r => r.json());
  return <UsersList initial={users} />;
}

// app/users/users-list.tsx
'use client';
import { useState } from 'react';
export function UsersList({ initial }) { /* ... */ }
```
