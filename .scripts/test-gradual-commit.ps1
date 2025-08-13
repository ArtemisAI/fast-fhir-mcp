# Test Gradual Commit Script
# Tests the gradual commit functionality with mock files

param(
    [Parameter(Mandatory=$false)]
    [string]$RepositoryPath = (Get-Location).Path,
    
    [Parameter(Mandatory=$false)]
    [string]$TestPath = ".scripts\test",
    
    [Parameter(Mandatory=$false)]
    [string]$Branch = "main",
    
    [Parameter(Mandatory=$false)]
    [double]$IntervalMinutes = 1.0,  # Short interval for testing
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun,
    
    [Parameter(Mandatory=$false)]
    [switch]$Resume,
    
    [Parameter(Mandatory=$false)]
    [switch]$Force
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Cyan"
$Magenta = "Magenta"

function Write-Log {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" -ForegroundColor $Color
}

function Save-TestState {
    param(
        [int]$CurrentIndex,
        [string]$CurrentFile,
        [datetime]$LastCommitTime,
        [hashtable]$CommittedFiles
    )
    
    $stateFile = Join-Path $RepositoryPath ".scripts\test-commit-state.json"
    $state = [PSCustomObject]@{
        ScriptVersion = "1.0-test"
        CurrentIndex = $CurrentIndex
        CurrentFile = $CurrentFile
        LastCommitTime = $LastCommitTime.ToString("yyyy-MM-dd HH:mm:ss")
        CommittedFiles = $CommittedFiles
    }
    
    $state | ConvertTo-Json -Depth 10 | Set-Content -Path $stateFile -Encoding UTF8
    Write-Log "💾 Test state saved: Index $CurrentIndex, File: $CurrentFile" -Color $Blue
}

function Get-TestState {
    $stateFile = Join-Path $RepositoryPath ".scripts\test-commit-state.json"
    
    if (Test-Path $stateFile) {
        try {
            $jsonContent = Get-Content -Path $stateFile -Raw -Encoding UTF8
            $state = $jsonContent | ConvertFrom-Json
            
            # Convert CommittedFiles back to hashtable
            $committedFiles = @{}
            if ($state.CommittedFiles) {
                $state.CommittedFiles.PSObject.Properties | ForEach-Object {
                    $committedFiles[$_.Name] = $_.Value
                }
            }
            
            return [PSCustomObject]@{
                CurrentIndex = $state.CurrentIndex
                CurrentFile = $state.CurrentFile
                LastCommitTime = [datetime]::ParseExact($state.LastCommitTime, "yyyy-MM-dd HH:mm:ss", $null)
                CommittedFiles = $committedFiles
            }
        }
        catch {
            Write-Log "⚠️ Failed to load test state: $($_.Exception.Message)" -Color $Yellow
            return $null
        }
    }
    
    return $null
}

function Wait-ForInterval {
    param([double]$Minutes)
    
    if ($Minutes -le 0) { return }
    
    $seconds = [math]::Round($Minutes * 60)
    Write-Log "⏳ Waiting $Minutes minutes ($seconds seconds) before next commit..." -Color $Yellow
    
    for ($i = $seconds; $i -gt 0; $i--) {
        Write-Progress -Activity "Waiting for next commit" -Status "$i seconds remaining" -PercentComplete ((($seconds - $i) / $seconds) * 100)
        Start-Sleep -Seconds 1
    }
    
    Write-Progress -Activity "Waiting for next commit" -Completed
    Write-Log "✅ Wait period completed" -Color $Green
}

function Test-GitCommit {
    param([string]$FilePath, [string]$CommitMessage)
    
    if ($DryRun) {
        Write-Log "🧪 DRY RUN: Would commit $FilePath" -Color $Magenta
        return $true
    }
    
    try {
        # Add file to git
        $addResult = git add $FilePath 2>&1
        if ($LASTEXITCODE -ne 0) {
            throw "Git add failed: $addResult"
        }
        
        # Commit file
        $commitResult = git commit -m $CommitMessage 2>&1
        if ($LASTEXITCODE -ne 0) {
            throw "Git commit failed: $commitResult"
        }
        
        # Push to remote
        $pushResult = git push origin $Branch 2>&1
        if ($LASTEXITCODE -ne 0) {
            throw "Git push failed: $pushResult"
        }
        
        return $true
    }
    catch {
        Write-Log "❌ Git operation failed: $($_.Exception.Message)" -Color $Red
        return $false
    }
}

# Main script execution
try {
    Write-Log "🧪 === Test Gradual Commit Script Started ===" -Color $Green
    Write-Log "📁 Repository: $RepositoryPath" -Color $Blue
    Write-Log "📂 Test Path: $TestPath" -Color $Blue
    Write-Log "🌿 Branch: $Branch" -Color $Blue
    Write-Log "⏱️ Interval: $IntervalMinutes minutes" -Color $Blue
    Write-Log "🧪 Dry Run: $DryRun" -Color $Blue
    Write-Log "🔄 Resume Mode: $Resume" -Color $Blue
    
    # Change to repository directory
    Set-Location $RepositoryPath
    
    # Get test files
    $testDir = Join-Path $RepositoryPath $TestPath
    $testFiles = Get-ChildItem -Path $testDir -File -Recurse | Sort-Object Name
    
    if ($testFiles.Count -eq 0) {
        Write-Log "❌ No test files found in $testDir" -Color $Red
        exit 1
    }
    
    Write-Log "📊 Found $($testFiles.Count) test files to process" -Color $Green
    
    # Initialize or load state
    $committedFiles = @{}
    $startIndex = 0
    $lastCommitTime = [datetime]::MinValue
    
    if ($Resume) {
        Write-Log "🔄 Checking for previous test session..." -Color $Yellow
        $savedState = Get-TestState
        
        if ($savedState) {
            Write-Log "🔄 Resuming from previous test session..." -Color $Green
            Write-Log "📄 Last commit: $($savedState.CurrentFile)" -Color $Blue
            Write-Log "🕐 Last commit time: $($savedState.LastCommitTime)" -Color $Blue
            
            $startIndex = $savedState.CurrentIndex
            $lastCommitTime = $savedState.LastCommitTime
            $committedFiles = $savedState.CommittedFiles
        }
        else {
            Write-Log "⚠️ No previous test state found, starting fresh" -Color $Yellow
        }
    }
    
    Write-Log "📍 Starting from file $($startIndex + 1)/$($testFiles.Count)" -Color $Green
    
    if ($committedFiles.Count -gt 0) {
        Write-Log "✅ Already committed: $($committedFiles.Count) test files" -Color $Green
    }
    
    # Process each test file
    for ($i = $startIndex; $i -lt $testFiles.Count; $i++) {
        $file = $testFiles[$i]
        $relativePath = $file.FullName.Replace($RepositoryPath + "\", "").Replace("\", "/")
        
        Write-Log "📝 Processing test file $($i + 1)/$($testFiles.Count): $($file.Name)" -Color $Green
        
        # Check if file was already committed
        if ($committedFiles.ContainsKey($relativePath)) {
            Write-Log "⏭️ Skipping already committed: $($file.Name)" -Color $Yellow
            continue
        }
        
        # Save state before attempting commit
        Save-TestState -CurrentIndex $i -CurrentFile $relativePath -LastCommitTime $lastCommitTime -CommittedFiles $committedFiles
        
        # Check timing constraint
        if ($lastCommitTime -ne [datetime]::MinValue) {
            $timeSinceLastCommit = (Get-Date) - $lastCommitTime
            $requiredInterval = [TimeSpan]::FromMinutes($IntervalMinutes)
            
            if ($timeSinceLastCommit -lt $requiredInterval) {
                $waitTime = ($requiredInterval - $timeSinceLastCommit).TotalMinutes
                Wait-ForInterval -Minutes $waitTime
            }
        }
        
        # Attempt to commit the file
        $commitMessage = "test: Add $($file.Name) - Gradual commit test ($($i + 1)/$($testFiles.Count))"
        $success = Test-GitCommit -FilePath $relativePath -CommitMessage $commitMessage
        
        if ($success) {
            $committedFiles[$relativePath] = $true
            $lastCommitTime = Get-Date
            Write-Log "✅ Successfully committed: $($file.Name) ($($i + 1)/$($testFiles.Count))" -Color $Green
            
            # Save state after successful commit
            Save-TestState -CurrentIndex ($i + 1) -CurrentFile $relativePath -LastCommitTime $lastCommitTime -CommittedFiles $committedFiles
        }
        else {
            Write-Log "❌ Failed to commit: $($file.Name)" -Color $Red
            
            if (-not $Force) {
                Write-Log "⚠️ Use -Force to continue with next file or -Resume to restart later." -Color $Yellow
                break
            }
            else {
                Write-Log "🔄 Continuing with next file due to -Force flag" -Color $Yellow
            }
        }
    }
    
    # Final summary
    Write-Log "🎯 === Test gradual commit process completed ===" -Color $Green
    Write-Log "📊 Total test files committed: $($committedFiles.Count)/$($testFiles.Count)" -Color $Green
    
    if ($committedFiles.Count -eq $testFiles.Count) {
        Write-Log "🎉 All test files successfully committed!" -Color $Green
        
        # Clean up test state file
        $stateFile = Join-Path $RepositoryPath ".scripts\test-commit-state.json"
        if (Test-Path $stateFile) {
            Remove-Item $stateFile -Force
            Write-Log "🧹 Test state file cleaned up" -Color $Blue
        }
    }
    else {
        Write-Log "⚠️ Process incomplete. Use -Resume to continue from where you left off." -Color $Yellow
        Write-Log "💾 Test state saved to: $(Join-Path $RepositoryPath '.scripts\test-commit-state.json')" -Color $Blue
    }
}
catch {
    Write-Log "❌ Script failed: $($_.Exception.Message)" -Color $Red
    Write-Log "💾 Current test state has been saved. Use -Resume to continue." -Color $Yellow
    exit 1
}
