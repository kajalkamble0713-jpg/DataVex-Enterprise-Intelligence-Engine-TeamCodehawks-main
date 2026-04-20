@echo off
echo Fixing DataVex Database...
echo.

cd backend

echo Step 1: Removing old database...
del /F /Q prisma\dev.db 2>nul
del /F /Q prisma\dev.db-journal 2>nul

echo Step 2: Running migrations...
call npx prisma migrate dev --name fix_db

echo.
echo Database fixed!
echo.
echo Press any key to close...
pause >nul
