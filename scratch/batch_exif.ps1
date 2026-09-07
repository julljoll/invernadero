Add-Type -AssemblyName System.Drawing

function Get-RationalValue($bytes, $offset) {
    if ($offset + 8 -gt $bytes.Length) { return 0 }
    $num = [BitConverter]::ToUInt32($bytes, $offset)
    $den = [BitConverter]::ToUInt32($bytes, $offset + 4)
    if ($den -eq 0) { return 0 }
    return $num / $den
}

$files = Get-ChildItem -Path "c:\VS CODE\CODIGO\Invernadero\invernadero\RAG\*.jpg" | Sort-Object Name

foreach ($f in $files) {
    Write-Host "=========================================="
    Write-Host "File: $($f.Name) ($($f.Length) bytes)"
    try {
        $img = [System.Drawing.Image]::FromFile($f.FullName)
        Write-Host "Resolution: $($img.Width)x$($img.Height)"
        
        $propMap = @{}
        foreach ($p in $img.PropertyItems) {
            $propMap[$p.Id] = $p
        }
        
        # DateTime
        if ($propMap.ContainsKey(0x9003)) {
            $dt = [System.Text.Encoding]::ASCII.GetString($propMap[0x9003].Value).Trim([char]0)
            Write-Host "DateTime: $dt"
        }
        
        # GPS
        if ($propMap.ContainsKey(0x0001) -and $propMap.ContainsKey(0x0002) -and $propMap.ContainsKey(0x0003) -and $propMap.ContainsKey(0x0004)) {
            $latRef = [System.Text.Encoding]::ASCII.GetString($propMap[0x0001].Value).Trim([char]0)
            $latBytes = $propMap[0x0002].Value
            $latDeg = Get-RationalValue $latBytes 0
            $latMin = Get-RationalValue $latBytes 8
            $latSec = Get-RationalValue $latBytes 16
            $latDec = $latDeg + ($latMin / 60.0) + ($latSec / 3600.0)
            if ($latRef -eq "S") { $latDec = -$latDec }
            
            $lonRef = [System.Text.Encoding]::ASCII.GetString($propMap[0x0003].Value).Trim([char]0)
            $lonBytes = $propMap[0x0004].Value
            $lonDeg = Get-RationalValue $lonBytes 0
            $lonMin = Get-RationalValue $lonBytes 8
            $lonSec = Get-RationalValue $lonBytes 16
            $lonDec = $lonDeg + ($lonMin / 60.0) + ($lonSec / 3600.0)
            if ($lonRef -eq "W") { $lonDec = -$lonDec }
            
            Write-Host "GPS: Lat $latDec ($latDeg° $latMin' $latSec"" $latRef), Lon $lonDec ($lonDeg° $lonMin' $lonSec"" $lonRef)"
            
            if ($propMap.ContainsKey(0x0006)) {
                $altBytes = $propMap[0x0006].Value
                $alt = Get-RationalValue $altBytes 0
                Write-Host "Altitude: $alt m"
            }
        } else {
            Write-Host "No GPS tags."
        }
        
        $img.Dispose()
    } catch {
        Write-Host "Error reading image: $_"
    }
}
