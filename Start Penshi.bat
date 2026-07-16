@echo off
title Penshi Comic Studio
cd /d "%~dp0"

rem Already running? Just open the app.
netstat -ano | findstr ":8321" | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 goto open

rem Start the server in a minimized window (close that window to stop Penshi)
start "Penshi server" /min cmd /c "python server.py"

rem Give it a moment to come up before the browser asks for the page
timeout /t 2 /nobreak >nul

:open
start "" "http://localhost:8321"
