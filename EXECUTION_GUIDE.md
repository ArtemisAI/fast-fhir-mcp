# Execution Guide - FHIR-MCP Gradual Commit Scripts

**Last Updated**: August 14, 2025  
**Current Status**: DEBUGGING REQUIRED  
**Priority**: HIGH  

## Quick Start (For Takeover)

⚠️ **IMPORTANT**: This script currently has a critical issue with git working tree management. Please review `issues/git-working-tree-issues.md` before attempting to run.

### Prerequisites
1. **PowerShell Core**: Must use `pwsh.exe`, not Windows PowerShell
2. **Clean Git Working Tree**: Commit or stash any pending changes
3. **GitHub Authentication**: Ensure git push works to `origin/main`

### Current Working Script
**File**: `.scripts/gradual-commit-v4.ps1`
**Status**: Functional for dry runs, fails on real commits due to git working tree issues

## Commands Reference

### Check Prerequisites
```powershell
# Verify PowerShell Core
pwsh.exe --version

# Check git status (must be clean)
git status

# Test git push capability
git push origin main --dry-run
```

### Clean Working Tree (REQUIRED)
```powershell
# Commit any pending non-EMR changes
git add README.md PROJECT_HANDOVER.md issues/
git commit -m "Update documentation before EMR upload"

# Verify clean state
git status  # Should show "working tree clean"
```

### Script Execution Options

#### Dry Run (Safe Testing)
```powershell
pwsh.exe -NoProfile -File ".\.scripts\gradual-commit-v4.ps1" -DryRun -IntervalMinutes 1
```
**Expected Result**: Simulates all 114 files, shows processing order

#### Small Subset Test (Recommended First)
```powershell
pwsh.exe -NoProfile -File ".\.scripts\gradual-commit-v4.ps1" -TargetFolder types -IntervalMinutes 1
```
**Expected Result**: Commits only files in `EMR/types/` folder (2 files)

#### Full Production Run (After Testing)
```powershell
pwsh.exe -NoProfile -File ".\.scripts\gradual-commit-v4.ps1" -IntervalMinutes 20
```
**Expected Result**: Commits all 114 EMR files with 20-minute intervals (~38 hours total)

#### Resume After Interruption
```powershell
pwsh.exe -NoProfile -File ".\.scripts\gradual-commit-v4.ps1" -Resume -IntervalMinutes 20
```
**Expected Result**: Continues from last successful commit using saved state

## Parameters Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `RepositoryPath` | string | Current directory | Absolute path to git repository |
| `EMRPath` | string | "EMR" | Relative path to EMR folder |
| `TargetFolder` | string | "" | Specific subfolder to process (e.g., "types") |
| `Branch` | string | "main" | Git branch to commit to |
| `IntervalMinutes` | double | 20.0 | Minutes to wait between commits |
| `DryRun` | switch | false | Simulate without actual commits |
| `Resume` | switch | false | Continue from saved state |
| `Force` | switch | false | Continue after commit failures |

## Known Issues and Workarounds

### Issue 1: Git Working Tree Not Clean
**Status**: ACTIVE BLOCKER  
**Error**: `Git commit failed: Changes not staged for commit`  
**Workaround**: Manually clean working tree before running script  
**Permanent Fix**: Needs enhanced error handling in script  

### Issue 2: PowerShell Compatibility
**Status**: RESOLVED  
**Solution**: Always use `pwsh.exe -NoProfile -File` syntax  

### Issue 3: Parameter Binding Errors
**Status**: RESOLVED  
**Solution**: Use `-File` parameter instead of `-Command`  

## File Structure and State Management

### Generated Files
- `.scripts/commit-state.json` - Progress tracking (auto-created)
- `.scripts/commit-state-{folder}.json` - For subfolder tests

### Processing Order
1. `package.json` (highest priority)
2. Configuration files (*.json)
3. TypeScript files (*.ts, *.tsx)
4. JavaScript files (*.js, *.jsx)
5. Stylesheets (*.css)
6. Documentation (*.md)
7. Other files

### File Filtering
Automatically excludes:
- `node_modules/`
- `.git/`, `.next/`, `dist/`, `build/`
- `coverage/`, `.env`, `package-lock.json`

## Troubleshooting

### Script Won't Start
1. **Check PowerShell version**: Must be Core (`pwsh.exe`)
2. **Verify file path**: Use absolute paths for `RepositoryPath`
3. **Check permissions**: Ensure write access to `.scripts/` folder

### Git Commit Failures
1. **Clean working tree**: `git status` should show clean
2. **Check git config**: Verify user.name and user.email
3. **Test git push**: Ensure authentication works

### Script Stops Unexpectedly
1. **Check state file**: `.scripts/commit-state.json` should exist
2. **Use Resume**: Add `-Resume` flag to continue
3. **Check interval**: Ensure system stays awake during long intervals

## Monitoring Progress

### Real-time Monitoring
- Script provides timestamped console output
- Progress indicators show file X/114
- Wait periods display countdown timers

### State Verification
```powershell
# Check current state
Get-Content .scripts/commit-state.json | ConvertFrom-Json

# Verify git history
git log --oneline -10

# Check remaining files
git status
```

## Emergency Procedures

### Stop Script Safely
- Press `Ctrl+C` to interrupt
- State is automatically saved
- Use `-Resume` to continue later

### Reset and Start Over
```powershell
# Remove state file
Remove-Item .scripts/commit-state.json -ErrorAction SilentlyContinue

# Start fresh
pwsh.exe -NoProfile -File ".\.scripts\gradual-commit-v4.ps1" -IntervalMinutes 20
```

### Recover from Failed State
```powershell
# Check what was committed
git log --oneline --grep="EMR"

# Resume from current state
pwsh.exe -NoProfile -File ".\.scripts\gradual-commit-v4.ps1" -Resume -IntervalMinutes 20
```

## Performance Expectations

### Time Estimates
- **114 files at 20min intervals**: ~38 hours
- **114 files at 5min intervals**: ~9.5 hours  
- **114 files at 1min intervals**: ~2 hours

### System Requirements
- **Network**: Stable internet for git push operations
- **Power**: System must stay awake during execution
- **Disk**: Minimal space required (~100MB for git operations)

## Next Steps for Debugger

1. **Priority 1**: Fix git working tree management (see `issues/git-working-tree-issues.md`)
2. **Priority 2**: Test with clean environment and small subset
3. **Priority 3**: Validate full production run
4. **Priority 4**: Document final success and archive project

## Contact and Handover
- **Repository**: `Daniel-Gonzalez-AI/fhir-mcp`
- **Main Branch**: `main`
- **Documentation**: All issues documented in `issues/` folder
- **Status**: Ready for experienced PowerShell/Git developer to complete
