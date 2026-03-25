#!/usr/bin/env python3
"""
Локальный сервер с поддержкой SSI (Server Side Includes)
Эмулирует работу nginx для сайта uliyanovsk.ru

Запуск: python server.py
Доступ: http://localhost:8080
"""

import http.server
import socketserver
import os
import re
from pathlib import Path
from urllib.parse import urlparse, unquote

PORT = 8080
ROOT_DIR = Path(__file__).parent / "uliyanovsk.ru"

# MIME типы
MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".htm": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".mp4": "video/mp4",
    ".mp3": "audio/mpeg",
    ".webm": "video/webm",
    ".xml": "application/xml",
    ".txt": "text/plain",
}


class SSIHandler(http.server.SimpleHTTPRequestHandler):
    """Обработчик с поддержкой SSI директив"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT_DIR), **kwargs)

    def do_GET(self):
        """Обработка GET запросов"""
        parsed = urlparse(self.path)
        url_path = unquote(parsed.path)

        # Убираем ведущий слэш
        if url_path.startswith("/"):
            url_path = url_path[1:]

        # Если путь пустой или заканчивается на /, добавляем index.html
        if not url_path or url_path.endswith("/"):
            url_path += "index.html"

        file_path = ROOT_DIR / url_path

        # Проверка существования файла
        if not file_path.exists():
            self.send_error(404, "File not found")
            return

        # Определяем MIME тип
        ext = file_path.suffix.lower()
        content_type = MIME_TYPES.get(ext, "application/octet-stream")

        # Для HTML файлов обрабатываем SSI
        if ext in [".html", ".htm"]:
            try:
                content = self.process_ssi(file_path)
                self.send_response(200)
                self.send_header("Content-Type", content_type)
                self.send_header("Content-Length", len(content.encode("utf-8")))
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(content.encode("utf-8"))
                return
            except Exception as e:
                print(f"SSI Error: {e}")
                self.send_error(500, f"SSI processing error: {e}")
                return

        # Для остальных файлов отдаём как есть
        try:
            with open(file_path, "rb") as f:
                content = f.read()

            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", len(content))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(content)

        except Exception as e:
            self.send_error(500, f"Error reading file: {e}")

    def process_ssi(self, file_path: Path) -> str:
        """
        Обрабатывает SSI директивы в HTML файле
        
        Поддерживаемые директивы:
        <!--# include file="path/to/file.html" -->
        <!--# include virtual="/path/to/file.html" -->
        """
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
        except UnicodeDecodeError:
            with open(file_path, "r", encoding="cp1251") as f:
                content = f.read()

        # Паттерн для SSI include директив
        include_pattern = r'<!--#\s*include\s+(?:file|virtual)="([^"]+)"\s*-->'

        def replace_include(match):
            include_path = match.group(1)

            # virtual - путь от корня сайта
            # file - путь относительно текущего файла
            if match.group(0).find('virtual=') != -1:
                target_path = ROOT_DIR / include_path.lstrip("/")
            else:
                target_path = file_path.parent / include_path

            # Нормализуем путь (защита от ../)
            try:
                target_path = target_path.resolve()
                if not str(target_path).startswith(str(ROOT_DIR.resolve())):
                    print(f"Security: Access denied to {target_path}")
                    return match.group(0)
            except Exception as e:
                print(f"Path error: {e}")
                return match.group(0)

            if not target_path.exists():
                print(f"Include file not found: {target_path}")
                return f"<!-- SSI ERROR: File not found: {include_path} -->"

            # Рекурсивно обрабатываем SSI во включаемом файле
            try:
                with open(target_path, "r", encoding="utf-8") as f:
                    included_content = f.read()
                
                # Если включаемый файл тоже содержит SSI, обрабатываем его
                if "<!--#" in included_content and "include" in included_content:
                    # Временно меняем текущий файл для корректной обработки relative paths
                    included_content = self.process_ssi_recursive(target_path, included_content)
                
                return included_content
            except UnicodeDecodeError:
                with open(target_path, "r", encoding="cp1251") as f:
                    return f.read()
            except Exception as e:
                return f"<!-- SSI ERROR: {e} -->"

        # Заменяем все SSI директивы
        content = re.sub(include_pattern, replace_include, content)

        return content

    def process_ssi_recursive(self, file_path: Path, content: str) -> str:
        """Рекурсивная обработка SSI (для вложенных включений)"""
        include_pattern = r'<!--#\s*include\s+(?:file|virtual)="([^"]+)"\s*-->'

        def replace_include(match):
            include_path = match.group(1)

            if 'virtual=' in match.group(0):
                target_path = ROOT_DIR / include_path.lstrip("/")
            else:
                target_path = file_path.parent / include_path

            try:
                target_path = target_path.resolve()
                if not str(target_path).startswith(str(ROOT_DIR.resolve())):
                    return match.group(0)
            except:
                return match.group(0)

            if not target_path.exists():
                return f"<!-- SSI ERROR: File not found: {include_path} -->"

            try:
                with open(target_path, "r", encoding="utf-8") as f:
                    return f.read()
            except UnicodeDecodeError:
                with open(target_path, "r", encoding="cp1251") as f:
                    return f.read()
            except:
                return f"<!-- SSI ERROR: Cannot read {include_path} -->"

        return re.sub(include_pattern, replace_include, content)

    def log_message(self, format, *args):
        """Кастомное логирование"""
        print(f"[{self.log_date_time_string()}] {args[0]}")


class QuietHandler(SSIHandler):
    """Тихая версия без логов для каждого запроса"""
    def log_message(self, format, *args):
        pass


def run_server(quiet=False):
    """Запуск сервера"""
    handler = QuietHandler if quiet else SSIHandler

    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"=" * 60)
        print(f"SSI Server запущен")
        print(f"=" * 60)
        print(f"Корневая директория: {ROOT_DIR}")
        print(f"Доступ: http://localhost:{PORT}")
        print(f"=" * 60)
        print(f"Поддерживаемые SSI директивы:")
        print(f"  <!--# include file=\"path/to/file.html\" -->")
        print(f"  <!--# include virtual=\"/path/to/file.html\" -->")
        print(f"=" * 60)
        print(f"Нажмите Ctrl+C для остановки")
        print(f"=" * 60)

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nОстановка сервера...")
            httpd.shutdown()


if __name__ == "__main__":
    run_server()
