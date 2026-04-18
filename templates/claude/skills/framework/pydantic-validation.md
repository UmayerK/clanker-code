---
name: pydantic-validation
description: Strict Pydantic models at boundaries. Separate request, response, and DB models.
triggers: pydantic, basemodel, validation, fastapi, schema, request model, response model
---

## Problem
Reusing one model for request, DB row, and response leaks internal fields and weakens validation. Boundary-specific models stop that.

## Rule
- One model per role: `UserCreate` (input), `UserOut` (output), `UserDB` (persistence).
- Enable strict mode: disallow extras on input (`model_config = {"extra": "forbid"}`).
- Use `Field` constraints: min_length, ge, le, pattern.
- Validate at the edge; trust parsed models internally.
- Never send DB models directly; map to `*Out` models to hide internals.
- Use `Annotated` + custom validators for cross-field rules.

## Example
```python
from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    model_config = {"extra": "forbid"}
    email: EmailStr
    password: str = Field(min_length=12)

class UserOut(BaseModel):
    id: int
    email: EmailStr
    # password never exposed

@app.post("/users", response_model=UserOut)
def create(body: UserCreate): ...
```
