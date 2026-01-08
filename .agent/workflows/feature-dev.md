---
description: Standard workflow for developing new features
---

# Feature Development Workflow

## 1. Planning Phase
- [ ] Understand the Request: Read `rules.md`.
- [ ] Check Existing Code: Use `find_by_name` or `search` to understand context.
- [ ] Create Plan: Write `implementation_plan.md` (Artifact).
- [ ] User Review: `notify_user` if the plan is complex.

## 2. Implementation Phase
- [ ] Create Components: Follow Component Structure rules (Barrel exports, CSS isolation).
- [ ] Update Store: If global state is needed, update Zustand store types first.
- [ ] TDD (Optional but Recommended): Write a failing Playwright test for the new detailed flow.
- [ ] Code: Implement the feature.

## 3. Verification Phase
- [ ] Build: `npm run build` to check for type errors.
- [ ] Test: `npx playwright test` to verify.
- [ ] Verify UI: If visual, use `generate_image` or strictly ask user to check, but prefer automated checks for logic.

## 4. Finalization
- [ ] Cleanup: Remove unused imports.
- [ ] Commit: `git add . && git commit -m "feat: <description>"`
