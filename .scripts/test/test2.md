# Test File 2

This is the second test markdown file for testing the gradual commit script.

## Test Scenarios
1. **Sequential Processing**: Files should be processed in order
2. **Timing Intervals**: Wait periods should be respected
3. **Error Handling**: Script should handle git failures gracefully
4. **State Recovery**: Resume should work after interruption

## Mock Data
```json
{
  "testId": "test2",
  "timestamp": "2025-08-13",
  "purpose": "gradual-commit-testing",
  "status": "ready"
}
```

## Expected Behavior
- File should be committed after test1.md
- State should be saved after successful commit
- Timing interval should be enforced before next file

## Notes
- This file simulates real EMR component files
- Tests the script's ability to handle markdown content
- Validates JSON state persistence

---
*Test file for FHIR-MCP integration workflow*
