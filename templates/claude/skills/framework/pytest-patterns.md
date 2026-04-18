---
name: pytest-patterns
description: Fixtures for setup, parametrize for cases, conftest for shared fixtures.
triggers: pytest, python test, fixture, parametrize, conftest, test organization
---

## Problem
Repeated setup code in every test and copy-pasted cases hide intent and create brittle tests. Fixtures and parametrization keep tests focused.

## Rule
- Use `@pytest.fixture` for setup/teardown; scope it (`function`, `module`, `session`).
- Share fixtures via `conftest.py` at the appropriate directory level.
- Use `@pytest.mark.parametrize` for the same test with many inputs.
- Name tests `test_behavior_when_condition`; one behavior per test.
- Prefer `tmp_path` and `monkeypatch` over ad-hoc globals.
- Use markers (`slow`, `integration`) and opt in via `-m`.

## Example
```python
import pytest

@pytest.fixture
def user(db):
    return db.users.create(email="a@b.c")

@pytest.mark.parametrize("qty,expected", [(1, 10), (3, 30), (0, 0)])
def test_cart_total(qty, expected):
    assert cart_total([{"price": 10, "qty": qty}]) == expected

def test_delete_requires_admin(user, client):
    r = client.delete(f"/users/{user.id}")
    assert r.status_code == 403
```
