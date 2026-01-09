@echo off
REM Check Backend and Database Status

echo ========================================
echo    Tatya Project Status Checker
echo ========================================
echo.

echo [1] Checking if Backend is running...
powershell -Command "$response = try { Invoke-WebRequest -Uri 'http://localhost:8080' -TimeoutSec 2 -ErrorAction SilentlyContinue } catch { $null }; if ($response) { Write-Host '   ✅ Backend is RUNNING on http://localhost:8080' -ForegroundColor Green } else { Write-Host '   ❌ Backend is NOT running' -ForegroundColor Red; Write-Host '   Start it by running: start-backend.bat' -ForegroundColor Yellow }"
echo.

echo [2] Checking MySQL database...
mysql -u root -proot -e "USE tatyaapp; SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'tatyaapp';" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo    ✅ Database 'tatyaapp' is accessible
) else (
    echo    ❌ Cannot connect to database
    echo    Make sure MySQL is running and credentials are correct
)
echo.

echo [3] Database Tables:
mysql -u root -proot -e "USE tatyaapp; SHOW TABLES;" 2>nul
echo.

echo ========================================
pause
