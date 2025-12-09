@echo off
REM ========================================
REM Lily AI Assistant - Launcher (Debug)
REM ========================================

title Lily AI Assistant - Debug Mode

echo.
echo ========================================
echo    🌸 Lily AI Assistant 🌸
echo ========================================
echo.
echo Iniciando sistema (Modo Debug)...
echo.

REM Cambiar al directorio del script
cd /d "%~dp0"
echo Directorio actual: %CD%
echo.

REM Verificar Python
echo [1/5] Verificando Python...
python --version
if errorlevel 1 (
    echo.
    echo [ERROR] Python no esta instalado o no esta en PATH
    echo.
    echo SOLUCION:
    echo 1. Instala Python desde https://www.python.org/
    echo 2. Durante la instalacion, marca "Add Python to PATH"
    echo 3. Reinicia la computadora
    echo.
    pause
    exit /b 1
)
echo [OK] Python detectado
echo.

REM Verificar pip
echo [2/5] Verificando pip...
pip --version
if errorlevel 1 (
    echo.
    echo [ERROR] pip no esta disponible
    echo.
    echo SOLUCION:
    echo Ejecuta: python -m ensurepip --upgrade
    echo.
    pause
    exit /b 1
)
echo [OK] pip detectado
echo.

REM Instalar dependencias
echo [3/5] Instalando dependencias...
pip install -r requirements.txt
if errorlevel 1 (
    echo.
    echo [ERROR] No se pudieron instalar las dependencias
    echo.
    echo SOLUCION:
    echo 1. Ejecuta como Administrador
    echo 2. O ejecuta: pip install --user -r requirements.txt
    echo.
    pause
    exit /b 1
)
echo [OK] Dependencias instaladas
echo.

REM Verificar Ollama (opcional)
echo [4/5] Verificando Ollama...
curl -s http://127.0.0.1:11434/api/tags >nul 2>&1
if errorlevel 1 (
    echo [ADVERTENCIA] Ollama no esta ejecutandose
    echo.
    echo La aplicacion funcionara pero sin IA conversacional.
    echo Para habilitar IA:
    echo 1. Instala Ollama desde https://ollama.ai/
    echo 2. Ejecuta: ollama pull qwen3
    echo 3. Reinicia esta aplicacion
    echo.
    echo Presiona cualquier tecla para continuar sin Ollama...
    pause >nul
) else (
    echo [OK] Ollama detectado y en linea
)
echo.

REM Iniciar servidor
echo [5/5] Iniciando servidor...
echo.
echo ========================================
echo Servidor iniciando en: http://127.0.0.1:8000
echo ========================================
echo.
echo Microsoft Edge se abrira en 3 segundos...
echo.
echo Para detener el servidor: Cierra esta ventana o presiona Ctrl+C
echo ========================================
echo.

REM Esperar 3 segundos
timeout /t 3 /nobreak >nul

REM Abrir Microsoft Edge
start msedge http://127.0.0.1:8000

REM Iniciar servidor (mantener ventana abierta)
python main.py

REM Si llegamos aqui, el servidor se detuvo
echo.
echo ========================================
echo Servidor detenido
echo ========================================
echo.
pause

