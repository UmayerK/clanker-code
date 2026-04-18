---
name: react-state-colocation
description: Lift state only as high as needed. Avoid global state unless truly shared.
triggers: state, context, redux, zustand, global state, prop drilling, lifting state
---

## Problem
State lifted too high re-renders half the tree. State put in global store becomes an implicit dependency everyone reads. Keep it local until proven shared.

## Rule
- Start with state inside the component that uses it.
- Lift only when two siblings need the same value; lift to their nearest common parent.
- Reach for Context or a store only when >2 distant consumers truly share state.
- Prefer server state (React Query, RSC) over client state for data.
- URL is a great state store for filters, pagination, tabs.
- Split large contexts by concern to avoid cascading re-renders.

## Example
```tsx
// Overkill: global store for a dropdown
const useDropdownStore = create(...);

// Better: local
function Dropdown() {
  const [open, setOpen] = useState(false);
  return <button onClick={() => setOpen(o => !o)}>...</button>;
}

// Shared filters across pages: URL
const params = useSearchParams();
const q = params.get('q') ?? '';
```
