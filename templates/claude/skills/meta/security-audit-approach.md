---
name: security-audit-approach
description: Start from data flow, find trust boundaries, verify validation at each.
triggers: security audit, threat model, review security, data flow, trust boundary
---

## Problem
Security reviews that grep for `eval` miss architectural holes. Following data from source to sink reveals real attack paths.

## Rule
- Map data flow: sources (request, webhook, upload), sinks (db, shell, template).
- Mark trust boundaries: HTTP handler, queue consumer, cross-service call.
- At each boundary, verify: authn, authz, input validation, output encoding.
- Check secrets: env only, never logs, never client bundle.
- Review dependencies: known CVEs, supply-chain risk for new ones.
- Produce findings with severity, impact, reproduction, and fix, not just descriptions.

## Example
```md
Finding [CRITICAL]: /api/import parses uploaded YAML with unsafe_load.

Data flow: POST /api/import -> import.py:14 yaml.load(req.body).
Trust boundary: public endpoint, no auth required.
Impact: RCE via YAML object tags.
Repro: curl -XPOST /api/import -d '!!python/object/apply:os.system ["id"]'
Fix: use yaml.safe_load; add auth; validate schema with Pydantic.
```
