@echo off
title Penshi Comic Studio
cd /d "%~dp0"

rem Already running? Just open the app.
netstat -ano | findstr ":8321" | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 goto open

rem Start the server minimized (close that window to stop Penshi).
rem Prefer "python"; fall back to the "py" launcher some installs use.
where python >nul 2>&1
if errorlevel 1 goto usepy
start "Penshi server" /min cmd /c "python server.py"
goto wait

:usepy
where py >nul 2>&1
if errorlevel 1 goto nopython
start "Penshi server" /min cmd /c "py server.py"

:wait
rem Give it a moment to come up before the browser asks for the page
timeout /t 2 /nobreak >nul

:open
start "" "http://localhost:8321"
exit /b

:nopython
echo Python was not found. Install it from https://www.python.org/downloads/
echo and tick "Add python.exe to PATH" in the installer, then run this again.
pause
