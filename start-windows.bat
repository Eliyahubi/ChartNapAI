@echo off
rem ChartNap AI - double-click launcher (Windows)
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Please install it from https://nodejs.org and run again.
  pause
  exit /b 1
)

if not exist node_modules (
  echo First run - installing dependencies, one time, about a minute...
  call npm install --no-audit --no-fund
  if errorlevel 1 ( pause & exit /b 1 )
)

echo Starting ChartNap AI...
start "" "http://localhost:5173"
call npm run dev
pause
