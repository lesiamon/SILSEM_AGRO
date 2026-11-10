@echo off
cd /d "%~dp0"
echo Starting SILSEM Agro (Backend + Frontend)...
start "SILSEM Backend (FastAPI)" cmd /c "run_backend.bat"
start "SILSEM Frontend (React)" cmd /c "run_frontend.bat"
echo Services launched in separate console windows.
