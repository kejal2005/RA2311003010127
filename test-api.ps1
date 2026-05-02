# Test API connectivity and token

Write-Host "=== API DIAGNOSTIC TEST ===" -ForegroundColor Cyan
Write-Host ""

# Configuration
$token = "QkbpxH"
$api_url = "http://20.207.122.201/evaluation-service/notifications"
$log_url = "http://20.207.122.201/evaluation-service/logs"

Write-Host "Token: $token" -ForegroundColor Yellow
Write-Host "API URL: $api_url" -ForegroundColor Yellow
Write-Host ""

# Test 1: Check if API is reachable (ping)
Write-Host "TEST 1: Checking if server is reachable..." -ForegroundColor Cyan
try {
    $testConnection = Test-NetConnection -ComputerName "20.207.122.201" -Port 80 -WarningAction SilentlyContinue
    if ($testConnection.TcpTestSucceeded) {
        Write-Host "✓ Server is reachable" -ForegroundColor Green
    } else {
        Write-Host "✗ Server is NOT reachable" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Connection test failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 2: Test API with token
Write-Host "TEST 2: Testing API with Bearer token..." -ForegroundColor Cyan

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-WebRequest `
        -Uri $api_url `
        -Headers $headers `
        -Method GET `
        -ErrorAction Stop `
        -TimeoutSec 10

    Write-Host "✓ API Response Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "✓ Response Content Length: $($response.Content.Length) bytes" -ForegroundColor Green
    
    # Try to parse as JSON
    try {
        $data = $response.Content | ConvertFrom-Json
        Write-Host "✓ Response is valid JSON" -ForegroundColor Green
        Write-Host "✓ Notifications count: $($data.notifications.Count)" -ForegroundColor Green
        
        # Show first notification
        if ($data.notifications.Count -gt 0) {
            Write-Host ""
            Write-Host "Sample notification:" -ForegroundColor Yellow
            $data.notifications[0] | ConvertTo-Json
        }
    } catch {
        Write-Host "✗ Response is not valid JSON" -ForegroundColor Red
        Write-Host "Response preview: $($response.Content.Substring(0, [Math]::Min(200, $response.Content.Length)))" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "✗ API call failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # More details
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
        Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== END OF DIAGNOSTIC TEST ===" -ForegroundColor Cyan
