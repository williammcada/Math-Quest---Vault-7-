@echo off
title MathQuest v0.9.1 - Gameplay and pilot privacy update
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install Node.js LTS from https://nodejs.org/
  pause
  exit /b 1
)
echo Installing the locked deployment tools...
call npm ci --no-audit --no-fund
if errorlevel 1 goto :failed
echo Running automated checks...
call npm test
if errorlevel 1 goto :failed
call npm run build
if errorlevel 1 goto :failed
echo Updating your existing mathquest-prototype Cloudflare Worker...
call npx wrangler deploy
if errorlevel 1 goto :failed
echo.
echo BACKEND DEPLOYMENT SUCCEEDED.
echo Upload the CONTENTS INSIDE public to your existing GitHub repository.
echo Keep GitHub Pages set to main and / (root).
echo The Netlify relay needs to remain active. No Netlify upload is normally required.
echo Read README_FIRST.txt for the connection test and classroom pilot.
pause
exit /b 0
:failed
echo.
echo Update stopped. Do not upload the frontend until this succeeds.
echo Copy the error above if you need help.
pause
exit /b 1
