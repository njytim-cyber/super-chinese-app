---
description: Workflow to run at the beginning of a session
---

# Session Startup

## 1. Environment Check
- [ ] Check `node_modules` exists.
- [ ] Check `.env` exists (if applicable).

## 2. Dependencies
// turbo
- [ ] Install missing deps: `npm install` (Only if package.json changed or node_modules missing)

## 3. Server
// turbo
- [ ] Start Dev Server: `npm run dev` (Check if already running first).

## 4. Security Audit
- [ ] Run `npm audit` to check for high severity vulnerabilities.
