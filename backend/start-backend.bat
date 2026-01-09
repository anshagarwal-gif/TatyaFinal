@echo off
REM Tatya Backend Start Script - Windows Batch Version
REM Double-click this file to start your Spring Boot backend

echo ========================================
echo    Starting Tatya Backend Server
echo ========================================
echo.

cd /d "%~dp0"

echo Starting Spring Boot application...
echo This will:
echo   1. Connect to MySQL database 'tatyaapp'
echo   2. Create all tables automatically
echo   3. Start the server on http://localhost:8080
echo.

call mvnw.cmd spring-boot:run

echo.
echo Backend stopped.
pause
