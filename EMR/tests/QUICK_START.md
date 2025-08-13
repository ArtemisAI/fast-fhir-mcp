# EMR Testing Quick Start Guide

## Overview
This guide helps you quickly set up and run the comprehensive test suite for the CarePulse EMR system.

## Prerequisites Check
Before running tests, ensure you have:
- [ ] Node.js 18+ installed
- [ ] EMR project dependencies installed
- [ ] Development server can start successfully

## Quick Setup

### 1. Install Test Dependencies
```bash
cd G:\projects\_School\fhir-mcp\EMR

# Install all required testing packages
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test @types/jest jest jest-environment-jsdom

# Install Playwright browsers
npm run test:install
```

### 2. Verify Environment
```bash
# Test that the app starts
npm run dev

# Should see: "Local: http://localhost:3000"
# Ctrl+C to stop
```

### 3. Run Quick Smoke Test
```bash
# Test the test infrastructure
npm test -- --passWithNoTests

# Should show: "No tests found" (this is expected and good)
```

## Test Execution Commands

### Unit Tests (Fastest - ~2 minutes)
```bash
# Run all unit tests
npm run test:unit

# Run specific test file
npm test tests/unit/validation.test.ts

# Run with coverage report
npm run test:coverage
```

### Integration Tests (~5 minutes)
```bash
# Run all integration tests
npm run test:integration

# Run with verbose output
npm test tests/integration -- --verbose
```

### End-to-End Tests (~10 minutes)
```bash
# Run E2E tests (starts dev server automatically)
npm run test:e2e

# Run with browser visible (for debugging)
npm run test:e2e:headed

# Run interactive UI mode
npm run test:e2e:ui
```

### Complete Test Suite (~15 minutes)
```bash
# Run everything
npm run test:all
```

## Common Test Scenarios

### Scenario 1: "I want to test if forms work"
```bash
# Test form validation
npm test tests/unit/validation.test.ts

# Test form components (when created)
npm test tests/unit/components/PatientForm.test.tsx

# Test full form flow E2E
npm run test:e2e -- --grep "patient registration"
```

### Scenario 2: "I want to test API integrations"
```bash
# Test all action functions
npm test tests/integration/actions.test.ts

# Run with detailed output
npm test tests/integration -- --verbose
```

### Scenario 3: "I want to test the admin dashboard"
```bash
# E2E admin tests
npm run test:e2e -- --grep "admin"

# Run in headed mode to see what happens
npm run test:e2e:headed -- --grep "admin"
```

### Scenario 4: "I want to test mobile responsiveness"
```bash
# Run mobile-specific tests
npm run test:e2e -- --project="Mobile Chrome"

# Test all mobile devices
npm run test:e2e -- --grep "responsive"
```

## Troubleshooting

### Problem: "Cannot find module '@testing-library/react'"
**Solution**: 
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### Problem: "Playwright browsers not installed"
**Solution**:
```bash
npm run test:install
# or
npx playwright install
```

### Problem: "Port 3000 is already in use"
**Solution**:
```bash
# Kill existing process
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

### Problem: "Tests fail with network errors"
**Solution**:
```bash
# Check if development server is running
npm run dev

# In another terminal, run tests
npm run test:e2e
```

### Problem: "Jest tests fail with import errors"
**Solution**:
1. Check that `tests/jest.config.js` exists
2. Verify `tests/jest.setup.js` is properly configured
3. Ensure all test files end with `.test.ts` or `.spec.ts`

## Test Results Location

### Coverage Reports
- **HTML Report**: `tests/coverage/lcov-report/index.html`
- **Console Summary**: Displayed after running `npm run test:coverage`

### Playwright Reports
- **HTML Report**: `playwright-report/index.html`
- **JSON Results**: `tests/results/test-results.json`
- **JUnit XML**: `tests/results/results.xml`

### Screenshots and Videos
- **Failed Test Screenshots**: `test-results/`
- **Failed Test Videos**: `test-results/`
- **Traces**: `test-results/` (open with `npx playwright show-trace`)

## Success Indicators

### ✅ Tests are working if you see:
- Unit tests pass with coverage report
- Integration tests complete without errors
- E2E tests pass across all browsers
- No critical console errors
- All forms validate correctly

### ❌ Tests need attention if you see:
- Import/module errors
- Network timeouts
- Browser launch failures
- Multiple test failures
- Low coverage warnings

## Next Steps

### After Tests Pass:
1. Review coverage reports for gaps
2. Add any missing test cases
3. Document any known issues
4. Proceed with FHIR integration development

### If Tests Fail:
1. Check the troubleshooting section
2. Review error messages carefully
3. Fix one category at a time (unit → integration → e2e)
4. Re-run tests after each fix

## Emergency Test Commands

### When Everything Breaks:
```bash
# Reset everything
rm -rf node_modules tests/coverage test-results playwright-report
npm install
npm run test:install

# Verify basic functionality
npm run dev
# Test manually in browser: http://localhost:3000

# Run minimal test
npm test -- --passWithNoTests
```

### Quick Health Check:
```bash
# 30-second health check
npm run test:unit -- --testTimeout=5000
npm run test:e2e -- --timeout=10000 --grep="should load home page"
```

---

**Remember**: These tests validate your current EMR system functionality. Once all tests pass, you'll have a stable baseline for implementing FHIR integration with confidence!
