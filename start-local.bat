@echo off
setlocal

set "ROOT=%~dp0"
set "BACKEND_DIR=%ROOT%backend"
set "FRONTEND_DIR=%ROOT%frontend"

echo Starting The Think locally...
echo.

if not exist "%BACKEND_DIR%\package.json" (
  echo Backend package.json was not found at:
  echo %BACKEND_DIR%
  pause
  exit /b 1
)

if not exist "%FRONTEND_DIR%\package.json" (
  echo Frontend package.json was not found at:
  echo %FRONTEND_DIR%
  pause
  exit /b 1
)

echo Backend API: http://localhost:5000
echo Frontend app: http://localhost:5173
echo.

start "The Think - Backend API" cmd /k "cd /d "%BACKEND_DIR%" && npm.cmd run dev"
timeout /t 2 /nobreak >nul
start "The Think - Frontend" cmd /k "cd /d "%FRONTEND_DIR%" && npm.cmd run dev"

echo Services are starting in separate terminal windows.
echo Keep those windows open while developing locally.
echo.
pause
