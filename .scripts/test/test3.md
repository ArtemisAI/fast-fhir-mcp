# Test File 3 - Resume Test

This file tests the resume functionality of the gradual commit script.

## Purpose
Test that the script can properly resume from where it left off after interruption.

## Scenario
This should be the third file processed, testing:
- State persistence across script restarts
- Proper index tracking
- File skip logic for already committed files

## Test Data
```yaml
test_file: 3
purpose: resume_testing
expected_behavior: 
  - Should be processed only if test1.md and test2.md were committed
  - Should be skipped if already committed in previous run
  - Should respect timing intervals from last commit time
```

---
*Resume test file for gradual commit validation*
