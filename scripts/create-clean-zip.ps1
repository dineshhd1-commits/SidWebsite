$sourceDir = "d:\d\sid\web"
$destinationZip = "d:\d\sid\web.zip"

if (Test-Path $destinationZip) {
    Remove-Item $destinationZip -Force
}

Add-Type -AssemblyName System.IO.Compression.FileSystem

$zip = [System.IO.Compression.ZipFile]::Open($destinationZip, [System.IO.Compression.ZipArchiveMode]::Create)

$excludeFolders = @("node_modules", ".next", ".git")

$count = 0
Get-ChildItem -Path $sourceDir -Recurse | ForEach-Object {
    $item = $_
    $relPath = $item.FullName.Substring($sourceDir.Length + 1)

    $skip = $false
    foreach ($ex in $excludeFolders) {
        if ($relPath.StartsWith($ex + "\") -or $relPath -eq $ex) {
            $skip = $true
            break
        }
    }

    if (-not $skip -and -not $item.PSIsContainer) {
        if ($item.Name -eq "tsconfig.tsbuildinfo" -or $item.Extension -eq ".zip") {
            $skip = $true
        }
    }

    if (-not $skip -and -not $item.PSIsContainer) {
        $entryName = "web/" + $relPath.Replace("\", "/")
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $item.FullName, $entryName, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
        $count++
    }
}

$zip.Dispose()
$fileSize = (Get-Item $destinationZip).Length / 1MB
Write-Host "Created Zip at $destinationZip"
Write-Host "Files added: $count"
Write-Host "Zip size: $([math]::Round($fileSize, 2)) MB"
