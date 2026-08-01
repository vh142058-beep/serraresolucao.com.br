Add-Type -AssemblyName System.Drawing
$imgPath = 'C:\Users\vh142\.gemini\antigravity\scratch\maxi-calhas\logo\maxocalho-removebg-preview.png'
$bmp = [System.Drawing.Bitmap]::FromFile($imgPath)
$out = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $pixel = $bmp.GetPixel($x, $y)
        if ($pixel.A -gt 15) {
            # Luminance calculation
            $lum = ($pixel.R * 0.299 + $pixel.G * 0.587 + $pixel.B * 0.114) / 255.0
            
            # Chrome Metallic transformation (high specular contrast + bright silver body)
            $chromeVal = [Math]::Pow($lum, 0.4) * 230 + 25
            if ($chromeVal -gt 255) { $chromeVal = 255 }
            
            # Bright silver highlight curve
            $r = [int]$chromeVal
            $g = [int]$chromeVal
            $b = [int]($chromeVal * 1.05) # slight cool silver tint
            if ($b -gt 255) { $b = 255 }

            $chromeColor = [System.Drawing.Color]::FromArgb($pixel.A, $r, $g, $b)
            $out.SetPixel($x, $y, $chromeColor)
        } else {
            $out.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        }
    }
}

$out.Save('C:\Users\vh142\.gemini\antigravity\scratch\maxi-calhas\images\logo-transparent.png', [System.Drawing.Imaging.ImageFormat]::Png)
$out.Save('C:\Users\vh142\.gemini\antigravity\scratch\maxi-calhas\images\favicon.png', [System.Drawing.Imaging.ImageFormat]::Png)

$bmp.Dispose()
$out.Dispose()
Write-Host "Chrome effect applied to logo icon and text!"
