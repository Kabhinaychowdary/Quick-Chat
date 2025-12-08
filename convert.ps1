# TypeScript to JavaScript conversion script
$files = @(
    "accordion", "alert-dialog", "calendar", "carousel", "chart", "command", 
    "context-menu", "dialog", "drawer", "dropdown-menu", "form", "input-otp",
    "menubar", "navigation-menu", "pagination", "select", "sheet", "sidebar",
    "table", "tabs", "toggle-group", "tooltip"
)

foreach ($file in $files) {
    $tsxPath = "c:/Users/Abhinay Chowdary/OneDrive/fsd_project/components/ui/$file.tsx"
    if (Test-Path $tsxPath) {
        $content = Get-Content $tsxPath -Raw
        # Remove type imports
        $content = $content -replace "import\s+\{\s*([^}]*),\s*type\s+([^}]*)\s*\}\s+from\s+'([^']+)'", "import { `$1 } from '`$3'"
        $content = $content -replace "import\s+type\s+\{[^}]*\}\s+from\s+'[^']+'\s*\n", ""
        # Remove type annotations from function parameters
        $content = $content -replace ":\s*React\.ComponentProps<[^>]+>", ""
        $content = $content -replace ":\s*VariantProps<[^>]+>", ""
        # Remove type annotations from variables
        $content = $content -replace ":\s*React\.[A-Za-z]+", ""
        # Save as JSX
        $jsxPath = "c:/Users/Abhinay Chowdary/OneDrive/fsd_project/components/ui/$file.jsx"
        $content | Out-File -FilePath $jsxPath -Encoding UTF8 -NoNewline
        Write-Host "Converted $file.tsx to $file.jsx"
    }
}
