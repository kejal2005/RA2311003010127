# Test all possible token formats

Write-Host "=== TESTING ALL TOKEN FORMATS ===" -ForegroundColor Cyan
Write-Host ""

$baseToken = "QkbpxH"
$apiUrl = "http://20.207.122.201/evaluation-service/notifications"
$testCount = 0

# Helper function to test a format
function Test-Format {
    param(
        [string]$name,
        [hashtable]$headers,
        [string]$url = $apiUrl,
        [string]$method = "GET"
    )
    
    $script:testCount++
    Write-Host "TEST $($script:testCount): $name" -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest `
            -Uri $url `
            -Headers $headers `
            -Method $method `
            -ErrorAction Stop `
            -TimeoutSec 5
        
        Write-Host "✓ SUCCESS - Status: $($response.StatusCode)" -ForegroundColor Green
        
        try {
            $data = $response.Content | ConvertFrom-Json
            Write-Host "✓ Response has $($data.notifications.Count) notifications" -ForegroundColor Green
        } catch {
            Write-Host "✓ Response: $($response.Content.Substring(0, 100))" -ForegroundColor Green
        }
        
        return $true
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.Value__
        $errorMsg = $_.Exception.Message
        
        Write-Host "✗ FAILED - Status: $statusCode" -ForegroundColor Red
        Write-Host "  Error: $errorMsg" -ForegroundColor Red
        return $false
    }
    
    Write-Host ""
}

# Test 1: Bearer + plain token (current)
Test-Format "Bearer + Plain Token" @{"Authorization"="Bearer $baseToken"}

# Test 2: Just token (no Bearer)
Test-Format "Just Token (no Bearer prefix)" @{"Authorization"=$baseToken}

# Test 3: Token as API Key header
Test-Format "X-API-Key Header" @{"X-API-Key"=$baseToken}

# Test 4: Token as custom header
Test-Format "X-Token Header" @{"X-Token"=$baseToken}

# Test 5: Token as query parameter
Test-Format "Token as Query Parameter" @{} "$apiUrl?token=$baseToken"

# Test 6: Base64 encoded token with Bearer
$encoded = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($baseToken))
Write-Host "Base64 encoded token: $encoded" -ForegroundColor Cyan
Test-Format "Bearer + Base64 Encoded Token" @{"Authorization"="Bearer $encoded"}

# Test 7: Base64 encoded token alone
Test-Format "Just Base64 Encoded Token (no Bearer)" @{"Authorization"=$encoded}

# Test 8: Basic auth (token as username)
$basicAuth = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("$($baseToken):"))
Test-Format "Basic Auth (token as username)" @{"Authorization"="Basic $basicAuth"}

# Test 9: Bearer with extra encoding
$doubleEncoded = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("Bearer $baseToken"))
Test-Format "Bearer + token, then Base64 encoded" @{"Authorization"=$doubleEncoded}

# Test 10: Custom Authorization format
Test-Format "Authorization: Token {token}" @{"Authorization"="Token $baseToken"}

Write-Host ""
Write-Host "=== TESTING COMPLETE ===" -ForegroundColor Cyan
Write-Host "If any test above shows ✓ SUCCESS, that's the correct format!" -ForegroundColor Green
Write-Host ""
