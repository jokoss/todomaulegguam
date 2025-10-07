# Fix navigation links for GitHub Pages
$files = @('about.html', 'services.html', 'contact.html', 'plumbing.html', 'sewage-septic.html', 'portable-toilet.html', 'gallery.html', '404.html')

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $content = $content -replace 'href="/"', 'href="index.html"'
        $content = $content -replace 'href="/about\.html"', 'href="about.html"'
        $content = $content -replace 'href="/services\.html"', 'href="services.html"'
        $content = $content -replace 'href="/contact\.html"', 'href="contact.html"'
        $content = $content -replace 'href="/plumbing\.html"', 'href="plumbing.html"'
        $content = $content -replace 'href="/sewage-septic\.html"', 'href="sewage-septic.html"'
        $content = $content -replace 'href="/portable-toilet\.html"', 'href="portable-toilet.html"'
        $content = $content -replace 'href="/gallery\.html"', 'href="gallery.html"'
        Set-Content $file $content
        Write-Host "Fixed links in $file"
    }
}
