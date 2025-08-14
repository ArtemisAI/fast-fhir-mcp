# AI Agent Takeover Prompts - FHIR-MCP Gradual Commit Debugging

## PRIMARY CONTEXT PROMPT

```
You are taking over a PowerShell automation project that uploads 114 EMR files to GitHub with controlled intervals. The previous agent has completed 95% of the work but left one critical debugging issue.

**REPOSITORY**: Daniel-Gonzalez-AI/fhir-mcp
**MAIN TASK**: Fix and execute `.scripts/gradual-commit-v4.ps1` to upload 114 EMR files
**CURRENT STATUS**: Script fails on first commit due to git working tree management
**PRIORITY**: HIGH - Academic deadline dependency

**IMMEDIATE CONTEXT**:
- All documentation is complete and organized
- Script works perfectly in dry-run mode (validates all 114 files)
- Real execution fails because git working tree has uncommitted changes
- Previous agent has provided 3 proposed solutions with detailed analysis

**YOUR ROLE**: Debug the git working tree issue and complete the 38-hour upload process

**CRITICAL FILES TO READ FIRST**:
1. `PROJECT_HANDOVER.md` - Complete project status and technical details
2. `issues/git-working-tree-issues.md` - Detailed analysis of the exact problem
3. `EXECUTION_GUIDE.md` - How to run the scripts safely
4. `issues/testing-results.md` - What testing has been completed

**EXPECTED OUTCOME**: All 114 EMR files committed individually with 20-minute intervals, script completes successfully, documentation updated with final results.
```

## TECHNICAL DEBUGGING PROMPT

```
**DEBUGGING TASK**: Fix PowerShell script git integration issue

**TECHNICAL CONTEXT**:
- Script: `.scripts/gradual-commit-v4.ps1` (390 lines, fully documented)
- Language: PowerShell Core (requires pwsh.exe, not Windows PowerShell)
- Git Strategy: Individual file commits with `git commit --only`
- Error Pattern: Script fails when working tree has uncommitted changes

**EXACT ERROR**:
```
Git commit failed: On branch main
Changes not staged for commit:
        modified:   README.md
Untracked files:
        EMR/.dockerignore
        [... many EMR files ...]
no changes added to commit
```

**ROOT CAUSE**: The `git commit --only "$relativePath"` command fails when there are other uncommitted changes in the working tree, even though we only want to commit one specific file.

**PROPOSED SOLUTIONS** (choose one to implement):

1. **Auto-cleanup approach**: Add function to clean working tree before starting
2. **Alternative git strategy**: Use temporary branches for isolation
3. **Simplified commands**: Remove `--only` flag and use different approach

**CURRENT FAILING FUNCTION** (line ~209 in script):
```powershell
function Invoke-FileCommit {
    # This function needs fixing - git commit --only fails with dirty tree
    git add -- "$relativePath"
    git commit --only "$relativePath" -m $commitMessage
    git push origin $Branch
}
```

**SUCCESS CRITERIA**: Script commits `EMR/package.json` successfully and continues to next file.

**TESTING APPROACH**: Use `-TargetFolder types` for small subset testing before full run.
```

## EXECUTION PROMPT

```
**EXECUTION GUIDANCE FOR AI AGENT**

**PREREQUISITES CHECKLIST**:
1. Verify PowerShell Core: `pwsh.exe --version` (not Windows PowerShell)
2. Check git authentication: `git push origin main --dry-run`
3. Understand file structure: 114 files in EMR/ folder to be committed individually

**SAFE TESTING SEQUENCE**:
1. **Read documentation first**: Start with `PROJECT_HANDOVER.md`
2. **Dry run test**: `pwsh.exe -NoProfile -File ".\.scripts\gradual-commit-v4.ps1" -DryRun`
3. **Small subset test**: `pwsh.exe -NoProfile -File ".\.scripts\gradual-commit-v4.ps1" -TargetFolder types -IntervalMinutes 1`
4. **Production run**: Only after successful testing

**DEBUGGING WORKFLOW**:
1. Identify the exact git command failure in `Invoke-FileCommit` function
2. Choose and implement one of the three proposed solutions
3. Test fix with 2-file subset (types folder)
4. Validate with dry run of full 114 files
5. Execute production run with 20-minute intervals

**MONITORING APPROACH**:
- Script provides real-time progress: "Processing file X/114"
- State file tracks progress: `.scripts/commit-state.json`
- Resume capability: Add `-Resume` flag if interrupted
- Expected duration: ~38 hours for full run

**ERROR RECOVERY**:
- State persistence allows resuming from any point
- Each commit is atomic (either succeeds completely or fails completely)
- No risk of data loss (all files backed up locally)

**SUCCESS VALIDATION**:
- All 114 files committed individually
- Each commit has descriptive message format: "feat: Add {filename} - EMR {type} (X/114)"
- Repository history shows 114 new commits
- State file automatically cleaned up on completion
```

## PROBLEM-SOLVING PROMPT

```
**SYSTEMATIC DEBUGGING APPROACH FOR AI AGENT**

**PROBLEM ANALYSIS FRAMEWORK**:

1. **Understand the Constraint**: 
   - Git `--only` flag requires clean working tree
   - Repository has legitimate untracked EMR files that SHOULD be committed
   - Repository has other modified files (README.md) that should NOT be included in EMR commits

2. **Solution Space**:
   - **Option A**: Clean the working tree before starting (stash or commit non-EMR changes)
   - **Option B**: Use alternative git commands that don't require clean tree
   - **Option C**: Use git worktree or temporary branches for isolation

3. **Implementation Strategy**:
   ```powershell
   # Current failing approach:
   git add -- "$relativePath"
   git commit --only "$relativePath" -m $commitMessage
   
   # Proposed fix (choose one):
   # A. Pre-clean approach
   git stash push -m "temp" -- ":(exclude)EMR/**"
   git add -- "$relativePath" 
   git commit -m $commitMessage
   git stash pop
   
   # B. Reset-based approach  
   git add -- "$relativePath"
   git commit -m $commitMessage  # Commit only staged files
   
   # C. Worktree approach
   git worktree add ../temp-commit
   # ... perform commit in clean worktree
   ```

**VALIDATION STEPS**:
1. Test chosen solution with single file first
2. Verify it doesn't affect other files in working tree
3. Confirm git history is clean and descriptive
4. Test resume capability works correctly

**EDGE CASES TO HANDLE**:
- Network failures during git push
- Authentication token expiry during long run
- System interruption (script has resume capability)
- Git merge conflicts (shouldn't occur with this approach)

**DEBUGGING TOOLS**:
- `git status --porcelain` for programmatic status checking
- `git diff --cached` to see staged changes
- `git log --oneline -10` to verify commit history
- Script's built-in logging with timestamps and colors
```

## CONTEXT VERIFICATION PROMPT

```
**CONTEXT VALIDATION FOR SMOOTH HANDOVER**

**Verify you understand these key points**:

1. **Project Goal**: Upload 114 EMR files individually to GitHub repo with 20-minute intervals to avoid overwhelming the system

2. **Current State**: 
   - Repository: `Daniel-Gonzalez-AI/fhir-mcp` (private)
   - Files ready: 114 EMR files locally, need to be in Git history
   - Script ready: `.scripts/gradual-commit-v4.ps1` works in dry-run
   - Blocker: Git working tree management prevents real commits

3. **Technical Requirements**:
   - Must use PowerShell Core (`pwsh.exe`) not Windows PowerShell
   - Each file gets individual commit with specific message format
   - State persistence allows resuming from interruptions
   - 20-minute intervals between commits (~38 hours total)

4. **Documentation Status**:
   - All issues documented in `issues/` folder
   - Complete handover guide in `PROJECT_HANDOVER.md`
   - Execution instructions in `EXECUTION_GUIDE.md`
   - Test results in `issues/testing-results.md`

5. **Success Definition**:
   - Script runs without errors
   - All 114 files committed individually 
   - Repository shows clean commit history
   - Process completes in ~38 hours
   - State file cleaned up automatically

**CONFIRM YOUR UNDERSTANDING**:
- [ ] I understand this is a git working tree management issue, not a PowerShell syntax issue
- [ ] I know the script works perfectly in dry-run mode (logic is correct)
- [ ] I will test with small subset before attempting full 114-file run
- [ ] I have access to all necessary documentation and proposed solutions
- [ ] I understand the 38-hour execution timeline and monitoring requirements

**RED FLAGS TO AVOID**:
- Don't modify the core script logic (file discovery, prioritization, state management)
- Don't attempt to commit all files at once (defeats the purpose)
- Don't ignore the documentation (previous agent spent significant time analyzing)
- Don't skip subset testing (could waste 38 hours if something breaks)
```

## FINAL EXECUTION PROMPT

```
**FINAL EXECUTION CHECKLIST FOR AI AGENT**

**Phase 1: Preparation (30 minutes)**
1. Read `PROJECT_HANDOVER.md` completely
2. Review `issues/git-working-tree-issues.md` for technical details  
3. Understand the three proposed solutions
4. Check environment: PowerShell Core, git access, clean workspace

**Phase 2: Implementation (1-2 hours)**
1. Choose and implement one git working tree solution
2. Test fix with dry run: `-DryRun` flag
3. Test with small subset: `-TargetFolder types`
4. Validate resume capability works

**Phase 3: Production (38 hours)**
1. Start full run: 114 files, 20-minute intervals
2. Monitor first few commits for any issues
3. Set up periodic check-ins (script runs unattended)
4. Handle any authentication or network issues

**Phase 4: Completion (30 minutes)**
1. Verify all 114 files committed successfully
2. Update `issues/testing-results.md` with final results
3. Confirm state file automatically cleaned up
4. Mark project as completed in documentation

**FINAL COMMAND TO EXECUTE** (after debugging):
```powershell
pwsh.exe -NoProfile -File ".\.scripts\gradual-commit-v4.ps1" -RepositoryPath "G:\projects\_School\fhir-mcp" -EMRPath EMR -IntervalMinutes 20
```

**SUCCESS METRICS**:
- Exit code 0 from script
- 114 new commits in git history
- All EMR files present in repository
- Clean working tree at completion
- State file removed automatically

**This task is ready for immediate takeover - all analysis and documentation is complete.**
```
