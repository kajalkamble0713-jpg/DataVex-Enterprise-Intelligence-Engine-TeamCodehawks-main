@echo off
echo ========================================
echo   DataVex - Starting Both Servers
echo ========================================
echo.
echo Starting Backend on port 5000...
start "DataVex Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend on port 3000...
start "DataVex Frontend" cmd /k "npm run dev"
echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul
