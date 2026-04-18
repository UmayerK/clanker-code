---
name: flask-patterns
description: Use blueprints for structure and the app factory pattern for creation.
triggers: flask, blueprint, app factory, create_app, wsgi, python web
---

## Problem
Single-file Flask apps become a mess at scale, and module-level `app = Flask(__name__)` breaks testing and multiple configs.

## Rule
- Use `create_app(config)` factory; no module-level app instance.
- Organize routes into blueprints per domain (auth, api, admin).
- Load config via a class or env-driven object, not literal strings.
- Initialize extensions on the app inside the factory.
- Use `g` for request-scoped objects; never module globals for per-request state.
- Keep view functions thin; push logic to service modules.

## Example
```python
# app/__init__.py
def create_app(config_name="default"):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    db.init_app(app)
    from .auth import bp as auth_bp
    from .api import bp as api_bp
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(api_bp, url_prefix="/api")
    return app

# tests
def test_login():
    app = create_app("testing")
    client = app.test_client()
    ...
```
