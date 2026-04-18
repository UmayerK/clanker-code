---
name: document-patterns
description: README structure, API doc conventions, write for the target audience.
triggers: readme, docs, documentation, api reference, guide, tutorial, changelog
---

## Problem
Docs written for the author, not the reader, get skipped. Structure and audience focus make them usable.

## Rule
- Start every doc with: who it is for, what they will achieve.
- README order: tagline, quickstart, install, usage, config, contributing, license.
- API reference: one section per endpoint/method; request, response, errors, example.
- Show working examples; every snippet should be copy-pasteable.
- Use task-oriented headings ("Deploy to Vercel"), not noun headings ("Deployment").
- Keep docs next to code; stale docs are worse than no docs.

## Example
```md
# acme-cli
Zero-config CLI for deploying Acme apps.

## Quickstart
\`\`\`bash
npx acme deploy ./app
\`\`\`

## Install
npm i -g acme-cli  (Node >= 18)

## Usage
### Deploy an app
\`\`\`bash
acme deploy <dir> --env=prod
\`\`\`

### Configure env vars
See [Config](#config).
```
