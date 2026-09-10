$lines = Get-Content 'index.html'
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'three.min.js|greenhouse-3d.js') {
        Write-Output "$($i + 1): $($lines[$i])"
    }
}
