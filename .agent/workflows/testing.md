---
description: Workflow for executing tests with a focus on headless Playwright
---

# Testing Workflow

## 1. Quick Check
- [ ] Run Unit/Integration Tests: `npm test` (if available).

## 2. E2E Testing (Preferred)
- [ ] **Run Headless**: `npx playwright test`
    - This is the DEFAULT mode (configured in `playwright.config.ts`). It is faster and doesn't steal focus.
- [ ] Check Report: If strict failures, open report `npx playwright show-report` (Ask user permission first as it opens browser).

## 3. Debugging Failures
- [ ] If headless fails, try running specific test file: `npx playwright test tests/my-feature.spec.ts`
- [ ] Read error logs carefully.
- [ ] Fix code.
- [ ] Rerun.

## 4. UI/Visual Verification
- [ ] Only if logic tests pass but visual alignment is in question.
