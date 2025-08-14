# Git Working Tree Issues - gradual-commit-v4.ps1

**Issue Date**: August 14, 2025  
**Priority**: HIGH  
**Status**: ACTIVE DEBUGGING  

## Problem Summary

The `gradual-commit-v4.ps1` script fails when attempting to commit files if the git working tree is not clean. Specifically:

### Error Symptoms
```
Git commit failed: On branch main
Your branch is up to date with 'origin/main'.
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   README.md
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        EMR/.dockerignore
        EMR/.env.example
        [... many EMR files ...]
no changes added to commit (use "git add" and/or "git commit -a")
```

### Root Cause
The script uses `git commit --only "$relativePath"` which requires a clean working tree or fails when there are other staged/unstaged changes.

## Technical Analysis

### Current Git Command Strategy
```powershell
git add -- "$relativePath"
git commit --only "$relativePath" -m $commitMessage
git push origin $Branch
```

### Issue: `--only` Flag Limitation
The `--only` flag in git commit has specific behavior:
- It commits only the specified file(s)
- But it fails if there are other uncommitted changes in the working tree
- This conflicts with our goal of committing files one at a time

### Attempted Solutions

#### 1. Enhanced Error Handling (Attempted)
```powershell
function Clear-WorkingTree {
    # Stash uncommitted changes except EMR files
    git stash push -m "Auto-stash before gradual commit" -- ":(exclude)EMR/**"
}
```
**Result**: Function had syntax errors and complexity issues

#### 2. Git Isolation (Current)
```powershell
Push-Location $REPO_ROOT
git add -- "$relativePath"
git commit --only "$relativePath" -m $commitMessage
git push origin $Branch
Pop-Location
```
**Result**: Still fails with dirty working tree

## Proposed Solutions

### Option A: Pre-commit Cleanup (RECOMMENDED)
Add automatic working tree cleanup before starting:
```powershell
function Ensure-CleanWorkingTree {
    $status = git status --porcelain
    if ($status) {
        Write-Log "⚠️ Working tree not clean. Auto-committing pending changes..." -Color Yellow
        
        # Commit any staged changes first
        $staged = git diff --cached --name-only
        if ($staged) {
            git commit -m "Auto-commit: Staged changes before gradual EMR upload"
        }
        
        # Add and commit any modified files (excluding EMR)
        $modified = git status --porcelain | Where-Object { $_ -match '^.M' -and $_ -notmatch 'EMR/' }
        if ($modified) {
            $modifiedFiles = $modified | ForEach-Object { ($_ -split '\s+', 2)[1] }
            $modifiedFiles | ForEach-Object { git add $_ }
            git commit -m "Auto-commit: Modified files before gradual EMR upload"
        }
    }
}
```

### Option B: Alternative Git Strategy
Replace `--only` with a different approach:
```powershell
function Invoke-FileCommit {
    # Create temporary branch for isolated commit
    $tempBranch = "temp-commit-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    git checkout -b $tempBranch
    git add -- "$relativePath"
    git commit -m $commitMessage
    git checkout $Branch
    git cherry-pick $tempBranch
    git branch -d $tempBranch
    git push origin $Branch
}
```

### Option C: Simplify Git Commands
Remove `--only` flag entirely:
```powershell
# Stage only the target file, commit everything staged
git reset HEAD  # Unstage everything first
git add -- "$relativePath"  # Stage only our target
git commit -m $commitMessage  # Commit only staged files
```

## Testing Status

### Last Test Results
- **Date**: August 14, 2025 15:36:55
- **Command**: `pwsh.exe -NoProfile -File ".\.scripts\gradual-commit-v4.ps1" -RepositoryPath "G:\projects\_School\fhir-mcp" -EMRPath EMR -IntervalMinutes 1`
- **Result**: FAILED on first file (package.json)
- **Reason**: Working tree not clean (modified README.md, untracked EMR files)

### Dry Run Status
- **Date**: August 14, 2025
- **Result**: SUCCESS (all 114 files simulated)
- **Note**: Dry run bypasses git operations, so git state issues don't appear

## Debugging Steps for Next Developer

### Immediate Actions Needed
1. **Test clean working tree**: Ensure git status is clean before running script
2. **Implement Option A**: Add `Ensure-CleanWorkingTree` function to script
3. **Test with single file**: Validate git commit strategy works
4. **Full test run**: Execute with 1-minute intervals on subset

### Script Locations
- Main script: `.scripts/gradual-commit-v4.ps1`
- State file: `.scripts/commit-state.json` (created during execution)
- Test folder: Can use `-TargetFolder types` for small subset testing

### Test Commands
```powershell
# Clean working tree first
git status
git add README.md && git commit -m "Update docs"

# Test single file commit
pwsh.exe -NoProfile -File ".\.scripts\gradual-commit-v4.ps1" -TargetFolder types -IntervalMinutes 1

# Full production run (after testing)
pwsh.exe -NoProfile -File ".\.scripts\gradual-commit-v4.ps1" -IntervalMinutes 20
```

## Related Issues
- See `powershell-script-errors.md` for PowerShell Core vs Windows PowerShell compatibility
- See `testing-results.md` for historical test results

## Priority Assessment
**CRITICAL**: This issue blocks the main objective of gradually uploading 114 EMR files. Must be resolved before production use.

## Estimated Resolution Time
2-4 hours for an experienced PowerShell/Git developer to implement and test one of the proposed solutions.
