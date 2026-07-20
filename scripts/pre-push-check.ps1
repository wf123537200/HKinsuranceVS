# Pre-push check for Windows/PowerShell: runs unit tests.
# Hook this up by running in PowerShell:
#   New-Item -ItemType SymbolicLink -Path .git/hooks/pre-push -Target (Resolve-Path scripts/pre-push-check.ps1)
$ErrorActionPreference = "Stop"

Write-Host "🧪 Running unit tests before push..." -ForegroundColor Cyan
npm test --silent
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Tests failed. Push aborted." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Tests passed. Proceeding with push." -ForegroundColor Green