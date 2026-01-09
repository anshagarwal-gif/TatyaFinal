@REM Maven Wrapper startup script for Windows
@REM This allows running Maven without having it installed globally

@echo off

set MAVEN_VERSION=3.9.6
set MAVEN_HOME=%USERPROFILE%\.m2\wrapper\dists\apache-maven-%MAVEN_VERSION%-bin\apache-maven-%MAVEN_VERSION%
set MAVEN_BIN=%MAVEN_HOME%\bin\mvn.cmd

if not exist "%MAVEN_BIN%" (
    echo Maven not found. Please wait for setup to complete...
    exit /b 1
)

"%MAVEN_BIN%" %*
