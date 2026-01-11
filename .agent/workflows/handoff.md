---
description: Workflow to run before ending a session
---

# Session Handoff

## 1. Code Quality
// turbo
- [ ] TypeScript Check: `npx tsc --noEmit`
- [ ] Run Linter: `npx eslint src --ext .ts,.tsx --max-warnings 100`
// turbo
- [ ] Security Audit: `npm audit`

## 2. Testing
- [ ] Run Tests: `npx playwright test --reporter=list`
- [ ] Verify critical paths work in browser

## 3. Documentation
- [ ] Update `task.md` in brain artifacts
- [ ] Create/Update `walkthrough.md` with:
  - Branch name and PR link
  - Key files modified
  - Pending items
  - How to continue
- [ ] Update `rules.md` if new patterns established

## 4. Git
// turbo
- [ ] Check Status: `git status`
- [ ] Create Feature Branch: `git checkout -b feature/[name]`
- [ ] Commit: `git add -A && git commit -m "[type]: [description]"`
- [ ] Push: `git push -u origin [branch]`

## 5. Lessons Learned (Update as needed)
- Always verify TypeScript builds before committing
- Use `npm audit` to catch security issues early
- Feature branches protect main from incomplete work
- Zustand stores need explicit type exports
