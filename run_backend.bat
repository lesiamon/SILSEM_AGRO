@echo off
cd /d "%~dp0"
echo ========================================================
echo   Starting SILSEM Agro Backend (FastAPI on Port 8000)
echo ========================================================
".venv1\Scripts\python.exe" -m uvicorn main:app --app-dir api --host 0.0.0.0 --port 8000
pause
