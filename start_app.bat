@echo off
title SignaBridge AI
echo Starting SignaBridge AI Local Server...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start_server.ps1"
pause
