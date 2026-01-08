---
description: Workflow to run before ending a session
---

# Session Handoff

## 1. Code Quality
- [ ] Run Linter: `npm run lint` (if configured).
- [ ] Verify Build: `npm run build`.

## 2. Testing
- [ ] Run Regression: `npx playwright test`.

## 3. Documentation
- [ ] Update `task.md`: Mark completed tasks.
- [ ] Update `walkthrough.md`: If significant UI changes were made.
- [ ] Update `rules.md`: If new patterns were established.

## 4. Git
- [ ] Check Status: `git status`.
- [ ] Commit Work: Ensure all work is committed. `git commit -am "chore: session handoff"`.
