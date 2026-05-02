# Quick Token Setup & Test Script

Write-Host "=== NOTIFICATION APP - TOKEN SETUP & TEST ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get token from user
Write-Host "STEP 1: Paste your token from Postman" -ForegroundColor Yellow
Write-Host "        (The long string starting with eyJ... or sk_...)" -ForegroundColor Gray
Write-Host ""
$newToken = Read-Host "Enter your new token"

if ([string]::IsNullOrWhiteSpace($newToken)) {
    Write-Host "✗ Error: No token provided" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Token received (length: $($newToken.Length))" -ForegroundColor Green
Write-Host ""

# Step 2: Backup existing .env.local
$envPath = "notification_app_fe\.env.local"
$backupPath = "notification_app_fe\.env.local.backup"

if (Test-Path $envPath) {
    Copy-Item $envPath $backupPath -Force
    Write-Host "✓ Backed up existing .env.local to .env.local.backup" -ForegroundColor Green
}

# Step 3: Update .env.local with new token
Write-Host ""
Write-Host "STEP 2: Updating .env.local with new token..." -ForegroundColor Yellow

$envContent = @"
# Authentication token for API requests
NEXT_PUBLIC_AUTH_TOKEN=$newToken

# Logging endpoint
NEXT_PUBLIC_LOG_API=http://20.207.122.201/evaluation-service/logs

# Notifications API endpoint
NEXT_PUBLIC_NOTIFICATION_API=http://20.207.122.201/evaluation-service/notifications

# App environment
NODE_ENV=development
"@

Set-Content -Path $envPath -Value $envContent
Write-Host "✓ .env.local updated with new token" -ForegroundColor Green
Write-Host ""

# Step 4: Display what was updated
Write-Host "STEP 3: New configuration:" -ForegroundColor Yellow
Write-Host "NEXT_PUBLIC_AUTH_TOKEN=$($newToken.Substring(0, [Math]::Min(20, $newToken.Length)))..." -ForegroundColor Cyan
Write-Host "NEXT_PUBLIC_LOG_API=http://20.207.122.201/evaluation-service/logs" -ForegroundColor Cyan
Write-Host "NEXT_PUBLIC_NOTIFICATION_API=http://20.207.122.201/evaluation-service/notifications" -ForegroundColor Cyan
Write-Host ""

# Step 5: Test API connectivity
Write-Host "STEP 4: Testing API connectivity with new token..." -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $newToken"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-WebRequest `
        -Uri "http://20.207.122.201/evaluation-service/notifications" `
        -Headers $headers `
        -Method GET `
        -TimeoutSec 10 `
        -ErrorAction Stop

    Write-Host "✓ API Connection Successful!" -ForegroundColor Green
    Write-Host "  Status Code: $($response.StatusCode)" -ForegroundColor Green
    
    try {
        $data = $response.Content | ConvertFrom-Json
        $notificationCount = $data.notifications.Count
        Write-Host "  Notifications Retrieved: $notificationCount" -ForegroundColor Green
        
        if ($notificationCount -gt 0) {
            Write-Host "  First notification: $($data.notifications[0].Message.Substring(0, [Math]::Min(50, $data.notifications[0].Message.Length)))" -ForegroundColor Green
        }
    } catch {
        Write-Host "  Response is valid but couldn't parse notifications" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "✗ API Connection Failed" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.Value__
        Write-Host "  Status Code: $statusCode" -ForegroundColor Red
        
        if ($statusCode -eq 401) {
            Write-Host "  Issue: Unauthorized (token invalid or wrong format)" -ForegroundColor Yellow
        } elseif ($statusCode -eq 403) {
            Write-Host "  Issue: Forbidden (token valid but access denied)" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "STEP 5: Configuration complete!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Save this terminal output" -ForegroundColor Cyan
Write-Host "2. In another terminal, run:" -ForegroundColor Cyan
Write-Host "   cd notification_app_fe" -ForegroundColor Green
Write-Host "   npm run dev" -ForegroundColor Green
Write-Host "3. Open browser: http://localhost:3000" -ForegroundColor Green
Write-Host "4. Check if notifications load" -ForegroundColor Green
Write-Host ""
Write-Host "If it still doesn't work:" -ForegroundColor Yellow
Write-Host "- Check that token format is correct" -ForegroundColor Yellow
Write-Host "- Verify API endpoint URLs are correct" -ForegroundColor Yellow
Write-Host "- Ask your instructor for help" -ForegroundColor Yellow
Write-Host ""
