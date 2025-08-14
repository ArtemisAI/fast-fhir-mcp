# Issues and Known Problems

This directory contains documentation of issues encountered during the FHIR-MCP project development, specifically around the gradual commit PowerShell scripts.

## Current Status (August 14, 2025)

### Active Issues
- **Script v4 Git Working Tree Errors**: The `gradual-commit-v4.ps1` script fails when the working tree has uncommitted changes
- **Error Handling Improvements Needed**: Script needs better recovery mechanisms for various git states

### Issue Files
- `powershell-script-errors.md` - Detailed PowerShell syntax and execution errors
- `testing-results.md` - Results from testing different script versions
- `git-working-tree-issues.md` - NEW: Git state management problems

### Priority Level: HIGH
The script is functional but needs robust error handling before production use.

### Next Steps for Handover
1. Review `git-working-tree-issues.md` for current debugging status
2. Test enhanced error handling functions
3. Validate git state management logic
4. Complete production run with 20-minute intervals

### Related Files
- `.scripts/gradual-commit-v4.ps1` - Current working script
- `EXECUTION_GUIDE.md` - How to run the scripts
- `PROJECT_HANDOVER.md` - Overall project status