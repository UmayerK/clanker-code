---
name: fastapi-dependency-injection
description: Use Depends() for auth, db sessions, and config. Avoid module globals.
triggers: fastapi, depends, dependency, auth, db session, starlette, python api
---

## Problem
Module globals and ad-hoc auth checks make FastAPI routes hard to test and easy to misuse. `Depends()` makes wiring explicit and overridable.

## Rule
- Inject auth via `Depends(get_current_user)`; never read the token inside the handler.
- Inject DB sessions via `Depends(get_db)`; yield for per-request scope.
- Inject config via `Depends(get_settings)` so tests can override.
- Override dependencies in tests with `app.dependency_overrides`.
- Keep dependencies small and composable; compose them for roles (e.g., `require_admin`).
- Avoid global singletons for anything request-scoped.

## Example
```python
from fastapi import Depends, FastAPI, HTTPException

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

def get_current_user(token: str = Depends(oauth2), db=Depends(get_db)):
    user = resolve(token, db)
    if not user: raise HTTPException(401)
    return user

def require_admin(user=Depends(get_current_user)):
    if not user.is_admin: raise HTTPException(403)
    return user

@app.delete("/users/{id}")
def delete_user(id: int, _=Depends(require_admin), db=Depends(get_db)): ...
```
