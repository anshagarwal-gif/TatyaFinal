# Tatya Backend Start Script
# Run this script to start your Spring Boot backend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Starting Tatya Backend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to backend directory
Set-Location "C:\Users\Gauri\Desktop\Tatya final\TatyaFinal\backend"

Write-Host "Checking MySQL connection..." -ForegroundColor Yellow
Write-Host ""

# Start the Spring Boot application
Write-Host "Starting Spring Boot application..." -ForegroundColor Green
Write-Host "This will:" -ForegroundColor Yellow
Write-Host "  1. Connect to MySQL database 'tatyaapp'" -ForegroundColor White
Write-Host "  2. Create all tables automatically" -ForegroundColor White
Write-Host "  3. Start the server on http://localhost:8080" -ForegroundColor White
Write-Host ""

.\mvnw.cmd spring-boot:run

Write-Host ""
Write-Host "Backend stopped." -ForegroundColor Red
