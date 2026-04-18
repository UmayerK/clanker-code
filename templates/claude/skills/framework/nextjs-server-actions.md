---
name: nextjs-server-actions
description: When to use server actions vs route handlers; authenticate inside the action.
triggers: server action, use server, next.js mutation, form action, route handler
---

## Problem
Server actions simplify forms and mutations but are misused for public APIs and miss auth checks. The boundary between action and handler must be deliberate.

## Rule
- Server action: form mutations, revalidation, progressive-enhancement UI.
- Route handler: public API, webhooks, non-form clients, OAuth callbacks.
- Always authenticate and authorize inside the action body, not the caller.
- Validate inputs with a schema (Zod) at the action entry.
- Return a typed result `{ ok, data | error }`; do not throw for user errors.
- Call `revalidatePath` / `revalidateTag` on success for stale caches.

## Example
```ts
'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const Input = z.object({ title: z.string().min(1).max(120) });

export async function createPost(formData: FormData) {
  const session = await getSession();
  if (!session) return { ok: false, error: 'unauthorized' };
  const parsed = Input.safeParse({ title: formData.get('title') });
  if (!parsed.success) return { ok: false, error: 'invalid' };
  await db.post.create({ data: { ...parsed.data, authorId: session.userId } });
  revalidatePath('/posts');
  return { ok: true };
}
```
