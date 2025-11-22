# Script para publicar la colección de Postman
# Requiere: API Key de Postman

param(
    [Parameter(Mandatory=$true)]
    [string]$PostmanApiKey
)

$collectionPath = Join-Path $PSScriptRoot "Umascotas_API.postman_collection.json"

if (-not (Test-Path $collectionPath)) {
    Write-Host "Error: No se encontró el archivo de colección en $collectionPath" -ForegroundColor Red
    exit 1
}

Write-Host "Leyendo colección de Postman..." -ForegroundColor Yellow
$collectionContent = Get-Content $collectionPath -Raw

# Convertir a JSON válido
$collectionJson = $collectionContent | ConvertFrom-Json

Write-Host "Creando colección en Postman..." -ForegroundColor Yellow

# Crear la colección usando la API de Postman
$headers = @{
    "X-Api-Key" = $PostmanApiKey
    "Content-Type" = "application/json"
}

$body = @{
    collection = $collectionJson
} | ConvertTo-Json -Depth 100

try {
    $response = Invoke-RestMethod -Uri "https://api.getpostman.com/collections" `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "`n✅ Colección creada exitosamente!" -ForegroundColor Green
    Write-Host "`nID de la colección: $($response.collection.uid)" -ForegroundColor Cyan
    Write-Host "`nPara publicar y obtener el enlace público:" -ForegroundColor Yellow
    Write-Host "1. Ve a https://web.postman.com/" -ForegroundColor White
    Write-Host "2. Busca la colección 'Umascotas API - Documentación Completa'" -ForegroundColor White
    Write-Host "3. Haz clic en los tres puntos (...) > 'Publish'" -ForegroundColor White
    Write-Host "4. Selecciona 'Public' y haz clic en 'Publish Collection'" -ForegroundColor White
    Write-Host "5. Copia el enlace público que se genera" -ForegroundColor White
    
} catch {
    Write-Host "`n❌ Error al crear la colección:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "`nAsegúrate de que tu API Key sea válida." -ForegroundColor Yellow
    Write-Host "Puedes obtener tu API Key en: https://web.postman.com/settings/me/api-keys" -ForegroundColor Cyan
}

