# Pure PowerShell Static Web Server
$port = 3000
$localPath = Get-Location

# Create HttpListener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")
$listener.Prefixes.Add("http://[::1]:$port/")

try {
    $listener.Start()
    Write-Output "Ital Auto HRMS Server running successfully."
    Write-Output "Local URL: http://localhost:$port"
    Write-Output "Press Ctrl+C in your terminal to stop the server."
}
catch {
    Write-Error "Failed to start HttpListener: $_"
    exit
}

while ($listener.IsListening) {
    $response = $null
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Resolve request path
        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/" -or $urlPath -eq "") {
            $urlPath = "/index.html"
        }
        
        # Decode URL-encoded characters
        $urlPath = [System.Uri]::UnescapeDataString($urlPath)
        
        $filePath = Join-Path $localPath $urlPath
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            # Identify MIME content type
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            switch ($ext) {
                ".html" { $response.ContentType = "text/html" }
                ".css"  { $response.ContentType = "text/css; charset=utf-8" }
                ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
                ".json" { $response.ContentType = "application/json; charset=utf-8" }
                ".png"  { $response.ContentType = "image/png" }
                ".jpg"  { $response.ContentType = "image/jpeg" }
                ".jpeg" { $response.ContentType = "image/jpeg" }
                ".svg"  { $response.ContentType = "image/svg+xml" }
                default { $response.ContentType = "application/octet-stream" }
            }
            
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            # File Not Found
            $response.StatusCode = 404
            $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found")
            $response.ContentType = "text/plain"
            $response.ContentLength64 = $notFoundBytes.Length
            $response.OutputStream.Write($notFoundBytes, 0, $notFoundBytes.Length)
        }
    }
    catch {
        Write-Output "Request error: $_"
    }
    finally {
        if ($null -ne $response) {
            try { $response.Close() } catch {}
        }
    }
}

$listener.Stop()
