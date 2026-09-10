@echo off
title AGROVENECUA - Build y Servidor de Desarrollo (React + Vite)
cd /d "%~dp0"

echo ====================================================================
echo   AGROVENECUA -- La Cigarronera (Valle de Quibor)
echo ====================================================================
echo.

echo [1/2] Compilando y verificando tipos con npm run build...
call npm.cmd run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] La compilacion fallo. Revisa los errores en pantalla.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/2] Build completado con exito. Iniciando servidor de desarrollo...
echo.

call npm.cmd run dev
