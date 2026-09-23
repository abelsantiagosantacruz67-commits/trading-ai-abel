@echo off
title Nexus AI Trading - Servidor Oficial IQ Option
color 0A
echo ========================================================
echo    NEXUS AI TRADING - MOTOR OFICIAL IQ OPTION
echo    Iniciando servidor en tiempo real...
echo ========================================================
echo.
cd /d "%~dp0"
echo Verificando dependencias...
echo.
echo Abriendo servidor en http://localhost:4000/ ...
start "" "http://localhost:4000/"
echo.
echo Presiona Ctrl+C para detener el servidor.
node backend/server.js
pause
