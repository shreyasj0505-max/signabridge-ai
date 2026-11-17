# SignaBridge AI - Zero-Dependency Local HTTP Server
# Serves the application over http://127.0.0.1:8080 and opens default browser

$port = 8080
$url = "http://127.0.0.1:$port/"
$prefix = "http://127.0.0.1:$port/"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    $port = 8090
    $prefix = "http://127.0.0.1:$port/"
    $url = $prefix
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($prefix)
    $listener.Start()
}

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "     SignaBridge AI - Local Development Server         " -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "Server running at: $url" -ForegroundColor Yellow
Write-Host "Opening web browser..." -ForegroundColor Gray
Write-Host "Press Ctrl+C in this terminal to stop the server." -ForegroundColor DarkGray
Write-Host "=======================================================" -ForegroundColor Cyan

# Launch browser
try {
    Start-Process $url
} catch {
    # If headless / background, continue
}

$rootPath = $PSScriptRoot

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/" -or $localPath -eq "") {
            $localPath = "/index.html"
        }

        # Normalize relative file path
        $rel = $localPath.TrimStart('/').Replace('/', '\')
        $filePath = Join-Path $rootPath $rel

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            # Set content-type
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = "text/plain"
            switch ($ext) {
                ".html" { $mime = "text/html; charset=utf-8" }
                ".htm"  { $mime = "text/html; charset=utf-8" }
                ".js"   { $mime = "application/javascript; charset=utf-8" }
                ".mjs"  { $mime = "application/javascript; charset=utf-8" }
                ".jsx"  { $mime = "text/javascript; charset=utf-8" }
                ".css"  { $mime = "text/css; charset=utf-8" }
                ".json" { $mime = "application/json; charset=utf-8" }
                ".png"  { $mime = "image/png" }
                ".jpg"  { $mime = "image/jpeg" }
                ".jpeg" { $mime = "image/jpeg" }
                ".svg"  { $mime = "image/svg+xml" }
                ".ico"  { $mime = "image/x-icon" }
            }

            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $localPath")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    } catch {
        # Loop continue on connection drops
    }
}
