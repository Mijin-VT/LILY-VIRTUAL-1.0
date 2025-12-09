@echo off
REM Script simple para probar Python

echo ========================================
echo Probando Python
echo ========================================
echo.

REM Cambiar al directorio del script
cd /d "%~dp0"

echo Directorio actual:
cd
echo.

echo Probando Python:
python --version
echo.

echo Probando pip:
pip --version
echo.

echo Probando importaciones:
python -c "import sys; print('Python OK'); import fastapi; print('FastAPI OK')"
echo.

echo ========================================
echo Presiona cualquier tecla para cerrar
pause

