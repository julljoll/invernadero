$lines = Get-Content 'index.html'
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'class="tab-pane') {
        Write-Output "$($i + 1): $($lines[$i])"
    }
}
