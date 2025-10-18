# Script para ejecutar migración de datos de appointments
# Ejecutar después de que el servidor esté funcionando

Write-Host "🔄 Ejecutando migración de datos de appointments..." -ForegroundColor Yellow

# Esperar a que el servidor esté listo
$maxAttempts = 30
$attempt = 0

do {
    $attempt++
    Write-Host "Intento $attempt/$maxAttempts - Verificando servidor..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/skillnet/docs" -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Servidor está funcionando!" -ForegroundColor Green
            break
        }
    } catch {
        Write-Host "⏳ Servidor aún no está listo, esperando..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
} while ($attempt -lt $maxAttempts)

if ($attempt -eq $maxAttempts) {
    Write-Host "❌ No se pudo conectar al servidor después de $maxAttempts intentos" -ForegroundColor Red
    exit 1
}

# Ejecutar migración de datos
Write-Host "🧹 Ejecutando migración de datos..." -ForegroundColor Yellow

try {
    $migrationResponse = Invoke-RestMethod -Uri "http://localhost:3000/appointments/migrate-data" -Method POST -ContentType "application/json"
    Write-Host "✅ Migración completada: $($migrationResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error ejecutando migración: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Proceso de migración completado exitosamente!" -ForegroundColor Green
