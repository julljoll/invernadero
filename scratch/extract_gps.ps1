Add-Type -AssemblyName System.Drawing

$filePath = "c:\VS CODE\CODIGO\Invernadero\invernadero\RAG\IMG_20260906_172527.jpg"
$img = [System.Drawing.Image]::FromFile($filePath)

function Get-RationalValue($bytes, $offset) {
    $num = [BitConverter]::ToUInt32($bytes, $offset)
    $den = [BitConverter]::ToUInt32($bytes, $offset + 4)
    if ($den -eq 0) { return 0 }
    return $num / $den
}

$propItems = $img.PropertyItems
Write-Host "Total Property Items: $($propItems.Count)"

$gpsProps = @{}
foreach ($item in $propItems) {
    if ($item.Id -ge 0x0000 -and $item.Id -le 0x001F) {
        $gpsProps[$item.Id] = $item
    }
}

Write-Host "Found $($gpsProps.Count) GPS properties."

# 0x0001: GPSLatitudeRef (ASCII)
# 0x0002: GPSLatitude (3 Rationals: deg, min, sec)
# 0x0003: GPSLongitudeRef (ASCII)
# 0x0004: GPSLongitude (3 Rationals: deg, min, sec)
# 0x0005: GPSAltitudeRef (Byte)
# 0x0006: GPSAltitude (Rational)

if ($gpsProps.ContainsKey(0x0001) -and $gpsProps.ContainsKey(0x0002)) {
    $latRef = [System.Text.Encoding]::ASCII.GetString($gpsProps[0x0001].Value).Trim([char]0)
    $latBytes = $gpsProps[0x0002].Value
    $latDeg = Get-RationalValue $latBytes 0
    $latMin = Get-RationalValue $latBytes 8
    $latSec = Get-RationalValue $latBytes 16
    
    $latDecimal = $latDeg + ($latMin / 60.0) + ($latSec / 3600.0)
    if ($latRef -eq "S") { $latDecimal = -$latDecimal }
    
    Write-Host "Latitude: $latDeg deg $latMin min $latSec sec $latRef ($latDecimal)"
} else {
    Write-Host "GPS Latitude not found."
}

if ($gpsProps.ContainsKey(0x0003) -and $gpsProps.ContainsKey(0x0004)) {
    $lonRef = [System.Text.Encoding]::ASCII.GetString($gpsProps[0x0003].Value).Trim([char]0)
    $lonBytes = $gpsProps[0x0004].Value
    $lonDeg = Get-RationalValue $lonBytes 0
    $lonMin = Get-RationalValue $lonBytes 8
    $lonSec = Get-RationalValue $lonBytes 16
    
    $lonDecimal = $lonDeg + ($lonMin / 60.0) + ($lonSec / 3600.0)
    if ($lonRef -eq "W") { $lonDecimal = -$lonDecimal }
    
    Write-Host "Longitude: $lonDeg deg $lonMin min $lonSec sec $lonRef ($lonDecimal)"
} else {
    Write-Host "GPS Longitude not found."
}

if ($gpsProps.ContainsKey(0x0007)) {
    $timeBytes = $gpsProps[0x0007].Value
    $h = Get-RationalValue $timeBytes 0
    $m = Get-RationalValue $timeBytes 8
    $s = Get-RationalValue $timeBytes 16
    Write-Host "GPS Time (UTC): $h : $m : $s"
}

if ($gpsProps.ContainsKey(0x001D)) {
    $dateStr = [System.Text.Encoding]::ASCII.GetString($gpsProps[0x001D].Value).Trim([char]0)
    Write-Host "GPS Date (UTC): $dateStr"
}


# Print other EXIF tags like camera make, model, date
foreach ($item in $propItems) {
    # 0x010F: Make, 0x0110: Model, 0x9003: DateTimeOriginal
    if ($item.Id -eq 0x010F -or $item.Id -eq 0x0110 -or $item.Id -eq 0x9003 -or $item.Id -eq 0x0132) {
        $val = [System.Text.Encoding]::ASCII.GetString($item.Value).Trim([char]0)
        Write-Host "Tag 0x$($item.Id.ToString('X4')): $val"
    }
}

$img.Dispose()
