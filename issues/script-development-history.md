# Script Development History - Gradual Commit Project

## Evolution Timeline

### v1.0 - Initial Concept (August 13, 2025)
- Basic PowerShell script for automated git commits
- Simple file iteration with timing delays
- Manual credential configuration

### v2.0 - Enhanced Structure
- Added state persistence for resume capability
- Improved error handling and logging
- File prioritization logic implemented

### v3.0 - Folder Targeting (Successfully Tested)
- Added `-TargetFolder` parameter for subset testing
- Fixed path resolution issues
- Successfully tested on EMR/types folder (2 files)
- **Status**: WORKING ✅

### v4.0 - Complete Rewrite (Current Issue)
- Rebuilt from scratch with better architecture
- Enhanced error handling and git isolation
- PowerShell Core compatibility ensured
- Here-string commit messages
- **Status**: DRY RUN SUCCESS ✅, REAL RUN BLOCKED ❌

## Key Learnings

### PowerShell Compatibility
- Windows PowerShell: Cannot parse here-strings and advanced syntax
- PowerShell Core (pwsh.exe): Required for full functionality
- Parameter binding: Use `-File` not `-Command` for switch parameters

### Git Integration Challenges
- `git commit --only` requires clean working tree
- Untracked files in repository prevent targeted commits
- Need pre-commit cleanup or alternative git strategy

### Testing Approach
- Dry runs validate logic without git operations
- Subset testing (e.g., types folder) proves functionality
- Real runs expose git state management issues

## Current Blocker Analysis

### Problem
Script fails on first commit when working tree has:
- Modified files (e.g., README.md)
- Untracked files (e.g., EMR/* files to be committed)

### Git Command That Fails
```powershell
git add -- "$relativePath"
git commit --only "$relativePath" -m $commitMessage
```

### Proposed Solutions
1. Auto-cleanup function to handle dirty working tree
2. Alternative git strategy using temporary branches
3. Simplified approach removing `--only` flag

## Script Comparison

| Feature | v3 | v4 |
|---------|----|----|
| Folder targeting | ✅ | ✅ |
| State persistence | ✅ | ✅ |
| PowerShell Core | ⚠️ | ✅ |
| Error handling | Basic | Enhanced |
| Git isolation | Basic | Advanced |
| Real-world testing | ✅ SUCCESS | ❌ BLOCKED |

## Recommendations for Completion

1. **Immediate**: Fix git working tree management in v4
2. **Alternative**: Fall back to v3 for production if v4 fix is complex
3. **Testing**: Always test subset before full 114-file run
4. **Monitoring**: Plan for 38-hour execution window with monitoring

See `issues/git-working-tree-issues.md` for detailed technical analysis.
