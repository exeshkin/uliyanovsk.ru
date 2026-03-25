@echo off
chcp 65001 >nul
echo ============================================
echo Остановка локального SSI сервера
echo ============================================
echo.

REM Находим процесс Python, запустивший server.py
for /f "tokens=2" %%i in ('tasklist /FI "IMAGENAME eq python.exe" /FO CSV ^| find "python"') do (
    echo Найден процесс Python с PID: %%i
    taskkill /F /PID %%i
    echo Процесс остановлен.
    goto :end
)

echo Сервер не запущен или процесс Python не найден.

:end
echo.
echo ============================================
pause
